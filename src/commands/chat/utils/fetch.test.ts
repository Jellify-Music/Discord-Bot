import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { completion, createCompletion } from "../../../test/openai";
import { fakeInteraction } from "../../../test/discord";
import { CHAT__SYSTEM_PROMPT, DISCORD_MAX_MESSAGE_LENGTH, FALLBACK_RESPONSE } from "../../../config/chat";

const { fetchChatResponse } = await import("./fetch")

const ENV_KEYS = ["OPENAI_MODEL", "OPENAI_ADDITIONAL_SYSTEM_PROMPTS", "OPENAI_DISABLE_THINKING"] as const
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]))

const interaction = () => fakeInteraction({ strings: { message: "hey jerry" } })

beforeEach(() => {
    createCompletion.mockReset()
    for (const key of ENV_KEYS) delete process.env[key]
})

afterEach(() => {
    for (const key of ENV_KEYS) {
        if (originalEnv[key] === undefined) delete process.env[key]
        else process.env[key] = originalEnv[key]
    }
})

describe("fetchChatResponse", () => {
    test("sends the system prompt, additional prompts and user message", async () => {
        process.env.OPENAI_MODEL = "mlx-community/Qwen3.5-9B-4bit"
        process.env.OPENAI_ADDITIONAL_SYSTEM_PROMPTS = "You are Jerry."
        createCompletion.mockResolvedValue(completion("hi"))

        await fetchChatResponse(interaction())

        expect(createCompletion).toHaveBeenCalledWith({
            model: "mlx-community/Qwen3.5-9B-4bit",
            messages: [
                { role: "system", content: CHAT__SYSTEM_PROMPT + "You are Jerry." },
                { role: "user", content: "hey jerry" }
            ]
        })
    })

    test("falls back to the default model", async () => {
        createCompletion.mockResolvedValue(completion("hi"))

        await fetchChatResponse(interaction())

        expect(createCompletion.mock.calls[0]?.[0].model).toBe("gpt-5.4-mini")
    })

    test("doesn't send chat template args by default", async () => {
        createCompletion.mockResolvedValue(completion("hi"))

        await fetchChatResponse(interaction())

        expect(createCompletion.mock.calls[0]?.[0]).not.toHaveProperty("chat_template_kwargs")
    })

    test("doesn't send chat template args for values other than 'true'", async () => {
        process.env.OPENAI_DISABLE_THINKING = "1"
        createCompletion.mockResolvedValue(completion("hi"))

        await fetchChatResponse(interaction())

        expect(createCompletion.mock.calls[0]?.[0]).not.toHaveProperty("chat_template_kwargs")
    })

    test("disables thinking when OPENAI_DISABLE_THINKING is true", async () => {
        process.env.OPENAI_DISABLE_THINKING = "true"
        createCompletion.mockResolvedValue(completion("hi"))

        await fetchChatResponse(interaction())

        expect(createCompletion.mock.calls[0]?.[0].chat_template_kwargs).toEqual({ enable_thinking: false })
    })

    test("strips reasoning from the response", async () => {
        createCompletion.mockResolvedValue(completion("<think>\nwhat would jerry say\n</think>\n\nWhat a long strange trip it's been"))

        expect(await fetchChatResponse(interaction())).toBe("What a long strange trip it's been")
    })

    test("truncates responses to Discord's message limit", async () => {
        createCompletion.mockResolvedValue(completion("a".repeat(DISCORD_MAX_MESSAGE_LENGTH + 500)))

        const response = await fetchChatResponse(interaction())

        expect(response).toHaveLength(DISCORD_MAX_MESSAGE_LENGTH)
        expect(response.endsWith("…")).toBe(true)
    })

    test("measures the limit after stripping reasoning", async () => {
        const answer = "a".repeat(DISCORD_MAX_MESSAGE_LENGTH)
        createCompletion.mockResolvedValue(completion(`<think>${"b".repeat(5000)}</think>${answer}`))

        expect(await fetchChatResponse(interaction())).toBe(answer)
    })

    test.each([
        ["null content", completion(null)],
        ["only reasoning", completion("<think>hmm</think>")],
        ["no choices", { choices: [] }]
    ])("returns the fallback response for %s", async (_label, response) => {
        createCompletion.mockResolvedValue(response)

        expect(await fetchChatResponse(interaction())).toBe(FALLBACK_RESPONSE)
    })

    test("propagates request errors", async () => {
        createCompletion.mockRejectedValue(new Error("Request timed out."))

        await expect(fetchChatResponse(interaction())).rejects.toThrow("Request timed out.")
    })
})
