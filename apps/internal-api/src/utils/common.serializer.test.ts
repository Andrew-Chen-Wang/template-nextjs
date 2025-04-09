import { Type } from "@sinclair/typebox"
import { TypeCompiler } from "@sinclair/typebox/compiler"
import { Value } from "@sinclair/typebox/value"
import { describe, expect, it } from "vitest"
import { PositiveIntegerString, Refine } from "./common.serializer"

describe("validate Refine", () => {
  it("should throw an error if the value is not a valid positive integer", () => {
    const T = Refine(Type.String(), (value) => value.length <= 255, {
      message: "String can't be more than 255 characters",
    })
    expect(Value.Parse(T, "".padEnd(255))).toBe("".padEnd(255))
    expect(() => Value.Parse(T, "a".repeat(256))).toThrow(
      "String can't be more than 255 characters",
    )
  })
})

describe("validate PositiveIntegerString", () => {
  const TPositiveIntegerString = TypeCompiler.Compile(PositiveIntegerString)

  function validatePositiveIntegerString(value: unknown): boolean {
    return TPositiveIntegerString.Check(value)
  }

  it("should return string for valid input", () => {
    Value.Assert(PositiveIntegerString, "1")
    expect(Value.Parse(PositiveIntegerString, 1)).toBe("1")
    expect(Value.Parse(PositiveIntegerString, "1")).toBe("1")
    expect(Value.Parse(PositiveIntegerString, BigInt(1))).toBe("1")
  })

  it("should return true for a valid number string", () => {
    expect(validatePositiveIntegerString("123")).toBe(true)
  })

  it("should return false for an invalid number string", () => {
    expect(validatePositiveIntegerString(-123)).toBe(false)
    expect(validatePositiveIntegerString("-123")).toBe(false)
    expect(validatePositiveIntegerString("0")).toBe(false)
    expect(validatePositiveIntegerString(0)).toBe(false)
    expect(validatePositiveIntegerString(123.113)).toBe(false)
    expect(validatePositiveIntegerString("0.1")).toBe(false)
    expect(validatePositiveIntegerString("123.113")).toBe(false)
    expect(validatePositiveIntegerString("abc")).toBe(false)
    expect(validatePositiveIntegerString(BigInt(0))).toBe(false)
    expect(validatePositiveIntegerString(BigInt(-1))).toBe(false)
  })
})
