# Project Proposal: Rosebowl Website — Backend Migration to Sanity.io

**Prepared by:** Arnold Gamboa
**Prepared for:** Colin
**Date:** March 9, 2026
**Rate:** $70 USD / hour

---

## Overview

This proposal outlines the scope and estimated cost for migrating the Rosebowl website's backend from its current **Strapi** setup to **Sanity.io**. The work is scoped as Phase 1 (backend only). A separate proposal for the frontend redesign (Phase 2) will follow once design direction is confirmed.

---

## Current Stack

- **Backend/CMS:** Strapi
- **Frontend:** Existing RosebowlStadium.com

---

## Proposed Stack

- **Backend/CMS:** Sanity.io
- **Frontend (Phase 1):** Existing frontend, reconnected to Sanity.io
- **Frontend (Phase 2, separate):** Astro *(pending design delivery)*

---

## Phase 1 Scope — Backend Migration

### What's Included

| Feature | Schema Design | Migration | Est. Hours |
|---|---|---|---|
| **Events** (dynamic showtimes, OG fields, ticket links, active/inactive states, featured events) | High complexity | Moderate | 10h |
| **Pages management** (multiple layout types + video pages) | High — block-based content modeling | Moderate | 9h |
| **Media management** (images/video) | Sanity native asset pipeline | Migration of existing assets | 5h |
| **Sponsors** | Low | Low | 2h |
| **Staff** | Low | Low | 2h |
| **File management** (PDFs, docx) | Low | Low | 2h |
| **User management** | Editor roles via Sanity Studio | Low | 1h |
| **Navigation management** | Moderate (singleton schema) | Low | 3h |
| **Sanity Studio setup + GROQ/CDN config** | — | — | 5h |
| **Data migration scripts** (Strapi API → Sanity) | — | — | 8h |
| **QA / testing** | — | — | 3h |
| **Backend subtotal** | | | **50h** |
| **Frontend reconnection** (reconnect existing site to new Sanity backend) | — | — | 10h |
| **Total** | | | **60h** |

---

## Pricing

| | Hours | Rate | Total |
|---|---|---|---|
| Phase 1 — Backend Migration + Frontend Reconnection | 60h | $70/hr | **$4,200** |

---

## Assumptions & Scope Boundaries

- Scope is limited to the 8 features listed above. Any additional features or content types are subject to a separate change order.
- Migration scripts assume Strapi data is accessible via its REST/GraphQL API and is reasonably clean.
- User management scope covers **editor/admin access via Sanity Studio** only. Public-facing authentication (if any) is out of scope.
- QA is scoped to functional verification of migrated content and CMS workflows. It does not include load testing or accessibility audits.
- Design and front-end markup for the existing site are **not modified** under Phase 1 — only the data layer is updated.

---

## Phase 2 — Frontend Redesign (Separate Proposal)

A separate quote will be provided for the Astro frontend redesign once design assets are delivered. Phase 2 will include:

- Design-to-Astro conversion (all page templates)
- Full Sanity.io integration (GROQ queries, content fetching)
- Events, video pages, and dynamic layout support
- SEO / Open Graph implementation per page

*Estimated hours: TBD pending design scope and number of page templates.*

---

## Next Steps

1. Review and approve this proposal
2. Confirm project start date
3. Provide access to the existing Strapi instance and codebase
4. Phase 1 kicks off

---

*For questions or to proceed, please reply to this proposal or reach out directly.*
