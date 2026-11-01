# Howdyfolk

Local stage-A character-builder prototype. The editable SVG artwork is exploratory and code-authored; it is not a finished commercial illustration collection.

## Run

Requires Node.js 20.9+.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production compilation: `npm run build`.

On Windows PowerShell with restricted script execution, use `npm.cmd` instead of `npm`.

## Current behavior

The active studio offers three AI-assisted editorial characters (A/B/C), two identity-specific hair variants each, three interchangeable outfits, basic glasses/necklace overlays, randomize/reset, and transparent 2048px PNG download. Editable SVG is explicitly disabled until vector artwork is available. The old code-authored cartoon builder is no longer the active page.

Tailwind/PostCSS, Supabase email sign-in, account pages, Gumroad license verification, encrypted license storage, owner-scoped database access, and private premium asset delivery are implemented. External services are not connected by default: follow `docs/setup.md`. Current artwork remains free/public and raster; production vectorization and expression/pose variants are unfinished. No live checkout is advertised before collection approval.

Run `npm test` for purchase/encryption tests and `npm run test:e2e` for the live-builder checks (requires the dev server on port 3000 and installed Microsoft Edge). Run `node scripts/review-studio.mjs` for visual comparison sheets of all 54 combinations. Browser review artifacts are ignored by Git.

See `docs/plan.md`, `docs/brand.md`, and `docs/architecture.md` for the product direction. Secrets belong in ignored local environment files, never in source control.
>>>>>>> ee47c08 (feat(studio): add modular character builder and artwork previews)
