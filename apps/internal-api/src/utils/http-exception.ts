import { HTTPException } from "hono/http-exception"
import { ErrorCode } from "./errors.enum"
import { createErrorObject } from "./errors/error.serializer"
import type { ErrorDetail } from "./errors/error.types"

type HTTPStatusCode = 400 | 401 | 403 | 404 | 405 | 409 | 422 | 429 | 500 | 503

/**
 * Throws an HTTPException with a standardized error response format
 *
 * @param status HTTP status code
 * @param code Error code from ErrorCode enum
 * @param message Human-readable error message
 * @param options Additional error options (target, details, innererror)
 */
export function throwError(
  status: HTTPStatusCode,
  code: ErrorCode,
  message: string,
  options?: {
    target?: string
    details?: ErrorDetail[]
    innererror?: {
      code: string
      innererror?: ErrorDetail["innererror"]
      // biome-ignore lint/suspicious/noExplicitAny: anything other than any might not work here
      [key: string]: any
    }
  },
): never {
  throw new HTTPException(status, {
    message: createErrorObject(code, message, options),
  })
}

// Common error throwing helpers

export function throwBadRequest(
  message = "Bad request",
  code: ErrorCode = ErrorCode.BadRequest,
  options?: Parameters<typeof throwError>[3],
): never {
  return throwError(400, code, message, options)
}

export function throwForbidden(
  message = "Forbidden",
  code: ErrorCode = ErrorCode.Forbidden,
  options?: Parameters<typeof throwError>[3],
): never {
  return throwError(403, code, message, options)
}

export function throwNotFound(
  message = "Not found",
  code: ErrorCode = ErrorCode.NotFound,
  options?: Parameters<typeof throwError>[3],
): never {
  return throwError(404, code, message, options)
}

export function throwTooManyRequests(
  message = "Too many requests",
  code: ErrorCode = ErrorCode.TooManyRequests,
  options?: Parameters<typeof throwError>[3],
): never {
  return throwError(429, code, message, options)
}

export function throwInternalServerError(
  message = "Internal server error",
  code: ErrorCode = ErrorCode.InternalServerError,
  options?: Parameters<typeof throwError>[3],
): never {
  return throwError(500, code, message, options)
}
