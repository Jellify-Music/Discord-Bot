import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources";

/**
 * Some OpenAI-compatible servers (e.g. mlx_lm.server, vLLM) accept extra chat template
 * arguments. Reasoning models like Qwen3.5 use `enable_thinking` to toggle their
 * `<think>` phase, which is slow and noisy for a chat bot.
 *
 * OpenAI's own API rejects unknown parameters, so this is opt-in.
 */
export type ChatTemplateParams = ChatCompletionCreateParamsNonStreaming & {
    chat_template_kwargs?: Record<string, unknown>
}
