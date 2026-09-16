# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

pnpm monorepo of TypeScript code generators that turn OpenAPI 3.0 specs into type-safe server code, plus Express glue:

| Package | Published | Purpose |
| --- | --- | --- |
| `@ibabkin/openapi-to-server` | yes | Renders TypeScript types, `Route`/payload/response types, per-tag controller interfaces, an `IServer` interface and an Axios `ApiClient`; ships the `openapi-to-server` / `openapi-to-client` CLIs and the `createUrl` runtime helper used by generated clients |
| `@ibabkin/openapi-to-zod` | yes | Renders Zod schemas for components and a `PAYLOADS` map (keyed by `operationId`) that validates the Express `Request`; ships the `openapi-to-zod` CLI |
| `@ibabkin/openapi-express-server` | yes | `extractRoutes`, `convertOpenAPIPathToExpress`, `buildPayload`, `containerMiddleware` (ts-ioc-container request scope). A reference `RouteBuilder` lives in its `__tests__/` |

All packages are ESM (`"type": "module"`), compiled with `tsc -p tsconfig.prod.json` into `esm/`. Node `>=26` (see `.nvmrc`).

## Commands

```bash
pnpm ci              # pnpm install --frozen-lockfile
pnpm build           # pnpm -r run build (clean → precompile templates → tsc)
pnpm test            # pnpm -r run test
pnpm lint
pnpm format:check
pnpm commit          # commitizen prompt producing a conventional commit
pnpm release:dry-run # preview what the release pipeline would do

# Per package
cd packages/openapi-to-request-validator
npm run build:hbs    # precompile lib/templates/*.hbs into hbs/index.cjs
npm run build:ts
npx jest __tests__/openapiToZod.spec.ts

# CLIs (after pnpm build)
node packages/openapi-to-server-interface/esm/bin/openapi-to-server.js --input swagger.yaml --output operations.d.ts --json
node packages/openapi-to-server-interface/esm/bin/openapi-to-client.js --input swagger.yaml --output client.ts
node packages/openapi-to-request-validator/esm/bin/openapi-to-zod.js --input swagger.yaml --output validators.ts
```

A consumer wiring all three together (`generate` script, `RouteMediator`, DI-resolved route handlers) is `~/projects/backend-template`.

## Architecture

Both generators follow the same pipeline:

```
OpenAPIV3.Document → Handlebars templates (lib/templates/*.hbs) → TypeScript source string
                       ↑ helpers registered in lib/templates/index.ts
```

- Templates are precompiled by the `handlebars` CLI into `hbs/index.cjs` (gitignored, regenerated on `postinstall` and `build`). `lib/render.ts` imports it for its side effect of registering `Handlebars.templates`.
- Both `hbs/index.cjs` and `lib/templates/index.ts` import the main `handlebars` entry so they share one Handlebars instance. Both packages register a `render_template` helper on that shared instance; this only works because all precompiled templates of both packages live in the one global `Handlebars.templates` map — loading templates per package at runtime would need isolated `Handlebars.create()` environments.
- File-based entry points (`openapiToServer`, `openapiToClient`, `openapiToZod` in `lib/useCases/`) load YAML through `yaml-import` (supports `!!import/merge`) or JSON, and the `lib/bin/*.ts` CLIs parse `--input/--output[/--json]` with `node:util` `parseArgs`.
- `render_template` returns a `Handlebars.SafeString` — generated code is not HTML, so nested output must not be escaped.
- Operations are grouped by `tags[0]`; `operationId` drives method and type names (`getUser` → `GetUserPayload`, `GetUserResponse`, `GetUserRoute`).
- Parameters without `required: true` and object properties not listed in `required` are optional. String schemas map `enum` → `z.enum`, `format: email` → `.email()`, `minLength`/`maxLength` → `.min()`/`.max()`, `date-time` → `zDate`.

`openapi-express-server` tests exercise both generators end to end: `__tests__/integration/generated.spec.ts` renders types and validators from `__tests__/integration/api.yaml` at test time, builds an Express app, and runs requests through it.

## Gotchas

- **ESM output must be loadable by Node**: relative imports in `lib/` need explicit `.js` extensions; Jest maps them back to `.ts` via `moduleNameMapper` (`^(\.{1,2}/.*)\.js$`).
- **`tsc` + `incremental`**: `clean` must delete `*.tsbuildinfo` as well as `esm/`, otherwise `tsc` believes it is up to date and emits nothing after the output is removed.
- **Jest resolves workspace packages to sources**: `openapi-express-server/jest.config.json` maps `@ibabkin/*` to `../<pkg>/lib/index.ts`, so tests don't need a prior build of the sibling packages (they do need `hbs/`, produced on install).
- **ts-ioc-container**: `container.hasRegistration(key)` only sees entries added with `addRegistration(Registration.fromClass(X).bindToKey(key))`, not `register(key, Provider)`. Decorated classes need `import 'reflect-metadata'` first.
- After editing `.hbs` files run `npm run build:hbs` (or `pnpm build`) before running tests against `esm/`.
- Generated output is consumed by `backend-template` with `^` ranges; changes to generated shapes or to the runtime exports (`createUrl`, `HttpResponse`, `Route`, …) are breaking for it and need a major bump.

## Commits and Releases

Commits must follow Conventional Commits and pass `commitlint.config.mjs` (enforced by the husky `commit-msg` hook). **Scope is mandatory** and, for release-triggering commits, must equal the package's `name` exactly:

```
feat(@ibabkin/openapi-to-zod): support enum constraints   # minor
fix(@ibabkin/openapi-to-server): mark unrequired params optional # patch
ci(github): ...   chore(deps): ...   docs(templates): ...                   # no release
```

Releases run on push to `master` via `.github/workflows/publish.yml` using `release-monorepo-semantically` (step pipeline: `report → package-json → package-manager → changelog → vcs → package-manager publish → release-notes`). Configuration lives in `.release.json`; the release commit template is `scripts/release/templates/release-commit-msg.hbs`. Tags are `<package-name>@<version>`; private packages are never released. Publishing uses npm Trusted Publishing (OIDC), which must be configured per package on npmjs.com.

## Code Style

- Prettier: 120 char line width, single quotes, trailing commas
- ESLint: TypeScript strict with Prettier integration; lint-staged runs on pre-commit
