/**
 * TypeBox schemas for standardized error responses
 * Following the OData v4 JSON spec format as specified in the Hono error code rule
 * See Microsoft API guidelines for how this works
 * https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#710-response-formats
 */
import { Type } from "@sinclair/typebox"
import { ErrorCode } from "../errors.enum.ts"
import type { ErrorDetail } from "./error.types.ts"

export const InnerErrorT = Type.Recursive((self) =>
  Type.Object(
    {
      code: Type.String(),
      innererror: Type.Optional(self),
    },
    { additionalProperties: true },
  ),
)

export const ErrorObjectT = Type.Recursive((self) =>
  Type.Object({
    code: Type.Union([Type.Enum(ErrorCode), Type.String()]),
    message: Type.String(),
    target: Type.Optional(Type.String()),
    details: Type.Optional(Type.Array(self)),
    innererror: Type.Optional(InnerErrorT),
  }),
)

export const ErrorResponseT = Type.Object({
  error: ErrorObjectT,
})

/**
 * Helper function to create a standard error response object
 */
export function createErrorResponse(
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
) {
  return {
    error: {
      code,
      message,
      ...(options?.target && { target: options.target }),
      ...(options?.details && { details: options.details }),
      ...(options?.innererror && { innererror: options.innererror }),
    },
  }
}

/**
 * Helper function to create an HTTPException with a standard error response
 * To be used with: throw new HTTPException(status, { message: JSON.stringify(errorObj) })
 */
export function createErrorObject(
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
) {
  return JSON.stringify(createErrorResponse(code, message, options))
}
