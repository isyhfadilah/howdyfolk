# Project workflow

- After each completed, coherent change, run the relevant checks and create a local Git commit automatically.
- Use Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, or `build:` as appropriate. Add a scope when useful, for example `fix(builder): align accessories with facial landmarks`.
- Write concise, imperative commit subjects explaining the change. Group related edits into one commit; do not commit each individual file write.
- Never push automatically. The user handles pushes manually.
- Do not include secrets, dependency directories, build output, or temporary visual-review artifacts in commits.
- If unrelated user changes exist, leave them out of the commit unless the user explicitly includes them.
