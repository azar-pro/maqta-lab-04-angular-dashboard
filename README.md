# RIVET — Operations Workspace

Angular business dashboard created as **MAQTA Lab Project 04**. RIVET is a portfolio-grade internal operations product for a small commercial fit-out / services company. It demonstrates data-dense product UI, routing, reusable state, TypeScript architecture, forms, charts, responsive layouts and accessibility-minded interaction patterns.

## Current scope — Sprint 03

- Demo login and route guard
- Responsive application shell + mobile drawer
- Light / dark theme persistence
- Overview with KPI hierarchy, revenue chart, risk list, project pipeline and task queue
- Projects: search, status filter, owner filter, progress, summary metrics, detail routes and missing-record state
- Customers: searchable CRM table, status filter, customer details and related active projects
- Inventory: procurement / material table, search, stock-state filters and stock metrics
- Tasks: open/completed/all views, priority filter and local task completion state
- Notifications: unread state, mark read and live unread count in navigation
- Global search across projects, customers, tasks and inventory
- Settings using Reactive Forms and local persistence
- Profile and 404 page
- Responsive breakpoints for desktop, tablet and mobile
- Empty states, error/skeleton visual primitives ready for async repository states

## Architecture

The UI depends on `BusinessDataService`, not directly on seed data. That service owns writable signals and exposes readonly state to feature components. The current repository source is local mock data; it can later be replaced by HTTP repositories without rewriting the feature UI.

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

## Run locally

```bash
npm install
npm start
```

Demo authentication credentials are shown on the login screen.

## Production verification

Run before release:

```bash
npm run build
npm test
```

A full Angular production build has **not yet been claimed for Sprint 03** because the current execution environment could not finish downloading npm dependencies. A TypeScript syntax transpilation check passes for all source files. Full Angular template/type checking remains a required release gate.

## Portfolio release gates

Project 04 is not complete until all of the following pass:

1. Production build
2. Angular tests
3. Desktop visual QA
4. Tablet/mobile QA
5. Keyboard + focus QA
6. Loading/error/empty state QA
7. Browser console check
8. Performance review
9. Final README and case study
10. GitHub repository verification
11. Free live deployment outside Netlify

---

Created by [MAQTA STUDIO](https://maqtastudio.com)


## Sprint 03 additions

- Asynchronous repository state with loading, ready and error modes
- Global skeleton loading experience
- Controlled error simulation and retry path for QA
- Unit tests for business data, auth and theme state
- Repository abstraction separated from UI components

### QA note

The Settings page contains a deliberately labeled **Portfolio QA / State preview** action. It triggers the next repository request to fail so the global error and retry UI can be reviewed without introducing random production failures.

## Sprint 04 — Product workflows

The portfolio build now includes working CRUD-style interactions rather than display-only controls:

- Create a project with Reactive Forms validation and an existing customer relationship.
- Add a customer and open the new CRM record immediately.
- Create tasks against active projects.
- Edit project status, progress, owner, due date, value, scope and risk.
- Customer active-project counts react to project creation/completion.
- Project updates can be copied to the clipboard for a realistic operations workflow.
- Responsive accessible dialog patterns are used for creation/editing flows.

These interactions are intentionally local/mock-backed for Project 04. Project 05 is reserved for demonstrating a real external API integration.

## Sprint 05 — Release readiness

The project now pins a supported Angular 22 Node runtime via `.nvmrc` and `package.json` engines, includes GitHub Actions CI for unit tests + production build, and includes Vercel SPA routing configuration. Table semantics and chart theme behavior received an additional accessibility/visual polish pass.

> Build status is intentionally not marked as passing in this workspace: external npm registry access is unavailable here, so Angular dependencies cannot be installed. The included CI workflow is the next authoritative release gate once the repository is created/pushed.
