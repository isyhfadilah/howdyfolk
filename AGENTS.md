# Project workflow

- After each completed, coherent change, run the relevant checks and create a local Git commit automatically.
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, or `build:` as appropriate. Add a scope when useful, for example `fix(builder): align accessories with facial landmarks`.
- Write concise, imperative commit subjects explaining the change. Group related edits into one commit; do not commit each individual file write.
- Never push automatically. The user handles pushes manually.
- Do not include secrets, dependency directories, build output, or temporary visual-review artifacts in commits.
- If unrelated user changes exist, leave them out of the commit unless the user explicitly includes them.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
