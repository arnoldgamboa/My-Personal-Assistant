# Finances — Monthly Bills & Payments

> This file tracks Arnold's recurring financial obligations.
> The PA reads this during daily briefings to surface upcoming and due payments.
> **Never store account numbers, passwords, or sensitive credentials here.**

---

## How This Works

The daily briefing checks this file and flags:
- **Due today** — Payment is due today
- **Due in 1–3 days** — Advance warning
- **Due this week** — Light visibility

Payments Arnold executes manually — the PA only reminds, never transacts.

---

## Weekly Recurring Payments

| # | Payment | Amount | Due Day | Via | Notes |
|---|---------|--------|---------|-----|-------|
| W1 | Send Manny GCash | ₱700 | Every Tuesday | GCash | LifeCity church — also in `context/lifecity_church.md` |

---

## Monthly Recurring Payments

| # | Payment | Amount | Due Date | Via | Notes |
|---|---------|--------|----------|-----|-------|
| 1 | Send money to parents | — | Last day of month | — | Family support |
| 2 | Pay Meralco (electricity) | — | 1st of month | — | |
| 3 | Send LifeCity gift | — | 1st of month | — | Church giving |
| 4 | Pay Salmon card | — | 7th of month | — | Credit card |
| 5 | Deposit to RCBC | ₱53,000 | 14th of month | RCBC | Covers debt payments below |
| 6 | Debt: UB/Citibank *2513 | ₱9,559.21 | 14th of month | RCBC app | Pay *after* RCBC deposit |
| 7 | Pay Converge (internet) | — | 17th of month | — | |
| 8 | Debt: RCBC *2003 | ₱16,712.30 | 30th of month | Maribank app | |
| 9 | Send money to parents | — | Last day of month | — | Same as #1 |

---

## Semi-Annual / Annual Payments

| # | Payment | Amount | Due Date | Frequency | Notes |
|---|---------|--------|----------|-----------|-------|
| 10 | AXA Life insurance | — | May 1, 2026 | Every 6 months | Next: May 1, 2026 → Nov 1, 2026 |
| 11 | gamboa.ph domain renewal | — | March 25 | Annual | Next: March 25, 2027 |

---

## Payment Order Logic (14th of month)

On the 14th, two transactions are linked — order matters:
1. **First:** Deposit ₱53,000 to RCBC
2. **Then:** Pay UB/Citibank *2513 — ₱9,559.21 via RCBC app

The briefing should surface this as a sequence, not two separate items.

---

## Briefing Rules

- **1 day before due:** Surface as `⚠️ Due tomorrow: [Payment]`
- **Day of:** Surface as `🔴 Due today: [Payment]`
- **3 days before:** Surface as `📅 Coming up: [Payment] in 3 days`
- **AXA and domain:** Surface 5 days in advance (higher stakes, can't be forgotten)
- **End-of-month payments (last day):** Treat "last day" as the last calendar day of the current month

---

## Notes

- Amounts without values (—) are variable or unknown — Arnold to update as needed
- Do not store PINs, passwords, or account details here
- If a due date falls on a weekend or holiday, flag it the Friday before: "⚠️ [Payment] due Monday — process today if needed"

---

*Last updated: March 13, 2026*
