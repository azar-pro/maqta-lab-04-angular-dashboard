# RIVET Architecture Notes

## Product intent
RIVET is an internal operations workspace for a small commercial fit-out and services company. The domain was chosen to make the portfolio sample demonstrate relationships between projects, customers, procurement, tasks, delivery risk and revenue instead of presenting a generic analytics template.

## Angular approach
- Standalone components
- Lazy-loaded feature routes
- Route guard for the demo authenticated area
- Angular signals for local application state
- Reactive Forms for settings/auth flows
- Chart.js isolated behind a chart component
- Feature UI reads data through `BusinessDataService`

## Data boundary
`src/app/data/mock-data.ts` contains seed records only. `BusinessDataService` is the boundary consumed by feature components. Writable signals remain private; readonly signals are exposed to UI.

This means a later HTTP repository can replace the seed implementation while preserving page-level component contracts.

## Domain models
- Project
- Customer
- InventoryItem
- TaskItem
- NotificationItem

The model layer uses explicit status unions instead of loose strings for the important business states.

## Routing
Authenticated feature routes live under `/app`:

- `/app/overview`
- `/app/projects`
- `/app/projects/:id`
- `/app/customers`
- `/app/customers/:id`
- `/app/inventory`
- `/app/tasks`
- `/app/notifications`
- `/app/search`
- `/app/settings`
- `/app/profile`

Unknown application URLs fall through to a dedicated 404 view. Unknown project/customer IDs have record-level not-found states.

## Visual system
The UI avoids common generic SaaS cues. RIVET uses warm bone surfaces, graphite/ink type, restrained rust accents, square-edged controls, fine rules and data-first hierarchy. Cards are used only when they clarify grouping. Tables and editorial spacing carry most information density.

## Responsive strategy
Desktop keeps persistent navigation. Mobile switches to a dismissible drawer with scrim and Escape handling. Dense tables retain horizontal overflow rather than crushing columns into unreadable stacks. Summary metrics collapse vertically on small screens.

## Accessibility decisions
- Semantic buttons and links for actions/navigation
- `aria-label` on icon-only controls
- Keyboard shortcut for global search (`Ctrl/Cmd + K`)
- Visible `:focus-visible` treatment
- Reduced-motion media query
- Empty states explain recovery action
- Status meaning is represented by both text and color

## Remaining release work
- Real async repository state with loading/retry behavior
- Unit/component tests
- Full Angular build after dependencies are available
- Browser-based visual and functional QA
- Lighthouse/performance pass
- Screenshot set and case study
- GitHub repository + deployment verification


## Async data boundary

`MockBusinessRepository` owns the current mock transport and returns an asynchronous workspace snapshot. `BusinessDataService` owns application state through Signals and exposes `loading / ready / error` states to the shell. Feature components consume the service and are intentionally unaware of the storage or transport implementation. A future REST adapter can replace the repository without restructuring feature pages.

Error simulation is deterministic and QA-only: the repository can fail the next request on demand, allowing retry behavior to be verified without random failures.

## Sprint 04 mutation flow

UI forms do not mutate arrays directly. Project, customer and task forms submit typed values to `BusinessDataService`, which owns signal-store mutations and cross-entity consistency. For example, project creation resolves the selected customer and updates that customer's active-project count; completion reverses that count. This keeps relational business rules out of feature components and makes a later repository/API replacement easier.
