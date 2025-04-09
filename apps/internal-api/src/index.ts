import { apiReference } from "@scalar/hono-api-reference"
import { Hono } from "hono"
import { generateSpecs, openAPISpecs } from "hono-openapi"
import v1 from "./v1"

const app = new Hono().basePath("/api")
if (process.env.NODE_ENV === "development") {
  app.get(
    "/openapi",
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Internal API",
          version: "1.0.0",
          description: "Internal API",
        },
        servers: [{ url: "http://localhost:3000", description: "Local Server" }],
      },
    }),
  )
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
  const specs = generateSpecs(app, {
    documentation: {
      info: {
        title: "Internal API",
        version: "1.0.0",
        description: "Internal API",
      },
      servers: [{ url: "http://localhost:3000", description: "Local Server" }],
    },
  }).then((specs) => {
    console.log(JSON.stringify(specs, null, 2))
  })
}
