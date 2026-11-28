import { describe, expect, test } from "bun:test";
import { stripThinking, truncate } from "./string";

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

describe("stripThinking", () => {
    test("returns text unchanged when there is no reasoning", () => {
        expect(stripThinking("hello there")).toBe("hello there")
    })

    test("removes a complete think block", () => {
        expect(stripThinking("<think>\nhmm, let me see\n</think>\n\nhello there")).toBe("hello there")
    })

    test("removes multiple think blocks", () => {
        expect(stripThinking("<think>a</think>hello <think>b</think>there")).toBe("hello there")
    })

    test("removes reasoning before an orphaned closing tag", () => {
        expect(stripThinking("the template opened the tag\n</think>\nhello there")).toBe("hello there")
    })

    test("removes an unclosed think block", () => {
        expect(stripThinking("hello there<think>I ran out of tokens")).toBe("hello there")
    })

    test("returns an empty string when the content is only reasoning", () => {
        expect(stripThinking("<think>just thinking</think>")).toBe("")
    })
})
