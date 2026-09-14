# RIVET — Sprint 05 Static QA

## Passed in this environment

- TypeScript syntax transpile: 29/29 source files
- Route parameter binding is enabled with `withComponentInputBinding()`
- All primary data tables have accessible captions and scoped column headers
- Responsive breakpoints cover desktop, tablet, mobile and narrow mobile layouts
- Mobile sidebar has a dismissible scrim and Escape handling
- Reduced-motion preference disables transitions/animations
- Revenue chart exposes an accessible label and now refreshes theme-dependent colors when light/dark mode changes
- Major CRUD controls have explicit outcomes; no intentionally display-only primary action remains
- SPA fallback is prepared for Vercel
- CI workflow is prepared for tests + production build

## Environment-blocked checks

The current execution environment cannot resolve `registry.npmjs.org`, so Angular dependencies cannot be installed. It also ships Node 22.16.0, below Angular 22's minimum supported Node 22 patch. The project now pins Node 22.22.3.

Because of those environment constraints, the following remain release gates rather than assumed passes:

- Angular strict template compilation
- Jasmine/Karma unit tests in ChromeHeadless
- Production build budgets
- Browser console inspection
- Real desktop/tablet/mobile visual QA
- Keyboard walkthrough and focus-order verification in a running browser

These must be executed by GitHub Actions or a compatible local environment before the project is called production-ready.
