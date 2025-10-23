import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: "http://localhost:3000/api/openapi",
  output: {
    indexFile: false,
    path: "apps/website/src/services/client",
    lint: "eslint",
  },
  plugins: [
    "@hey-api/client-fetch",
    { name: "@tanstack/react-query", mutationOptions: true, queryKeys: true },
    "@hey-api/typescript",
    "@hey-api/transformers",
    // "zod",
    {
      name: "@hey-api/sdk",
      // validator: {
      //   request: "zod",
      // },
      asClass: false,
    },
  ],
})
