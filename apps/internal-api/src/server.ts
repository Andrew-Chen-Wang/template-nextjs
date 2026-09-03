import { networkInterfaces } from "node:os"
import { serve } from "@hono/node-server"
import app from "./index"

function getPrivateIP(): string {
  const interfaces = networkInterfaces()
  for (const addresses of Object.values(interfaces)) {
    for (const address of addresses ?? []) {
      if (address.family === "IPv4" && !address.internal) return address.address
    }
  }
  return "127.0.0.1"
}

serve({ fetch: app.fetch, port: 3001 }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
  console.log(`             http://${getPrivateIP()}:${info.port}`)
})
