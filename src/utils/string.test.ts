import { describe, expect, test } from "bun:test";
import { truncate } from "./string";

describe("truncate", () => {
    test("returns text unchanged when shorter than the max length", () => {
        expect(truncate("hello", 10)).toBe("hello")
    })

    test("returns text unchanged when exactly the max length", () => {
        expect(truncate("hello", 5)).toBe("hello")
    })

    test("truncates and appends an ellipsis when over the max length", () => {
        const result = truncate("hello world", 8)
        expect(result).toBe("hello w…")
        expect(result).toHaveLength(8)
    })
})
