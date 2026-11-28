import { expect, test } from "bun:test";
import "../test/openai";
import { CHAT_REQUEST_TIMEOUT_MS } from "../config/chat";

const { openai } = await import("./chat")

test("the OpenAI client times out before Discord's interaction token expires, without retrying", () => {
    const options = (openai as unknown as { options: Record<string, unknown> }).options

    expect(options).toMatchObject({ timeout: CHAT_REQUEST_TIMEOUT_MS, maxRetries: 0 })
    expect(CHAT_REQUEST_TIMEOUT_MS).toBeLessThan(15 * 60 * 1000)
})
