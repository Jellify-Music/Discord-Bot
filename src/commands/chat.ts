import OpenAI from "openai";
import type { SlashCommand } from "../types/command";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import type { ChatCompletionSystemMessageParam } from "openai/resources";
import { CHAT__SYSTEM_PROMPT } from "../config/chat";

async function fetchChatResponse(
    interaction: ChatInputCommandInteraction
) : Promise<string> {

    // Build OpenAI client
    const openai = new OpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY
    })

    const additionalPrompts = process.env.OPENAI_ADDITIONAL_SYSTEM_PROMPTS ?? ''

    const systemPrompts : ChatCompletionSystemMessageParam = {
        role: 'system',
        content: CHAT__SYSTEM_PROMPT.concat(additionalPrompts)
    }

    const chatResponse = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-5.4-mini',
        messages: ([
            systemPrompts,
            {
                role: 'user',
                content: interaction.options.getString('message', true)
            }
        ])
    })

    return chatResponse.choices[0]?.message.content?.trim() ?? 
    "Sorry! I got tongue-tied and couldn't figure out what to say!"
}

const chatCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chat with the bot')
        .addStringOption((option) => 
            option.setName('message')
                .setDescription('The message to send to the bot')
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const response = await fetchChatResponse(interaction)
        await interaction.followUp(response)
    }
}

export default chatCommand
