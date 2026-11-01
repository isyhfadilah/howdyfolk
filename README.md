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

The current implementation uses CSS for the prototype. Tailwind integration, browser automation, production vectorization, further accessory alignment, expression/pose variants, Supabase authentication, private asset delivery, and Gumroad purchases remain to be implemented. No checkout or account functionality is represented as active. Run `node scripts/review-studio.mjs` to render the eighteen character/hair/outfit combinations into `.artwork-review/contact-sheet.png`.

See `docs/plan.md`, `docs/brand.md`, and `docs/architecture.md` for the product direction. Secrets belong in ignored local environment files, never in source control.
>>>>>>> ee47c08 (feat(studio): add modular character builder and artwork previews)
