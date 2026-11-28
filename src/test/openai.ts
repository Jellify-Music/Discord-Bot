import { mock } from "bun:test";

/**
 * Shared mocks for the `openai` client.
 *
 * `mock.module` applies to the whole test run, so every test file that needs
 * the client should import these rather than registering its own module mock.
 */
export const createCompletion = mock()

mock.module("openai", () => ({
    default: class {
        chat = { completions: { create: createCompletion } }
        /** Exposed so tests can check how the client was configured */
        constructor(public options: unknown) {}
    }
}))

/** Builds a minimal chat completion response with the given content */
export function completion(content: string | null) {
    return { choices: [{ message: { content } }] }
}
