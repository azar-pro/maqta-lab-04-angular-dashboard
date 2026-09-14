# RIVET — Operations Workspace

![CI](https://github.com/azar-pro/maqta-lab-04-angular-dashboard/actions/workflows/ci.yml/badge.svg)

**MAQTA Lab Project 04** — a portfolio-grade Angular operations workspace for a fictional commercial fit-out / design-build company.

RIVET is designed around a real operations-manager workflow: tracking projects, customers, materials, tasks, risk, revenue and daily follow-up in one calm, data-dense product UI.

> This is a fictional portfolio product, not a client project.

## Demo

**Email:** `hello@rivet.demo`  
**Password:** `rivet123`

The login form is prefilled for quick portfolio review.

## Product highlights

- Operations overview with KPIs, revenue chart, project pipeline, risk signals and task queue
- Projects with search, status/owner filters, detail routes, create/edit workflows and project-update copy action
- Customers CRM with searchable records, detail pages, related projects, notes and active-project counts
- Inventory / procurement tracking with stock metrics, filters and derived stock states
- Tasks with open/completed/all views, priority filtering, creation and completion toggles
- Notifications with unread state and live navigation badge
- Global search across projects, customers, tasks and inventory
- Reactive settings with local persistence
- Light/dark themes with persistence and Chart.js theme updates
- Async repository layer with loading, error and retry states
- Responsive desktop, tablet and mobile application shell
- Accessible focus states, reduced-motion support and semantic error/loading states
- Demo CSV export and realistic local CRUD-style workflows

## Stack

- Angular 22 — standalone architecture
- TypeScript
- Angular Router + lazy routes
- Signals for local application state
- Reactive Forms
- Chart.js
- Repository/service abstraction over mock data
- Jasmine + Karma
- Puppeteer browser QA
- GitHub Actions CI

## Architecture

Feature components do not import seed data directly. `BusinessDataService` is the UI-facing state layer and consumes a mock repository boundary, so a later HTTP/API repository can replace the local source without restructuring feature screens.

```text
src/app/
├── core/
│   ├── guards/
│   ├── models/
│   └── services/
├── data/
├── features/
│   ├── auth/
│   ├── customers/
│   ├── inventory/
│   ├── notifications/
│   ├── overview/
│   ├── profile/
│   ├── projects/
│   ├── settings/
│   └── tasks/
└── shared/
    └── layout/
```

## Verified release status

The current `main` branch is verified by GitHub Actions on Node **22.22.3**.

- ✅ `npm install` — completed with **0 vulnerabilities**
- ✅ Unit tests — **11/11 passing**
- ✅ Angular production build
- ✅ Browser QA — **25/25 checks passing**
- ✅ Desktop QA — 1440 × 1050
- ✅ Tablet QA — 768 × 1024
- ✅ Mobile QA — 390 × 844
- ✅ Light / dark theme interaction
- ✅ Invalid-login behavior
- ✅ Auth guard — direct Angular unit coverage for authenticated and logged-out states
- ✅ Controlled repository error + retry
- ✅ Core navigation and new-project dialog
- ✅ Ctrl/Cmd + K global search
- ✅ No global horizontal page overflow in tested desktop/tablet/mobile views
- ✅ Browser report: **0 console errors, 0 page errors, 0 request failures**
- ✅ Production bundle automatically published to the `dist` branch after successful CI

### Production bundle

Latest verified build:

- Initial raw bundle: **271.64 kB**
- Estimated initial transfer: **73.65 kB**
- Production artifact: 21 files

A live hosting URL is intentionally not listed here yet. The application build and QA are verified; the final public deployment is a separate release gate and will only be added after the hosted URL is independently verified.

## Browser QA coverage

The automated browser pass validates:

- login screen + invalid login
- overview and dark theme
- Projects / Customers / Inventory / Tasks navigation
- no global overflow across core desktop pages
- new-project dialog
- global-search shortcut
- controlled error state and retry
- 768px tablet drawer, overflow and Escape-key close behavior
- 390px mobile drawer, navigation and Projects layout

Auth guard behavior is tested directly at the Angular unit-test layer rather than through the static QA server.

## Run locally

```bash
npm install
npm start
```

## Verify locally

```bash
npm test
npm run build
```

## QA state preview

Settings contains a clearly labeled **Portfolio QA / State preview** control. It deliberately fails the next mock repository request so the production-style global error and retry experience can be reviewed without introducing random failures.

## Release notes

During browser QA, several real issues were found and fixed rather than hidden:

- mobile table containment causing page-level horizontal overflow
- missing Chart.js `LineController`
- chart appearing visually blank during its initial animation
- missing favicon request
- drawer-transition timing and tablet navigation behavior

See [`QA-CHECKLIST.md`](QA-CHECKLIST.md) for verified release gates and [`CASE-STUDY.md`](CASE-STUDY.md) for the portfolio case study.

---

Created by [MAQTA STUDIO](https://maqtastudio.com)
