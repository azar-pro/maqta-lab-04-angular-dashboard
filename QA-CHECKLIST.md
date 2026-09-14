# RIVET — QA Checklist

## Build gate
- [ ] `npm install` completes
- [ ] `npm run build` passes with no Angular template/type errors
- [ ] `npm test -- --browsers=ChromeHeadless` passes
- [ ] No console errors in production build

## Desktop visual QA
- [ ] 1440px: sidebar, topbar and content hierarchy feel balanced
- [ ] 1280px: tables remain readable without clipping controls
- [ ] Light and dark themes retain contrast and hierarchy
- [ ] No accidental oversized radii, gradients or template-like card repetition
- [ ] Revenue chart labels and plot remain legible

## Mobile / tablet QA
- [ ] 1024px tablet layout
- [ ] 768px navigation drawer + scrim
- [ ] 390px phone layout
- [ ] Tables scroll horizontally without moving the page shell
- [ ] Search, filters and task tabs remain reachable
- [ ] Touch targets remain usable

## Functional QA
- [ ] Demo login rejects invalid credentials
- [ ] Auth guard redirects logged-out visitors
- [ ] Project search/status/owner filters combine correctly
- [ ] Customer detail links to related projects
- [ ] Inventory filters and KPIs update correctly
- [ ] Task completion updates counts immediately
- [ ] Notifications mark read and update sidebar badge
- [ ] Ctrl/Cmd + K opens global search
- [ ] Global search returns projects/customers/tasks/inventory
- [ ] Settings persist locally
- [ ] Theme persists locally
- [ ] Unknown app URL shows 404
- [ ] Unknown project/customer record shows local 404 state

## Async / resilience QA
- [ ] Initial workspace load shows skeleton state
- [ ] Settings → Portfolio QA → Simulate load error shows error state
- [ ] Retry returns the workspace to ready state
- [ ] Error state is announced to assistive technology
- [ ] Loading state exposes `aria-busy`

## Accessibility QA
- [ ] Full keyboard pass
- [ ] Visible focus indicators
- [ ] Form controls have accessible labels
- [ ] Task tabs expose tab semantics and selection
- [ ] Reduced-motion preference respected
- [ ] Contrast checked in light and dark modes
- [ ] Decorative UI does not create noisy accessible names

## Release artifacts
- [ ] Production screenshots: login, overview, projects, customer detail, inventory, mobile
- [ ] README updated with verified commands only
- [ ] Case study written
- [ ] Live demo URL verified
- [ ] GitHub default branch contains production-ready build source

## Sprint 04 interaction checks

- [ ] Create project with required-field validation.
- [ ] Create project from a customer and confirm that customer is preselected.
- [ ] Complete/reopen project states and confirm active-project counts stay consistent.
- [ ] Add customer and verify the new detail page opens.
- [ ] Add CRM note and verify last activity changes to “Just now”.
- [ ] Create task against an active project and toggle completion.
- [ ] Add inventory item and verify Healthy / Low stock / Out of stock status derives from quantities.
- [ ] Export overview project report and open the CSV.
- [ ] Copy project update text to clipboard.
- [ ] Verify every visible feature action has a real outcome; no display-only buttons remain.

## Sprint 05 status

Static source QA is complete, including table semantics, Node/runtime pinning, theme-aware chart behavior, CI configuration and Vercel SPA fallback. Full browser/build items remain unchecked until dependencies can be installed in a compatible Node 22.22.3+ environment.
