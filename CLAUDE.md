# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **TypeScript-based OpenAPI code generation framework** that converts OpenAPI 3.0 specifications into type-safe TypeScript code. The project uses a Lerna monorepo with pnpm workspaces.

**Main Package**: `@ibabkin/openapi-to-server` - Generates server interfaces, client code, and Zod validation schemas from OpenAPI specs.

## Development Commands

### Root-level Commands
```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Lint code
pnpm lint
pnpm lint:fix

# Format code
pnpm format

# Watch mode (package-level)
cd packages/openapi-framework
npm run watch

# Run single test file
cd packages/openapi-framework
npx jest __tests__/swagger.spec.ts
```

### Package-level Commands (openapi-framework)
```bash
# Build
npm run build              # Full build (clean + compile)
npm run compile            # TypeScript compilation only
npm run hbs:compile        # Precompile all Handlebars templates
npm run hbs:compile:server # Precompile server templates only
npm run hbs:compile:validation # Precompile validation templates only

# Test
npm run test               # Run all tests with Jest
npm run test:watch         # Watch mode with coverage

# Clean
npm run clean              # Remove compiled output
```

### Programmatic API Usage
```typescript
import { openapiToServer, openapiToClient } from '@ibabkin/openapi-to-server';
import { openapiToZod } from '@ibabkin/openapi-to-server/validation';

// Generate server types
openapiToServer({
  inputFile: './swagger.yaml',
  outputFile: './operations.d.ts',
  emitJSON: true  // Optional: emit JSON alongside TypeScript
});

// Generate client code
openapiToClient({
  inputFile: './swagger.yaml',
  outputFile: './client.ts'
});

// Generate Zod validation schemas
openapiToZod({
  inputFile: './swagger.yaml',
  outputFile: './validation.ts'
});
```

## Architecture Overview

### Code Generation Pipeline

The framework uses **Handlebars templates** to transform OpenAPI specifications into TypeScript code. The generation is split into three distinct outputs:

1. **Components.ts.hbs** → Type definitions, routes, operations
2. **Controllers.ts.hbs** → Controller interfaces grouped by OpenAPI tags
3. **IServer.ts.hbs** → Root server interface binding all controllers

**Generation Flow**:
```
OpenAPI YAML → Parse → Handlebars Templates → TypeScript Output
                ↓
            Custom Helpers (grouping, filtering, naming)
```

### Template System

Templates are located in `packages/openapi-framework/lib/server/templates/`:

- **Components.ts.hbs**: Generates schemas, payload types, response types, and route interfaces
- **Controllers.ts.hbs**: Generates controller interfaces (e.g., `IHealthController`, `ITodosController`)
- **IServer.ts.hbs**: Generates main server interface with constructor references
- **ServerRoute.hbs**: Individual route payload/response type generation
- **JsonSchema.hbs**: Recursively converts OpenAPI schemas to TypeScript types
- **Parameters.hbs**: Converts parameter definitions to TypeScript types
- **Client.hbs**: Generates Axios-based API client

**Template Precompilation**: Templates are precompiled during build into separate files:
```bash
# Server templates
handlebars lib/server/templates/*.hbs -f precompiled/server.js -c handlebars/runtime

# Validation templates
handlebars lib/validation/templates/*.hbs -f precompiled/validation.js -c handlebars/runtime
```

The split allows:
- Faster incremental builds (only recompile changed template groups)
- Better code organization (server vs validation concerns separated)
- Smaller bundle sizes when using only one generator

### Custom Handlebars Helpers

Located in `lib/server/templates/helpers.ts`:

- **`group_by_tags(paths)`**: Groups operations by their first OpenAPI tag (used for controller generation)
- **`controller_name(tag)`**: Converts tag to controller name (e.g., "Health" → "IHealthController")
- **`payload_name(operationId)`**: Generates payload type name (e.g., "getUser" → "GetUserPayload")
- **`response_name(operationId)`**: Generates response type name (e.g., "getUser" → "GetUserResponse")
- **`route_name(operationId)`**: Generates route interface name (e.g., "getUser" → "GetUserRoute")
- **`filter_parameters(list, location)`**: Filters parameters by location (query, path, body)
- **`render_template(filename, data)`**: Recursively renders nested templates

