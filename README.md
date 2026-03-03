# Kids Math App

Interactive kids math learning app built with React, TypeScript, Vite, and Tailwind.

## CI/CD

- `CI` runs on every pull request to `main` and validates install + production build.
- `PR Quality Gate` runs on every pull request to `main` and enforces:
  - typecheck + build
  - production-only reinstall (`npm ci --omit=dev`) and runtime dependency audit (`npm audit --audit-level=high`)
- Vercel is connected to this repository and handles deployments.

## Approval Flow (Recommended)

1. Create a feature branch from `main`.
2. Open a pull request into `main`.
3. Wait for CI to pass.
4. Review and approve the PR.
5. Merge to `main`.
6. Vercel auto-deploys from `main`.

## Version Management

- Release Please is configured to manage semantic versioning and changelog updates.
- Commits on `main` trigger Release Please.
- Release Please opens a release PR (version bump + `CHANGELOG.md`).
- Merging the release PR creates a GitHub release and tag.

### Commit style

Use Conventional Commits to drive semantic version bumps:

- `fix:` -> patch
- `feat:` -> minor
- `feat!:` or `BREAKING CHANGE:` -> major

Examples:

- `fix: correct coin reward calculation`
- `feat: add fraction comparison hints`
- `feat!: replace worksheet scoring model`

## Local Commands

- `npm run dev`
- `npm run typecheck`
- `npm run build`
- `npm run ci`
