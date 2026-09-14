# RIVET — Operations Workspace

## Portfolio Case Study

**Project type:** Fictional product design + front-end engineering portfolio project  
**Role:** Product design, UX architecture, Angular implementation and QA  
**Studio:** MAQTA Studio  
**Stack:** Angular 22, TypeScript, Signals, Reactive Forms, Chart.js, Jasmine/Karma, Puppeteer, GitHub Actions

## The problem

Small commercial fit-out and design-build teams often coordinate live projects across disconnected spreadsheets, messages and task lists. An operations manager needs to see what is active, what is at risk, which materials are running low, what customers are waiting for and which tasks need attention without moving between several tools.

RIVET was designed as a compact internal operations workspace for that scenario.

The portfolio goal was also deliberate: demonstrate more than a marketing website. The project needed to show data-dense product UI, reusable Angular architecture, forms, filtering, routing, responsive tables, state management, error handling, accessibility-minded interactions and a credible QA process.

## Product strategy

The primary user is an **Operations Manager**. The information hierarchy was built around the questions that user is likely to ask during the day:

- What is happening now?
- Which projects need attention?
- What work is due next?
- Which customers or materials are affected?
- What has changed?
- Can I act without leaving the workspace?

That led to five core product areas: Overview, Projects, Customers, Inventory and Tasks, supported by Notifications, Search, Settings and Profile.

## UX direction

Instead of a generic blue SaaS dashboard, RIVET uses an **Industrial Editorial SaaS** art direction:

- warm bone background
- dark ink typography
- rust accent
- graphite dark mode
- serif display hierarchy paired with restrained sans-serif UI text
- fine rules and low-radius geometry
- table-first layouts rather than grids of decorative cards
- limited visual noise so operational information remains dominant

The interface intentionally feels closer to a well-designed professional operations document than a template dashboard.

## Core workflows

### Operations overview

The landing workspace combines KPI context, a revenue trend, risk/attention items, active project progress and the task queue. This gives the operations manager a useful first screen rather than a decorative analytics page.

### Project management

Projects support search, status and owner filtering, progress tracking, detail pages, creation and editing. Project changes influence related customer state, and a project update can be copied for realistic client/team communication.

### Customer CRM

Customer records expose contact information, relationship status, lifetime value, activity and related active work. New customers and CRM notes can be added locally for the portfolio workflow.

### Inventory and procurement

Materials show stock, reservations, reorder thresholds, suppliers and derived health states so inventory feels connected to project operations rather than being a standalone catalog.

### Tasks and daily execution

Tasks can be filtered by state/priority, created against projects and completed/reopened. The layout prioritizes daily execution over decorative kanban UI.

## Engineering approach

RIVET uses Angular standalone architecture and lazy feature routes. UI components do not consume seed data directly.

A repository/service boundary separates the product UI from the mock source:

`MockBusinessRepository → BusinessDataService → feature components`

This keeps the portfolio project local and deterministic while demonstrating a structure that could later swap the mock repository for HTTP without rewriting feature screens.

Signals manage local state, Reactive Forms handle creation/editing/settings workflows, and Chart.js provides the revenue visualization.

## Resilience states

Loading and error behavior are part of the product rather than screenshots only. The mock repository behaves asynchronously, and Settings includes a clearly labeled QA control that makes the next load fail once. This provides a deterministic way to review the global error and retry experience without random failures.

## Responsive behavior

RIVET was checked at three primary viewport classes:

- Desktop — 1440 × 1050
- Tablet — 768 × 1024
- Mobile — 390 × 844

At tablet and mobile widths, navigation becomes an off-canvas drawer. Data tables keep their useful desktop structure but scroll inside their container instead of widening the entire document.

## QA and fixes

The project was not considered complete when it merely compiled. A GitHub Actions release pipeline runs unit tests, a production Angular build and Puppeteer browser QA against the generated production bundle.

Verified current release:

- **11/11 Angular unit tests passing**
- **25/25 browser checks passing**
- **0 browser console errors**
- **0 page errors**
- **0 request failures**
- npm install audit: **0 vulnerabilities**
- initial production bundle: **271.64 kB raw / 73.65 kB estimated transfer**

Browser QA uncovered real issues that were fixed during release work, including:

- page-level horizontal overflow caused by mobile table styling
- missing Chart.js `LineController`, which prevented the revenue chart from rendering
- chart animation creating a visually blank capture state
- a missing favicon request
- mobile drawer timing/selector problems in automated navigation tests
- tablet navigation behavior at 768px

Auth guard behavior is covered directly at the Angular unit-test layer, while Puppeteer focuses on browser behavior that the static QA server can represent accurately.

## Outcome

RIVET now functions as a strong portfolio example for dashboard, admin-panel, internal-tool and business-management work. It demonstrates both visual product design and implementation discipline rather than only front-end styling.

The source and successful production bundle are maintained on GitHub. A public live URL is intentionally treated as a separate release gate and will only be added after the final host is independently verified.

---

Created by [MAQTA STUDIO](https://maqtastudio.com)
