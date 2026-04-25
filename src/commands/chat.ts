import OpenAI from "openai";
import type { SlashCommand } from "../types/command";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import type { ChatCompletionSystemMessageParam } from "openai/resources";

async function fetchChatResponse(message: string) : Promise<string> {

    // Build OpenAI client
    const openai = new OpenAI({
        baseURL: process.env.OPENAI_BASE_URL,
        apiKey: process.env.OPENAI_API_KEY
    })

    const additionalSystemPrompts : ChatCompletionSystemMessageParam[] = process.env.OPENAI_ADDITIONAL_SYSTEM_PROMPTS
        ?.split(',')
        .map((prompt) => ({
            role: 'system',
            content: prompt
        })) ?? []

    const chatResponse = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-5.4-mini',
        messages: [
            {
                role: 'system',
                content: 'You are currently running as a bot in a Discord Server'
            },
            ...additionalSystemPrompts,
            {
                role: 'user',
                content: message
            }
        ]
    })

    return chatResponse.choices[0]?.message.content?.trim() ?? 
    "Sorry! I got tongue-tied and couldn't figure out what to say!"
}

const chatCommand: SlashCommand = {
    //@ts-expect-error
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
        const response = await fetchChatResponse(interaction.options.getString('message', true))
        await interaction.followUp(response)
    }
}

export default chatCommand
