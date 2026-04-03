import { networkInterfaces } from "node:os"
import { Scalar } from "@scalar/hono-api-reference"
import { Hono } from "hono"
import { generateSpecs, type OpenApiSpecsOptions, openAPISpecs } from "hono-typebox-openapi"
import { ErrorObjectT, ErrorResponseT, InnerErrorT } from "./utils/errors/error.serializer"
import { serve } from "@hono/node-server"
import v1 from "./v1"

const spec: OpenApiSpecsOptions = {
  documentation: {
    info: {
      title: "Internal API",
      version: "1.0.0",
      description: "Internal API",
    },
    servers: [{ url: "http://localhost:3001", description: "Local Server" }],
    components: {
      schemas: {
        InnerErrorT,
        ErrorObjectT,
        ErrorResponseT,
      },
    },
  },
}

const app = new Hono()
if (process.env.NODE_ENV === "development") {
  app.get("/openapi", openAPISpecs(app, spec))
  app.get(
    "/docs",
    Scalar(() => {
      return {
        url: "/openapi",
        theme: "saturn",
      }
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

if (process.env.NODE_ENV === "development") {
  function getPrivateIP() {
    const interfaces = networkInterfaces()
    for (const interfaceName in interfaces) {
      const addresses = interfaces[interfaceName]
      if (addresses) {
        for (const addr of addresses) {
          // Filter for IPv4 and non-internal loopback addresses
          if (addr.family === "IPv4" && !addr.internal) {
            return addr.address
          }
        }
      }
    }
    return "127.0.0.1" // Fallback to localhost
  }
  serve(
    {
      fetch: app.fetch,
      port: 3001,
    },
    (info) => {
      console.log(`Listening on http://localhost:${info.port}`)
      console.log(`             http://${getPrivateIP()}:${info.port}`)
    },
  )
}
