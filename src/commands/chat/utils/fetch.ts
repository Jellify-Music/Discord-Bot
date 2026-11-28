import type { ChatInputCommandInteraction } from "discord.js"
import type { ChatCompletionSystemMessageParam } from "openai/resources"
import { CHAT__SYSTEM_PROMPT, FALLBACK_RESPONSE, DISCORD_MAX_MESSAGE_LENGTH } from "../../../config/chat"
import { stripThinking, truncate } from "../../../utils/string"
import type { ChatTemplateParams } from "../types"
import { openai } from "../../../constants/chat"


export async function fetchChatResponse(
    interaction: ChatInputCommandInteraction
) : Promise<string> {
    const additionalPrompts = process.env.OPENAI_ADDITIONAL_SYSTEM_PROMPTS ?? ''

    const systemPrompts : ChatCompletionSystemMessageParam = {
        role: 'system',
        content: CHAT__SYSTEM_PROMPT.concat(additionalPrompts)
    }

    const params: ChatTemplateParams = {
        model: process.env.OPENAI_MODEL ?? 'gpt-5.4-mini',
        messages: ([
            systemPrompts,
            {
                role: 'user',
                content: interaction.options.getString('message', true)
            }
        ])
    }

    if (process.env.OPENAI_DISABLE_THINKING === 'true')
        params.chat_template_kwargs = { enable_thinking: false }

    const chatResponse = await openai.chat.completions.create(params)

    const content = stripThinking(chatResponse.choices[0]?.message.content ?? '')

    return truncate(content || FALLBACK_RESPONSE, DISCORD_MAX_MESSAGE_LENGTH)
}