### Generated Code Structure

From an OpenAPI spec with tags `Health` and `Todos`, the output structure is:

```typescript
// Components (schemas, routes, operations)
export type HealthResponse = { status: "ok" };
export type GetHealthPayload = {};
export interface GetHealthResponse extends HttpResponse { ... }
export interface GetHealthRoute extends Route<GetHealthPayload, GetHealthResponse> {}
export type Operations = { getHealth: GetHealthRoute; ... }

// Controllers (one per tag)
export interface IHealthController {
  getHealth(payload: GetHealthPayload): Promise<GetHealthResponse>;
  getHealthDb(payload: GetHealthDbPayload): Promise<GetHealthDbResponse>;
}

export interface ITodosController {
  getTodos(payload: GetTodosPayload): Promise<GetTodosResponse>;
  createTodo(payload: CreateTodoPayload): Promise<CreateTodoResponse>;
  // ... more methods
}

// Server interface (binds all controllers)
export interface IServer {
  Health: constructor<IHealthController>;
  Todos: constructor<ITodosController>;
}
```

### Key Implementation Details

**OpenAPI Tag → Controller Mapping**:
- Each unique tag in the OpenAPI spec creates a separate controller interface
- Operations are grouped by their **first tag only** (`tags[0]`)
- Tag names are capitalized and prefixed with "I" (e.g., "todos" → "ITodosController")

**Type Generation**:
- JSON Schema references (`$ref`) are resolved to type names
- OpenAPI formats are mapped: `date-time` → `Date`, others → primitive types
- Optional properties use `?` suffix
- Arrays use `Type[]` syntax
- Objects are inlined or referenced by schema name

**File Writing Strategy** (in `openapiToServer.ts`):
```typescript
// Appends three sections to output file
fs.writeFileSync(outputFile, renderComponents(content), { flag: 'a' });  // Components first
fs.writeFileSync(outputFile, renderControllers(content), { flag: 'a' }); // Controllers second
fs.writeFileSync(outputFile, renderServer(content), { flag: 'a' });      // Server last
```

### Important Patterns

**YAML Import Support**:
The framework supports `yaml-import` syntax for modular OpenAPI specs:
```yaml
paths:
  !!import/merge
    - paths.yaml
components:
  schemas:
    !!import/merge
      - components.yaml
```

**Testing Strategy**:
- Uses Jest with snapshot testing
- Generated code is output to `.generated/` directory during tests
- Snapshots detect regressions in template changes
- Test files: `__tests__/swagger.spec.ts`

**Build Output**:
- TypeScript compiled to CommonJS in `cjm/` directory
- Type definitions in `cjm/*.d.ts`
- Precompiled templates split into:
  - `precompiled/server.js` - Server/client template functions
  - `precompiled/validation.js` - Zod validation template functions
- Only `cjm/` and `precompiled/` are published to npm

## Common Gotchas

1. **Template Registration**: When adding new templates, update:
   - For server templates: `lib/server/templates/index.ts` (export render function) and `lib/server/useCases/openapiToServer.ts` (call render function)
   - For validation templates: `lib/validation/templates/index.ts` and corresponding use case

2. **Handlebars Precompilation**: After modifying `.hbs` files, run `npm run hbs:compile` (or `hbs:compile:server`/`hbs:compile:validation` for specific templates) before testing

3. **Template Loading**: Server templates require `precompiled/server.js`, validation templates require `precompiled/validation.js`. Each index.ts loads its corresponding precompiled file.

4. **Response Status Codes**: Currently handles: 200 (OK), 201 (Created), 204 (No Content), 302 (Found). Add new status codes in `ServerRoute.hbs` if needed.

5. **Helper Registration**: Custom helpers must be registered in their respective `helpers.ts` files before use in templates

6. **Lerna Publishing**: Use `pnpm release` (builds, tests, then publishes) not `pnpm release:publish` directly

## Code Style

- **Prettier**: 120 char line width, single quotes, trailing commas
- **ESLint**: TypeScript strict mode with Prettier integration
- **Commits**: Use `pnpm commit` for conventional commits via Commitizen
- **Hooks**: Husky runs lint-staged on pre-commit (eslint + prettier on staged files)
