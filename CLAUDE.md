# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Install dependencies
npm install

# Start development server (website + API)
npm run dev --workspace=website

# Run all tests
npm test

# Run a single test file
npx vitest run path/to/file.test.ts --config .config/vitest.config.mts

# Lint and format
npm run lint          # Biome check with auto-fix
npm run eslint        # ESLint check with auto-fix

# Database
docker-compose up -d                              # Start PostgreSQL
npm run migrate:latest --workspace=dbmigrator     # Run migrations
npm run db-codegen --workspace=@queryme/db        # Generate Kysely types

# Create new migration
cd apps/dbmigrator/src && npx kysely migrate:make <name>

# Generate OpenAPI client (requires dev server running)
npm run openapi --workspace=website

# Stripe webhook testing
stripe listen --forward-to localhost:3000/api/v1/stripe-webhook
```

## Architecture

This is a TypeScript monorepo with npm workspaces:

**Apps:**
- `apps/website` - Next.js frontend with Tailwind/ShadCN UI. API routes are proxied through `/api`
- `apps/internal-api` - Hono API with TypeBox schemas and OpenAPI generation. Mounted at `/api` via Next.js
- `apps/dbmigrator` - Kysely database migrations

**Packages:**
- `packages/db` - Kysely database client and generated types (`@queryme/db`)
- `lib/typescript/dao` - Data access objects shared between API and website (`@lib/dao`)
- `lib/typescript/utils/*` - Utility libraries (e.g., `@utils/numbers`)

**Key patterns:**
- API uses Hono with `hono-typebox-openapi` for typed schemas and auto-generated OpenAPI specs
- Website consumes API via generated client from `@hey-api/openapi-ts` (TanStack Query hooks in `apps/website/src/services/client/`)
- Authentication handled via Arctic (OAuth with Google/Apple)
- Payments via Stripe with webhook handling

## API Development (Hono)

When creating/editing APIs in `apps/internal-api/src/`:

- Users are pre-authenticated via middleware; access via `c.var.user` without null checks
- Use relative imports within internal-api
- Use `throwError()` from `utils/http-exception.ts` for non-2xx responses
- Non-2xx responses must use `ErrorResponseT` schema
- Chain routes from app variable: `new Hono().use(middleware).get(...).post(...)` (never separate `app.get()` calls)
- Convert `Type | undefined` to `Type | null` using null coalescing
- Define schemas in separate `.serializer.ts` files, never inline `Type.Object({})`

**Schema naming convention:** `{apiRoute}Schema{Type}` where Type is: Query, Param, Response, or Request (e.g., `licenseSchemaQuery`)

**Schema rules:**
- IDs use `UUID7String` from `utils/common.serializer.ts`
- Nullable types use `Nullable` helper
- Dates return `Type.String({ format: "date-time" })`
- No `Type.Date` - only JSON-compatible types
- Wrap response schemas in `resolver(schema)` in route definitions

## TanStack Query (Website Frontend)

Generated hooks live in `apps/website/src/services/client/@tanstack/react-query.gen.ts`. After API changes, regenerate with `npm run openapi --workspace=website`.

**Queries - use generated options:**
```typescript
// ✅ GOOD: Spread generated options
import { getApiV1LicenseKeysOptions } from "@website/services/client/@tanstack/react-query.gen"

const { data } = useQuery({
  ...getApiV1LicenseKeysOptions()
})

// ❌ BAD: Manual queryFn with hardcoded URL
const { data } = useQuery({
  queryKey: ["license-keys"],
  queryFn: async () => {
    const response = await client.get({ url: "/api/v1/license/keys" })
    return response.data
  }
})
```

**Mutations - use generated mutation helpers:**
```typescript
// ✅ GOOD: Spread generated mutation
import { postApiV1StripeCheckoutMutation } from "@website/services/client/@tanstack/react-query.gen"

const checkoutMutation = useMutation({
  ...postApiV1StripeCheckoutMutation(),
  onSuccess: (data) => { window.location.href = data.checkoutUrl },
  onError: (error) => { toast.error(error.error.message) }
})

// Invoke with body
checkoutMutation.mutate({ body: { plan: "monthly" } })

// Invoke with path params
deleteKeyMutation.mutate({ path: { id: keyId } })

// Invoke with no params (still pass empty object)
createKeyMutation.mutate({})
```

**Types - import from generated types:**
```typescript
// ✅ GOOD: Use generated types
import type { GetApiV1LicenseKeysResponse } from "@website/services/client/types.gen"

// ❌ BAD: Manually define interface
interface LicenseKeysResponse { keys: LicenseKey[]; maxKeys: number }
```

**Error handling:** Mutation errors are typed. Access via `error.error.message` or `error.error.code`.
