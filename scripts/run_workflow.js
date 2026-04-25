#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.resolve(__dirname, "..");
const WORKFLOWS = new Set(["morning_routine", "weekly_review", "task_capture", "reminder_check", "weekend_brief"]);

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function loadWorkspaceEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) return;
    process.env[match[1]] = match[2];
  });
}

function fetchJson(hostname, reqPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        path: reqPath,
        method: "GET",
        headers,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function compareTodoistTasks(a, b) {
  const priorityDelta = (b.priority || 1) - (a.priority || 1);
  if (priorityDelta !== 0) return priorityDelta;
  const dueA = a.due?.date || "9999-12-31";
  const dueB = b.due?.date || "9999-12-31";
  return dueA.localeCompare(dueB);
}

function compareTodoistUpcomingTasks(a, b) {
  const dueA = a.due?.date || "9999-12-31";
  const dueB = b.due?.date || "9999-12-31";
  const dueDelta = dueA.localeCompare(dueB);
  if (dueDelta !== 0) return dueDelta;
  return (b.priority || 1) - (a.priority || 1);
}

function normalizeTodoistTasks(payload) {
  const tasks = payload.results || payload.tasks || payload;
  return Array.isArray(tasks) ? tasks : [];
}

function dedupeTodoistTasks(tasks) {
  const seen = new Set();
  const unique = [];

  for (const task of tasks) {
    const key = `${task.content || ""}::${task.due?.date || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(task);
  }

  return unique;
}

function categorizeTodoistTasks(tasks, runDate) {
  const overdue = [];
  const today = [];
  const upcoming = [];

  for (const task of tasks) {
    const dueDate = task.due?.date;
    if (!dueDate) {
      upcoming.push(task);
      continue;
    }
    if (dueDate < runDate) overdue.push(task);
    else if (dueDate === runDate) today.push(task);
    else upcoming.push(task);
  }

  overdue.sort(compareTodoistTasks);
  today.sort(compareTodoistTasks);
  upcoming.sort(compareTodoistUpcomingTasks);

  return { overdue, today, upcoming };
}

function dueWithinDays(task, runDate, maxDays) {
  const dueDate = task.due?.date;
  if (!dueDate) return false;
  const delta = daysBetween(runDate, dueDate);
  return delta > 0 && delta <= maxDays;
}

async function fetchTodoistSnapshot(runDate) {
  loadWorkspaceEnv();
  const token = process.env.TODOIST_API_TOKEN;
  if (!token) {
    return { topPriorities: [], overdue: [], today: [], upcoming: [], error: "TODOIST_API_TOKEN missing" };
  }

  try {
    const [allTasksPayload, next7Payload] = await Promise.all([
      fetchJson("api.todoist.com", "/api/v1/tasks", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
      fetchJson("api.todoist.com", "/api/v1/tasks?filter=next%207%20days", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    ]);

    const primaryTasks = dedupeTodoistTasks(normalizeTodoistTasks(allTasksPayload));
    const futureTasks = dedupeTodoistTasks(normalizeTodoistTasks(next7Payload));
    const categorizedPrimary = categorizeTodoistTasks(primaryTasks, runDate);
    const categorizedFuture = categorizeTodoistTasks(
      futureTasks.filter((task) => (task.due?.date || "") > runDate),
      runDate
    );

    // Top priorities = tasks due today OR overdue only
    // Tasks with no due date are NOT included in top priorities
    // (they appear in a separate section if needed)
    const dueTodayOrOverdue = [
      ...categorizedPrimary.today,
      ...categorizedPrimary.overdue,
    ].sort(compareTodoistTasks);

    return {
      topPriorities: dueTodayOrOverdue.slice(0, 3).map((task) => task.content),
      overdue: categorizedPrimary.overdue.map((task) => task.content),
      today: categorizedPrimary.today.map((task) => task.content),
      upcoming: categorizedFuture.upcoming
        .filter((task) => dueWithinDays(task, runDate, 2))
        .slice(0, 10)
        .map((task) => ({
        content: task.content,
        due_date: task.due?.date || "",
      })),
      error: null,
    };
  } catch (error) {
    return { topPriorities: [], overdue: [], today: [], upcoming: [], error: String(error.message || error) };
  }
}

function writeFile(relativePath, content, options, touchedFiles) {
  const abs = path.join(ROOT, relativePath);
  if (options.dryRun) {
    touchedFiles.add(relativePath);
    return;
  }
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, "utf8");
  touchedFiles.add(relativePath);
}

function parseArgs(argv) {
  if (argv.length === 0) {
    fail("Usage: run <workflow_name> [--date YYYY-MM-DD] --non-interactive [--dry-run] [--format json|telegram] [--input \"...\"] [--input-file file]");
  }

  const workflow = argv[0];
  const args = argv.slice(1);
  const flags = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) {
      fail(`Unexpected argument: ${token}`);
    }
    const key = token.slice(2);
    if (["non-interactive", "dry-run"].includes(key)) {
      flags[key] = true;
      continue;
    }
    if (i + 1 >= args.length || args[i + 1].startsWith("--")) {
      fail(`Missing value for --${key}`);
    }
    flags[key] = args[i + 1];
    i += 1;
  }

  return { workflow, flags };
}

function isValidDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const [y, m, d] = dateString.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function asUtcDate(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function dayName(dateString) {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return names[asUtcDate(dateString).getUTCDay()];
}

function monthName(index) {
  const names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return names[index];
}

function longDate(dateString) {
  const dt = asUtcDate(dateString);
  return `${dayName(dateString)}, ${monthName(dt.getUTCMonth())} ${String(dt.getUTCDate()).padStart(2, "0")}, ${dt.getUTCFullYear()}`;
}

function shortDate(dateString) {
  const dt = asUtcDate(dateString);
  return `${dayName(dateString)}, ${monthName(dt.getUTCMonth())} ${String(dt.getUTCDate()).padStart(2, "0")}, ${dt.getUTCFullYear()}`;
}

function formatCurrency(value) {
  if (!value || value === "-") return "";
  return value.trim();
}

function daysBetween(startDateString, endDateString) {
  const start = asUtcDate(startDateString).getTime();
  const end = asUtcDate(endDateString).getTime();
  return Math.round((end - start) / 86400000);
}

function isoDateFromParts(year, monthIndexZero, day) {
  return `${year}-${String(monthIndexZero + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function currentDateInTimezone(timeZone = "Asia/Manila") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function lastDayOfMonth(year, monthIndexZero) {
  return new Date(Date.UTC(year, monthIndexZero + 1, 0)).getUTCDate();
}

function parseMonthlyRule(dueDateRaw, runDate) {
  const year = asUtcDate(runDate).getUTCFullYear();
  const month = asUtcDate(runDate).getUTCMonth();
  const nthMatch = dueDateRaw.match(/^(\d{1,2})(?:st|nd|rd|th) of month$/i);

  if (nthMatch) {
    const day = Number(nthMatch[1]);
    return isoDateFromParts(year, month, day);
  }

  if (/^last day of month$/i.test(dueDateRaw.trim())) {
    return isoDateFromParts(year, month, lastDayOfMonth(year, month));
  }

  return null;
}

function parseAbsoluteRule(dueDateRaw, runDate) {
  const year = asUtcDate(runDate).getUTCFullYear();
  const iso = dueDateRaw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const withYear = dueDateRaw.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  const noYear = dueDateRaw.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  const months = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  if (withYear) {
    const month = months[withYear[1].toLowerCase()];
    if (month === undefined) return null;
    const day = Number(withYear[2]);
    const y = Number(withYear[3]);
    return isoDateFromParts(y, month, day);
  }

  if (noYear) {
    const month = months[noYear[1].toLowerCase()];
    if (month === undefined) return null;
    const day = Number(noYear[2]);
    return isoDateFromParts(year, month, day);
  }

  return null;
}

function parseReminderDueDate(value, runDate) {
  if (!value) return null;
  return parseAbsoluteRule(value, runDate) || parseMonthlyRule(value, runDate);
}

function parseReminders(remindersText, runDate, windowDays = 2) {
  const lines = remindersText.split("\n");
  const reminders = [];
  let current = null;

  for (const line of lines) {
    const titleMatch = line.match(/^###\s+(.+)$/);
    if (titleMatch) {
      if (current) reminders.push(current);
      current = { title: titleMatch[1].trim(), captured_at: "", due_by: "", reminder: "" };
      continue;
    }
    if (!current) continue;

    const capturedMatch = line.match(/^\*\*Date captured:\*\*\s+(.+)$/);
    if (capturedMatch) {
      current.captured_at = capturedMatch[1].trim();
      continue;
    }

    const dueMatch = line.match(/^\*\*Due by:\*\*\s+(.+)$/);
    if (dueMatch) {
      current.due_by = dueMatch[1].trim();
      continue;
    }

    const reminderMatch = line.match(/^\*\*Reminder:\*\*\s+(.+)$/);
    if (reminderMatch) {
      current.reminder = reminderMatch[1].trim();
    }
  }

  if (current) reminders.push(current);

  return reminders
    .map((item) => {
      const dueDate = parseReminderDueDate(item.due_by, runDate);
      if (!dueDate) return null;
      return {
        ...item,
        due_date: dueDate,
        due_in_days: daysBetween(runDate, dueDate),
      };
    })
    .filter(Boolean)
    .filter((item) => item.due_in_days <= windowDays)
    .sort((a, b) => a.due_in_days - b.due_in_days);
}

function parseFinances(financesText, ballysText, runDate) {
  const lines = financesText.split("\n");
  const entries = [];

  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length < 6) continue;
    if (!/^\d+$/.test(parts[1])) continue;

    const payment = parts[2];
    const amount = parts[3].replace(/—/g, "-");
    const dueDateRaw = parts[4];

    let dueDate = parseMonthlyRule(dueDateRaw, runDate);
    if (!dueDate) dueDate = parseAbsoluteRule(dueDateRaw, runDate);
    if (!dueDate) continue;

    entries.push({
      source: "finances",
      payment,
      amount,
      dueDateRaw,
      dueDate,
      isHighStake: /axa|domain/i.test(payment),
    });
  }

  for (const line of ballysText.split("\n")) {
    if (!line.startsWith("|")) continue;
    const parts = line.split("|").map((part) => part.trim());
    if (parts.length < 5) continue;
    if (!parts[1].match(/^\d{1,2}(?:st|nd|rd|th) of month$/i)) continue;
    const dueDate = parseMonthlyRule(parts[1], runDate);
    if (!dueDate) continue;
    entries.push({
      source: "ballys",
      payment: parts[2],
      amount: "",
      dueDateRaw: parts[1],
      dueDate,
      isHighStake: false,
    });
  }

  const dueItems = [];
  const runDay = asUtcDate(runDate).getUTCDay();

  for (const item of entries) {
    const delta = daysBetween(runDate, item.dueDate);
    const dueDay = asUtcDate(item.dueDate).getUTCDay();
    const dueIsWeekend = dueDay === 0 || dueDay === 6;
    const fridayBeforeWeekendDue =
      runDay === 5 && dueIsWeekend && (delta === 1 || delta === 2);

    const shouldInclude =
      delta === 0 ||
      delta === 1 ||
      (delta >= 2 && delta <= 3) ||
      (item.isHighStake && delta === 5) ||
      fridayBeforeWeekendDue;

    if (!shouldInclude) continue;

    let label = "";
    if (delta === 0) label = "due_today";
    else if (delta === 1) label = "due_tomorrow";
    else label = "due_in_days";

    dueItems.push({
      label,
      payment: item.payment,
      amount: formatCurrency(item.amount),
      due_date: item.dueDate,
      due_in_days: delta,
      source: item.source,
      weekend_note: fridayBeforeWeekendDue
        ? "Due on weekend - process today if needed."
        : "",
    });
  }

  const rcbc = dueItems.find((item) => /deposit to rcbc/i.test(item.payment));
  const ub = dueItems.find((item) => /ub\/citibank/i.test(item.payment));
  if (rcbc && ub) {
    rcbc.sequence_note = "Deposit first, then pay UB/Citibank.";
    ub.sequence_note = "Pay after RCBC deposit.";
  }

  return dueItems.sort((a, b) => a.due_in_days - b.due_in_days);
}

function extractNextActions(projectsText) {
  const lines = projectsText.split("\n");
  const actions = [];
  let currentProject = "";

  for (const line of lines) {
    const projectMatch = line.match(/^##\s+(.+)$/);
    if (projectMatch) {
      currentProject = projectMatch[1].trim();
      continue;
    }
    const actionMatch = line.match(/^\*\*Next Action:\*\*\s+(.+)$/);
    if (actionMatch && currentProject) {
      actions.push({
        project: currentProject,
        action: actionMatch[1].trim(),
      });
    }
  }
  return actions;
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(value) {
  const stop = new Set([
    "a",
    "an",
    "the",
    "to",
    "for",
    "on",
    "in",
    "of",
    "and",
    "is",
    "are",
    "reminder",
    "happening",
  ]);
  return new Set(
    normalizeText(value)
      .split(" ")
      .filter((token) => token && !stop.has(token))
  );
}

function jaccard(a, b) {
  const setA = tokenSet(a);
  const setB = tokenSet(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersect = 0;
  for (const token of setA) {
    if (setB.has(token)) intersect += 1;
  }
  const union = new Set([...setA, ...setB]).size;
  return intersect / union;
}

function likelySameTask(a, b) {
  const normalizedA = normalizeText(a);
  const normalizedB = normalizeText(b);
  if (normalizedA.includes(normalizedB) || normalizedB.includes(normalizedA)) return true;

  const setA = tokenSet(a);
  const setB = tokenSet(b);
  let intersect = 0;
  for (const token of setA) {
    if (setB.has(token)) intersect += 1;
  }
  const minSize = Math.min(setA.size, setB.size) || 1;
  const overlap = intersect / minSize;
  return overlap >= 0.5 || jaccard(a, b) >= 0.4;
}

function extractCompletionTasks(logText, marker) {
  const items = [];
  for (const line of logText.split("\n")) {
    const match = line.match(new RegExp(`^\\s*-\\s*${marker}\\s+(.+?)\\s*$`));
    if (!match) continue;
    items.push(match[1].replace(/\s+\(.*\)\s*$/, "").trim());
  }
  return items;
}

function detectStaleReminders(inboxText, dailyLogText) {
  const pending = [];
  for (const line of inboxText.split("\n")) {
    const match = line.match(/^\s*-\s*\[\s\]\s+(.+)$/);
    if (match) pending.push(match[1].trim());
  }

  const completed = extractCompletionTasks(dailyLogText, "✅");
  const stale = [];

  for (const reminder of pending) {
    const matched = completed.some((done) => likelySameTask(reminder, done));
    if (matched) {
      stale.push({
        reminder,
        reason: "Looks completed in daily log, still open in inbox.",
      });
    }
  }
  return stale;
}

function extractCarryovers(dailyLogText) {
  const carries = extractCompletionTasks(dailyLogText, "❌");
  const unique = [];
  for (const item of carries.reverse()) {
    if (!unique.includes(item)) unique.push(item);
  }
  return unique;
}

function extractBrainDumps() {
  const brainDumpPath = path.join(ROOT, "inbox/brain-dump.md");
  if (!fs.existsSync(brainDumpPath)) return [];
  
  const content = fs.readFileSync(brainDumpPath, "utf8");
  const items = [];
  
  for (const line of content.split("\n")) {
    const match = line.match(/^-\s+(.+)$/);
    if (match) {
      const item = match[1].trim();
      // Skip metadata/header lines
      if (item && !item.startsWith("[") && !item.startsWith("<") && item.length > 10) {
        items.push(item);
      }
    }
  }
  
  return items.slice(-5); // Return last 5 items
}

function upcomingSunday(runDate) {
  const dt = asUtcDate(runDate);
  const day = dt.getUTCDay();
  const add = day === 0 ? 0 : 7 - day;
  const sunday = new Date(dt.getTime() + add * 86400000);
  return isoDateFromParts(
    sunday.getUTCFullYear(),
    sunday.getUTCMonth(),
    sunday.getUTCDate()
  );
}

function isPreachingWeek(churchText, runDate) {
  const sunday = upcomingSunday(runDate);
  const sundayLabel = longDate(sunday);
  const escaped = sundayLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`${escaped}:[^\\n]*not preaching`, "i");
  return !regex.test(churchText);
}

function defaultTop3(carryovers, nextActions, preaching, runDate, todoistTopPriorities = [], brainDumps = [], reminders = []) {
  const day = dayName(runDate);
  const top = [];
  const usedContent = new Set();

  function add(label, content, source) {
    if (top.length >= 3) return false;
    if (usedContent.has(content)) return false;
    usedContent.add(content);
    top.push(label);
    return true;
  }

  // --- PRIORITY 1: Tasks due today or overdue ---
  for (const task of todoistTopPriorities) {
    if (!add(`[Todoist] ${task}`, task, "due_today_or_overdue")) break;
  }

  // --- PRIORITY 2: Carryovers (overdue items) ---
  for (const task of carryovers) {
    if (!add(`[Carryover] ${task}`, task, "overdue")) break;
  }

  // --- PRIORITY 3: Day-specific context from preferences ---
  if (day === "Tuesday" || day === "Wednesday") {
    add(`[Bally's] Focus on team deliverables and office communications`, "ballys_focus", "day_context");
  }
  if (day === "Friday" || day === "Saturday") {
    add(`[LifeCity] Sermon prep and ministry focus`, "lifecity_focus", "day_context");
  }
  if (preaching && ["Thursday", "Friday", "Saturday", "Sunday"].includes(day)) {
    add(`[Church] Continue sermon development for Sunday`, "sermon_prep", "day_context");
  }

  // --- PRIORITY 4: Active project next actions (only if relevant to today's role) ---
  const solopreneurDays = ["Monday", "Thursday"];
  const ballysDays = ["Tuesday", "Wednesday"];
  if (solopreneurDays.includes(day) || ballysDays.includes(day)) {
    for (const action of nextActions.slice(0, 2)) {
      const content = `${action.project}: ${action.action}`;
      if (!add(`[Solopreneur] ${content}`, content, "project")) break;
    }
  }

  // --- PRIORITY 5: Mind dumps and learnings (low-pressure, only if nothing urgent) ---
  if (top.length < 3 && brainDumps.length > 0) {
    for (const dump of brainDumps.slice(0, 2)) {
      if (!add(`[Idea] ${dump}`, dump, "brain_dump")) break;
    }
  }

  // --- FALLBACK: Generic focus suggestion ---
  if (top.length < 3) {
    add("[Focus] Review and clear one active project blocker", "project_blocker", "fallback");
  }
  while (top.length < 3) {
    add("[Focus] Protect time for deep work on highest-impact task", "deep_work", "fallback");
  }

  return top.slice(0, 3);
}

function parseSectionsByHeading(markdownText) {
  const lines = markdownText.split("\n");
  const sections = [];
  let currentStart = -1;
  let currentHeading = "";

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].startsWith("## ")) {
      if (currentStart >= 0) {
        sections.push({
          heading: currentHeading,
          start: currentStart,
          end: i - 1,
        });
      }
      currentStart = i;
      currentHeading = lines[i];
    }
  }
  if (currentStart >= 0) {
    sections.push({
      heading: currentHeading,
      start: currentStart,
      end: lines.length - 1,
    });
  }

  return { lines, sections };
}

function upsertRecommendedForDate(dailyLogText, runDate, top3) {
  const day = dayName(runDate);
  const headingPrefix = `## ${runDate} (${day}) - Recommended for Today`;
  const headingPrefixAlt = `## ${runDate} (${day}) — Recommended for Today`;
  const parsed = parseSectionsByHeading(dailyLogText);
  const keepLine = new Array(parsed.lines.length).fill(true);

  for (const section of parsed.sections) {
    const normalizedHeading = section.heading.replace("—", "-");
    const isTarget =
      normalizedHeading.includes(`## ${runDate}`) &&
      normalizedHeading.includes("Recommended for Today");
    if (!isTarget) continue;
    for (let i = section.start; i <= section.end; i += 1) {
      keepLine[i] = false;
    }
  }

  const kept = [];
  for (let i = 0; i < parsed.lines.length; i += 1) {
    if (keepLine[i]) kept.push(parsed.lines[i]);
  }

  let output = kept.join("\n").replace(/\n+$/, "");
  if (!output.endsWith("---")) output += "\n\n---";

  output += `\n\n${headingPrefixAlt}\n\n`;
  top3.forEach((item, index) => {
    output += `${index + 1}. ${item}\n`;
  });

  // Keep compatibility for tools that expect hyphen separator.
  output = output.replace(headingPrefixAlt, headingPrefixAlt);

  return output.trimEnd() + "\n";
}

function toDateRange(runDate, daysBack) {
  const dt = asUtcDate(runDate);
  const start = new Date(dt.getTime() - daysBack * 86400000);
  return isoDateFromParts(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
}

function extractWeeklySignals(dailyLogText, runDate) {
  const startDate = toDateRange(runDate, 7);
  const lines = dailyLogText.split("\n");
  const wins = [];
  const misses = [];

  let activeDate = null;
  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+(\d{4}-\d{2}-\d{2})\s+\(/);
    if (sectionMatch) {
      activeDate = sectionMatch[1];
      continue;
    }
    if (!activeDate) continue;
    if (activeDate < startDate || activeDate > runDate) continue;

    const done = line.match(/^\s*-\s*✅\s+(.+)$/);
    if (done) wins.push(done[1].replace(/\s+\(.*\)\s*$/, "").trim());

    const missed = line.match(/^\s*-\s*❌\s+(.+)$/);
    if (missed) misses.push(missed[1].replace(/\s+\(.*\)\s*$/, "").trim());
  }

  return {
    wins: Array.from(new Set(wins)).slice(-10),
    misses: Array.from(new Set(misses)).slice(-10),
  };
}

function ensureRequiredFiles(files) {
  const missing = files.filter((relativePath) => !fs.existsSync(path.join(ROOT, relativePath)));
  if (missing.length > 0) {
    fail(`Missing required files: ${missing.join(", ")}`);
  }
}

function preflight(runDate, workflow, options) {
  if (!WORKFLOWS.has(workflow)) {
    fail(`Unsupported workflow "${workflow}". Supported: ${Array.from(WORKFLOWS).join(", ")}`);
  }
  if (!isValidDate(runDate)) {
    fail(`Invalid --date "${runDate}". Expected YYYY-MM-DD.`);
  }
  if (!options.nonInteractive) {
    fail("This runner currently requires --non-interactive.");
  }
}

function postflightDaily(result) {
  const errors = [];
  if (!Array.isArray(result.top_3) || result.top_3.length !== 3) {
    errors.push("top_3 must have exactly 3 items.");
  }
  if (result.sections && result.sections.friday_items_expected && !result.sections.friday_items_included) {
    errors.push("Friday-specific sections expected but missing.");
  }
  if (
    result.sections &&
    result.sections.sermon_window &&
    result.sections.preaching === false &&
    result.sections.sermon_items_included
  ) {
    errors.push("Sermon section should be omitted for non-preaching week.");
  }
  if (!result.validation || !result.validation.daily_log_top3_written) {
    errors.push("Daily top 3 was not written to the daily briefing log.");
  }
  return errors;
}

function writeStatusArtifact(runDate, workflow, success, touchedFiles, blockers, options) {
  const payload = {
    date: runDate,
    workflow,
    status: success ? "success" : "failed",
    files_touched: Array.from(touchedFiles),
    blockers: blockers || [],
    timestamp_utc: new Date().toISOString(),
  };
  writeFile(
    `memory/logs/status/status-${runDate}-${workflow}.json`,
    `${JSON.stringify(payload, null, 2)}\n`,
    options,
    touchedFiles
  );
}

async function runMorningRoutine(runDate, options, touchedFiles) {
  const required = [
    "context/projects.md",
    "context/goals.md",
    "context/people.md",
    "context/ballys.md",
    "context/lifecity_church.md",
    "context/finances.md",
    "memory/decisions.md",
    "memory/arwenhq_mvp_checklist.md",
    "memory/daily_briefing_log.md",
    "inbox/README.md",
  ];
  ensureRequiredFiles(required);

  const projects = readFile("context/projects.md");
  const ballys = readFile("context/ballys.md");
  const church = readFile("context/lifecity_church.md");
  const finances = readFile("context/finances.md");
  const dailyLog = readFile("memory/daily_briefing_log.md");
  const inbox = readFile("inbox/README.md");
  const todoist = await fetchTodoistSnapshot(runDate);

  const preaching = isPreachingWeek(church, runDate);
  const carryovers = todoist.overdue.slice(0, 5);
  const nextActions = extractNextActions(projects);
  const brainDumps = extractBrainDumps();
  const top3 = defaultTop3(carryovers, nextActions, preaching, runDate, todoist.topPriorities, brainDumps);
  const dueItems = parseFinances(finances, ballys, runDate);
  const staleReminders = detectStaleReminders(inbox, dailyLog);
  const day = dayName(runDate);

  const result = {
    schema_version: "1.0.0",
    date: runDate,
    date_label: longDate(runDate),
    workflow: "morning_routine",
    top_3: top3,
    todoist: {
      top_priorities: todoist.topPriorities,
      overdue: todoist.overdue,
      due_today: todoist.today,
      upcoming: todoist.upcoming,
      error: todoist.error,
    },
    carryovers: carryovers.map((task) => ({ task })),
    due_items: dueItems,
    stale_reminders: staleReminders,
    preaching: {
      upcoming_sunday: upcomingSunday(runDate),
      is_preaching: preaching,
    },
    sections: {
      sermon_window: ["Thursday", "Friday", "Saturday", "Sunday"].includes(day),
      preaching,
      sermon_items_included: preaching && ["Thursday", "Friday", "Saturday", "Sunday"].includes(day),
      friday_items_expected: day === "Friday",
      friday_items_included: day === "Friday",
    },
    validation: {
      daily_log_top3_written: false,
    },
  };

  const normalizedDailyLog = upsertRecommendedForDate(dailyLog, runDate, top3);
  writeFile("memory/daily_briefing_log.md", normalizedDailyLog, options, touchedFiles);
  result.validation.daily_log_top3_written = true;

  writeFile(
    `memory/logs/runs/morning_routine-${runDate}.json`,
    `${JSON.stringify(result, null, 2)}\n`,
    options,
    touchedFiles
  );
  writeFile(
    "memory/state/operating_state.json",
    `${JSON.stringify(
      {
        date: runDate,
        workflow: "morning_routine",
        active_priorities: top3,
        carryovers: result.carryovers,
        preaching_override: { is_preaching: preaching, upcoming_sunday: upcomingSunday(runDate) },
        due_payments: dueItems,
      },
      null,
      2
    )}\n`,
    options,
    touchedFiles
  );

  const postErrors = postflightDaily(result);
  if (postErrors.length > 0) {
    throw new Error(`Postflight failed: ${postErrors.join(" | ")}`);
  }

  return result;
}

function appendWeeklySummary(runDate, summary, options, touchedFiles) {
  const filePath = `memory/logs/week-${runDate}.md`;
  writeFile(filePath, summary, options, touchedFiles);
}

async function runWeekendBrief(runDate, options, touchedFiles) {
  const required = [
    "context/projects.md",
    "context/lifecity_church.md",
    "memory/daily_briefing_log.md",
  ];
  ensureRequiredFiles(required);

  const church = readFile("context/lifecity_church.md");
  const dailyLog = readFile("memory/daily_briefing_log.md");
  const todoist = await fetchTodoistSnapshot(runDate);

  const preaching = isPreachingWeek(church, runDate);
  const day = dayName(runDate);
  const nextSunday = upcomingSunday(runDate);
  const nextWeekTop3 = todoist.topPriorities.slice(0, 3);

  const carryovers = extractCarryovers(dailyLog).slice(0, 3);

  const result = {
    schema_version: "1.0.0",
    date: runDate,
    date_label: longDate(runDate),
    workflow: "weekend_brief",
    day,
    preaching,
    upcoming_sunday: nextSunday,
    next_week_priorities: nextWeekTop3,
    carryovers,
    todoist: {
      overdue: todoist.overdue,
      due_today: todoist.today,
      upcoming: todoist.upcoming,
    },
  };

  writeFile(
    `memory/logs/runs/weekend_brief-${runDate}.json`,
    `${JSON.stringify(result, null, 2)}\n`,
    options,
    touchedFiles
  );

  return result;
}

function renderWeekendBriefTelegram(result) {
  const sections = [];
  const day = result.day || "";
  sections.push(`**Weekend Brief — ${day}, ${result.date}**`);

  const weekendFocus = [];
  if (result.preaching) {
    weekendFocus.push("⛪ Prepare and deliver Sunday sermon");
  }
  if (result.carryovers && result.carryovers.length > 0) {
    weekendFocus.push(`📋 Clear 1-2 carryovers: ${result.carryovers[0]}`);
  }
  if (weekendFocus.length === 0) {
    weekendFocus.push("🧘 Rest and recharge — no major work blocks");
  }
  sections.push(`**🎯 Weekend Focus**\n${renderBulletList(weekendFocus)}`);

  const sermonStatus = result.preaching ? "Yes" : "No";
  sections.push(`**⛪ Church / Sermon Status**\n- Preaching this Sunday (${result.upcoming_sunday})? ${sermonStatus}`);

  if (result.next_week_priorities && result.next_week_priorities.length > 0) {
    sections.push(`**📅 Upcoming for Next Week**\n${result.next_week_priorities.map((item, index) => `${index + 1}. ${item}`).join("\n")}`);
  }

  sections.push(`**🧘 Rest & Personal**\n- Protect rest time, family, and health. Don't let work bleed into the weekend.`);

  const overdue = result.todoist?.overdue || [];
  if (overdue.length > 0 && overdue.length <= 3) {
    sections.push(`**💡 One Quick Win (Optional)**\n- If energy permits: clear ${overdue[0]} before Monday.`);
  }

  return sections.join("\n\n");
}

function runWeeklyReview(runDate, options, touchedFiles) {
  const required = [
    "context/projects.md",
    "context/goals.md",
    "context/ballys.md",
    "context/lifecity_church.md",
    "memory/daily_briefing_log.md",
  ];
  ensureRequiredFiles(required);

  const projects = readFile("context/projects.md");
  const church = readFile("context/lifecity_church.md");
  const dailyLog = readFile("memory/daily_briefing_log.md");

  const signals = extractWeeklySignals(dailyLog, runDate);
  const nextActions = extractNextActions(projects);
  const preaching = isPreachingWeek(church, runDate);

  const result = {
    schema_version: "1.0.0",
    workflow: "weekly_review",
    date: runDate,
    week_window_start: toDateRange(runDate, 7),
    week_window_end: runDate,
    wins: signals.wins,
    misses: signals.misses,
    next_week_priorities: nextActions.slice(0, 5).map((item) => `${item.project}: ${item.action}`),
    preaching_status: {
      upcoming_sunday: upcomingSunday(runDate),
      is_preaching: preaching,
    },
  };

  const summary = [
    `# Weekly Review - ${runDate}`,
    "",
    "## Wins",
    ...(result.wins.length > 0 ? result.wins.map((item) => `- ✅ ${item}`) : ["- (No wins logged)"]),
    "",
    "## Misses",
    ...(result.misses.length > 0 ? result.misses.map((item) => `- ❌ ${item}`) : ["- (No misses logged)"]),
    "",
    "## Next Week Priorities",
    ...(result.next_week_priorities.length > 0
      ? result.next_week_priorities.map((item) => `- ${item}`)
      : ["- (No priorities inferred)"]),
    "",
    "## Preaching Status",
    `- Upcoming Sunday: ${result.preaching_status.upcoming_sunday}`,
    `- Is preaching: ${result.preaching_status.is_preaching ? "Yes" : "No"}`,
    "",
  ].join("\n");

  appendWeeklySummary(runDate, summary, options, touchedFiles);
  writeFile(
    `memory/logs/runs/weekly_review-${runDate}.json`,
    `${JSON.stringify(result, null, 2)}\n`,
    options,
    touchedFiles
  );
  writeFile(
    "memory/state/operating_state.json",
    `${JSON.stringify(
      {
        date: runDate,
        workflow: "weekly_review",
        weekly_snapshot: result,
      },
      null,
      2
    )}\n`,
    options,
    touchedFiles
  );

  return result;
}

function runReminderCheck(runDate, options, touchedFiles) {
  const required = ["memory/reminders.md"];
  ensureRequiredFiles(required);

  const reminders = readFile("memory/reminders.md");
  const activeReminders = parseReminders(reminders, runDate, 2);

  const result = {
    schema_version: "1.0.0",
    workflow: "reminder_check",
    date: runDate,
    date_label: longDate(runDate),
    reminders_due_soon: activeReminders,
  };

  writeFile(
    `memory/logs/runs/reminder_check-${runDate}.json`,
    `${JSON.stringify(result, null, 2)}\n`,
    options,
    touchedFiles
  );

  writeFile(
    "memory/state/operating_state.json",
    `${JSON.stringify(
      {
        date: runDate,
        workflow: "reminder_check",
        reminders_due_soon: activeReminders,
      },
      null,
      2
    )}\n`,
    options,
    touchedFiles
  );

  return result;
}

function readTaskCaptureInput(flags) {
  if (flags.input) return String(flags.input);
  if (flags["input-file"]) {
    return fs.readFileSync(path.join(ROOT, flags["input-file"]), "utf8");
  }
  if (!process.stdin.isTTY) {
    return fs.readFileSync(0, "utf8");
  }
  return "";
}

function classifyCaptureItem(raw) {
  const text = raw.trim();
  const lower = text.toLowerCase();
  if (!text) return null;
  if (/\bdecid(ed|e|ing)\b|\bdecision\b/.test(lower)) return "decision";
  if (/\bidea\b|\bexplore\b|\bmaybe\b|\bconsider\b/.test(lower)) return "idea";
  if (
    /\b(mon(day)?|tue(s(day)?)?|wed(nesday)?|thu(rs(day)?)?|fri(day)?|sat(urday)?|sun(day)?|tomorrow|today|next week|due)\b/.test(
      lower
    )
  )
    return "reminder";
  return "task";
}

function splitCaptureItems(inputText) {
  const output = [];
  for (const line of inputText.split("\n")) {
    const clean = line.replace(/^\s*[-*]\s*/, "").replace(/^\s*\d+\.\s*/, "").trim();
    if (!clean) continue;
    output.push(clean);
  }
  return output;
}

function appendUniquePendingItems(inboxText, items) {
  const lines = inboxText.split("\n");
  const pendingIndex = lines.findIndex((line) => line.trim() === "## Pending Items");
  if (pendingIndex < 0) return inboxText;

  const existing = new Set();
  for (const line of lines) {
    const match = line.match(/^\s*-\s*\[\s\]\s+(.+)$/);
    if (match) existing.add(normalizeText(match[1]));
  }

  const insert = [];
  for (const item of items) {
    if (existing.has(normalizeText(item))) continue;
    insert.push(`- [ ] ${item}`);
    existing.add(normalizeText(item));
  }
  if (insert.length === 0) return inboxText;

  let insertPos = pendingIndex + 1;
  while (insertPos < lines.length && lines[insertPos].trim() !== "") {
    insertPos += 1;
  }

  const updated = [...lines.slice(0, insertPos), ...insert, ...lines.slice(insertPos)];
  return updated.join("\n");
}

function appendDecisions(decisionsText, decisions, runDate) {
  if (decisions.length === 0) return decisionsText;
  let output = decisionsText.replace(/\s+$/, "");
  for (const decision of decisions) {
    output += `\n\n### ${decision.slice(0, 72)}\n`;
    output += `**Date:** ${runDate}\n`;
    output += "**Context:** Captured via non-interactive task_capture workflow.\n";
    output += `**Decision:** ${decision}\n`;
    output += "**Rationale:** Logged for continuity.\n";
    output += "**Impact:** To be confirmed.\n";
  }
  return `${output}\n`;
}

function appendIdeas(learningsText, ideas, runDate) {
  if (ideas.length === 0) return learningsText;
  let output = learningsText.replace(/\s+$/, "");
  for (const idea of ideas) {
    output += `\n\n### ${idea.slice(0, 72)}\n`;
    output += `**Date:** ${runDate}\n`;
    output += "**Source:** Task Capture / Idea\n";
    output += `**Insight:** ${idea}\n`;
    output += "**Applies to:** TBD\n";
  }
  return `${output}\n`;
}

function runTaskCapture(runDate, flags, options, touchedFiles) {
  const required = ["inbox/README.md", "memory/decisions.md", "memory/learnings.md"];
  ensureRequiredFiles(required);

  const inputText = readTaskCaptureInput(flags);
  if (!inputText.trim()) {
    fail("task_capture requires input via --input, --input-file, or stdin.");
  }

  const items = splitCaptureItems(inputText);
  const classified = items
    .map((item) => ({ item, kind: classifyCaptureItem(item) }))
    .filter((entry) => entry.kind);

  const tasks = classified.filter((entry) => entry.kind === "task").map((entry) => entry.item);
  const reminders = classified.filter((entry) => entry.kind === "reminder").map((entry) => entry.item);
  const ideas = classified.filter((entry) => entry.kind === "idea").map((entry) => entry.item);
  const decisions = classified.filter((entry) => entry.kind === "decision").map((entry) => entry.item);

  const inboxText = readFile("inbox/README.md");
  const decisionsText = readFile("memory/decisions.md");
  const learningsText = readFile("memory/learnings.md");

  const inboxUpdated = appendUniquePendingItems(inboxText, [...tasks, ...reminders]);
  const decisionsUpdated = appendDecisions(decisionsText, decisions, runDate);
  const learningsUpdated = appendIdeas(learningsText, ideas, runDate);

  writeFile("inbox/README.md", inboxUpdated, options, touchedFiles);
  writeFile("memory/decisions.md", decisionsUpdated, options, touchedFiles);
  writeFile("memory/learnings.md", learningsUpdated, options, touchedFiles);

  const result = {
    schema_version: "1.0.0",
    workflow: "task_capture",
    date: runDate,
    captured_count: classified.length,
    tasks,
    reminders,
    ideas,
    decisions,
  };

  writeFile(
    `memory/logs/runs/task_capture-${runDate}.json`,
    `${JSON.stringify(result, null, 2)}\n`,
    options,
    touchedFiles
  );
  writeFile(
    "memory/state/operating_state.json",
    `${JSON.stringify(
      {
        date: runDate,
        workflow: "task_capture",
        last_capture: result,
      },
      null,
      2
    )}\n`,
    options,
    touchedFiles
  );

  return result;
}

function printResult(result) {
  console.log(JSON.stringify(result, null, 2));
}

function renderBulletList(items, emptyLabel = "- None") {
  if (!items || items.length === 0) return emptyLabel;
  return items.map((item) => `- ${item}`).join("\n");
}

function renderUpcomingList(items) {
  if (!items || items.length === 0) return "- None within the current 2-day window";
  return items.map((item) => `- ${item.content} — ${item.due_date}`).join("\n");
}

function renderDueItems(items) {
  if (!items || items.length === 0) return "";
  return items
    .map((item) => {
      if (item.label === "due_today") return `- 🔴 **Due today:** ${item.payment}`;
      if (item.label === "due_tomorrow") return `- ⚠️ **Due tomorrow:** ${item.payment}`;
      return `- 📅 **Due in ${item.due_in_days} days:** ${item.payment}`;
    })
    .join("\n");
}

function buildFocusSuggestion(result) {
  const overdue = result.todoist?.overdue || [];
  const dueToday = result.todoist?.due_today || [];
  const dueItems = result.due_items || [];
  const top3 = result.top_3 || [];

  if (overdue.length > 0) {
    const firstOverdue = overdue[0];
    const firstToday = dueToday[0];
    if (firstToday) {
      return `Clear the overdue stack first, starting with ${firstOverdue}, then move to ${firstToday}.`;
    }
    return `Clear the overdue stack first, starting with ${firstOverdue}.`;
  }

  const dueTodayBill = dueItems.find((item) => item.label === "due_today");
  if (dueTodayBill && dueToday[0]) {
    return `Handle ${dueTodayBill.payment} early, then move into ${dueToday[0]}.`;
  }

  if (top3.length >= 2) {
    return `Start with ${top3[0].replace(/^\[[^\]]+\]\s*/, "")}, then focus on ${top3[1].replace(/^\[[^\]]+\]\s*/, "")}.`;
  }

  return "Protect one uninterrupted block for your highest-priority task first.";
}

function renderMorningRoutineTelegram(result) {
  const sections = [];
  sections.push(`**Daily Briefing — ${shortDate(result.date)}**`);
  sections.push(`**Today's Top 3 Priorities**\n${result.top_3.map((item, index) => `${index + 1}. ${item}`).join("\n")}`);
  sections.push(`**✅ Tasks (Todoist Source of Truth)**\n\n**🔴 Past Due (Missed)**\n${renderBulletList(result.todoist?.overdue)}\n\n**🎯 Due Today**\n${renderBulletList(result.todoist?.due_today)}\n\n**📅 Upcoming**\n${renderUpcomingList(result.todoist?.upcoming)}`);

  const bills = renderDueItems(result.due_items);
  if (bills) {
    sections.push(`**💳 Bills & Payments**\n${bills}`);
  }

  if (result.carryovers && result.carryovers.length > 0) {
    sections.push(`**Flags & Blockers**\n- Carryovers / overdue tasks still open:\n${renderBulletList(result.carryovers.map((item) => item.task))}`);
  }

  sections.push(`**Focus Suggestion**\n- ${buildFocusSuggestion(result)}`);

  return sections.join("\n\n");
}

function printFormattedResult(result, workflow, format) {
  if (format === "telegram" && workflow === "morning_routine") {
    console.log(renderMorningRoutineTelegram(result));
    return;
  }
  if (format === "telegram" && workflow === "weekend_brief") {
    console.log(renderWeekendBriefTelegram(result));
    return;
  }
  printResult(result);
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  const workflow = parsed.workflow;
  const flags = parsed.flags;
  const runDate = flags.date || currentDateInTimezone();
  const options = {
    nonInteractive: Boolean(flags["non-interactive"]),
    dryRun: Boolean(flags["dry-run"]),
  };
  const format = flags.format || "json";

  preflight(runDate, workflow, options);
  const touchedFiles = new Set();

  try {
    let result;
    if (workflow === "morning_routine") {
      result = await runMorningRoutine(runDate, options, touchedFiles);
    } else if (workflow === "weekly_review") {
      result = runWeeklyReview(runDate, options, touchedFiles);
    } else if (workflow === "task_capture") {
      result = runTaskCapture(runDate, flags, options, touchedFiles);
    } else if (workflow === "reminder_check") {
      result = runReminderCheck(runDate, options, touchedFiles);
    } else if (workflow === "weekend_brief") {
      result = await runWeekendBrief(runDate, options, touchedFiles);
    } else {
      fail(`Unsupported workflow: ${workflow}`);
      return;
    }

    writeStatusArtifact(runDate, workflow, true, touchedFiles, [], options);
    printFormattedResult(result, workflow, format);
  } catch (error) {
    writeStatusArtifact(runDate, workflow, false, touchedFiles, [String(error.message || error)], options);
    fail(String(error.message || error));
  }
}

main();
