import app from "@api/internal"
import { Hono } from "hono"
import { handle } from "hono/vercel"

export const runtime = "nodejs"

const mounted = new Hono().route("/api", app)
const handler = handle(mounted)

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
