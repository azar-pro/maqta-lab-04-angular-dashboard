# RIVET — QA Checklist

Verified against the current Angular production build through GitHub Actions, Angular/Karma tests, Puppeteer browser QA and external production access.

## Build gate
- [x] `npm install` completes
- [x] Dependency install audit reports 0 vulnerabilities
- [x] `npm run build` passes with no Angular template/type errors
- [x] Angular unit suite passes — **11/11**
- [x] Browser QA reports no console errors
- [x] Browser QA reports no page errors
- [x] Browser QA reports no request failures
- [x] Production bundle is uploaded as a CI artifact
- [x] Successful production bundle is published to the `dist` branch

## Desktop visual / browser QA
- [x] 1440 × 1050 application shell and overview render without global overflow
- [x] Core Projects / Customers / Inventory / Tasks routes render successfully
- [x] Revenue chart renders without Chart.js runtime errors
- [x] Light/dark theme toggle works
- [x] Data-dense hierarchy, square geometry and Industrial Editorial direction remain intact
- [x] New Project dialog opens correctly

## Mobile / tablet QA
- [x] 768 × 1024 tablet has no global page overflow
- [x] 768px uses off-canvas drawer navigation
- [x] Tablet drawer opens correctly
- [x] Escape closes the tablet drawer
- [x] 390 × 844 phone has no global page overflow
- [x] Mobile menu trigger is visible
- [x] Mobile drawer closes after navigation
- [x] Mobile Projects table scroll is contained inside the page shell

## Functional QA
- [x] Invalid login is rejected and displays an error
- [x] Valid demo login reaches the workspace
- [x] Auth guard allows authenticated state — unit tested
- [x] Auth guard redirects logged-out state to `/login` — unit tested
- [x] Core route navigation works in the production browser bundle
- [x] Ctrl/Cmd + K opens global search
- [x] New Project workflow opens its dialog
- [x] Task/business state service behavior is covered by unit tests
- [x] Theme persistence/state behavior is covered by unit tests

## Async / resilience QA
- [x] Workspace uses an async repository loading state
- [x] Settings → Portfolio QA can trigger a controlled data error
- [x] Global error state appears with alert semantics
- [x] Retry restores the workspace to ready state
- [x] Failure simulation is deterministic rather than random

## Accessibility / interaction coverage
- [x] Visible focus styles are defined for links, buttons and form controls
- [x] Reduced-motion preference is respected
- [x] Global error state uses `role="alert"`
- [x] Chart canvas exposes an accessible label
- [x] Tablet drawer supports Escape-to-close
- [x] Desktop keyboard shortcut for global search is verified

## Production metrics
- [x] Initial bundle: **271.64 kB raw**
- [x] Estimated initial transfer: **73.65 kB**
- [x] Production artifact: **21 files**
- [x] Browser automated checks: **25/25 passing**
- [x] Unit tests: **11/11 passing**

## Deployment
- [x] Production deployment created on Vercel
- [x] Vercel returned deployment status **READY**
- [x] Production alias assigned: `https://rivet-operations-workspace-meryf2026-1383.vercel.app`
- [x] Public live demo URL opened successfully in an external browser
- [x] Demo authentication completed successfully on the production deployment
- [x] Major SPA route shells included in the direct deployment to reduce deep-link 404 risk

Deployment ID: `dpl_BDFVP6Eaxf4yBpujgXC12NFso1VT`

## Release artifacts
- [x] Automated screenshots captured for login, overview, dark overview, tasks, project dialog, error state, tablet, mobile overview, mobile drawer and mobile Projects
- [x] README updated with verified release facts only
- [x] Case study prepared
- [x] GitHub `main` contains production-ready source
- [x] GitHub `dist` contains the successful production bundle

## Optional post-release review

These are useful future enhancements, but they are not blockers for the portfolio release:

- Firefox/Safari cross-browser pass
- formal Lighthouse score
- full screen-reader audit
- every secondary CRUD edge case and every filter permutation
- explicit public-host deep-link refresh test on multiple browsers

## Release status

**PROJECT 04 — RIVET: COMPLETE.**

Application build, unit tests, automated functional QA, responsive QA, GitHub release artifacts, Vercel deployment and external production login verification all passed.
