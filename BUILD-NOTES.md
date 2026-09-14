# RIVET — Build & Release Notes

## Required runtime

Angular 22 requires a supported Node.js runtime. This project pins Node 22.22.3 in `.nvmrc` and declares compatible runtimes in `package.json`.

Recommended local setup:

```bash
nvm use
npm install
npm test -- --browsers=ChromeHeadless
npm run build
```

## Current verification state

- Source-level TypeScript syntax scan: PASS (29 files)
- Static table accessibility scan: PASS after Sprint 05 semantics pass
- Angular dependency installation in the ChatGPT execution environment: BLOCKED by DNS/network access to `registry.npmjs.org`
- Full Angular template/type compilation: pending a dependency-enabled environment
- Browser QA: pending a successful local/CI build

The build gate must not be marked green until CI or a local Node 22.22.3+ environment completes both unit tests and `npm run build`.

## Deployment target

Vercel is the preferred free deployment target for this portfolio project. `vercel.json` includes an SPA fallback so direct navigation to Angular routes resolves to `index.html`.

Netlify is intentionally not used.
