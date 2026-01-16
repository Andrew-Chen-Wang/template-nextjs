import { apiReference } from "@scalar/hono-api-reference"
import { Hono } from "hono"
import { generateSpecs, type OpenApiSpecsOptions, openAPISpecs } from "hono-typebox-openapi"
import { ErrorObjectT, ErrorResponseT, InnerErrorT } from "./utils/errors/error.serializer"
import v1 from "./v1"

const spec: OpenApiSpecsOptions = {
  documentation: {
    info: {
      title: "Internal API",
      version: "1.0.0",
      description: "Internal API",
    },
    servers: [{ url: "http://localhost:3000", description: "Local Server" }],
    components: {
      schemas: {
        InnerErrorT,
        ErrorObjectT,
        ErrorResponseT,
      },
    },
  },
}

const app = new Hono().basePath("/api")
if (process.env.NODE_ENV === "development") {
  app.get("/openapi", openAPISpecs(app, spec))
  app.get(
    "/docs",
    apiReference({
      theme: "saturn",
      spec: { url: "/api/openapi" },
    }),
  )
}

const routes = app.route("", v1)

export default app
export type AppType = typeof routes

if (process.argv.includes("--openapi")) {
  generateSpecs(app, spec)
    .then((specs) => {
      console.log(JSON.stringify(specs, null, 2))
    })
    .catch(console.error)
}
