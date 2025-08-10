import { crudUser } from "@lib/dao/user/crud"
import { db } from "@template-nextjs/db"
import { Hono } from "hono"
import { describeRoute } from "hono-openapi"
import { resolver } from "hono-openapi/typebox"
import { authMiddleware } from "../middleware.ts"
import { ErrorResponseT } from "../utils/common.serializer.ts"
import { throwInternalServerError } from "../utils/http-exception.ts"

const app = new Hono().use(authMiddleware).delete(
  "/me/delete",
  describeRoute({
    responses: {
      204: {
        description: "User successfully deleted",
      },
      500: {
        content: {
          "application/json": {
            schema: resolver(ErrorResponseT),
          },
        },
      },
    },
  }),
  async (c) => {
    const user = c.var.user

    const result = await crudUser(db).deleteUser(user.id)
    if (!result) {
      return throwInternalServerError(c, "Failed to delete user")
    }

    return c.body(null, 204)
  },
)

export default app
