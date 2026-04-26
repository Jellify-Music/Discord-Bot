import OpenAI from "openai";
import type { SlashCommand } from "../types/command";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import type { ChatCompletionSystemMessageParam } from "openai/resources";

async function fetchChatResponse(
    interaction: ChatInputCommandInteraction
) : Promise<string> {

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

    const systemPrompts : ChatCompletionSystemMessageParam[]= [
        {
            role: 'system',
            content: `You are currently running as a bot in a Discord Server called ${interaction.guild?.name ?? 'Unknown'}`
        },
        {
            role: 'system',
            content: `Your name is ${interaction.client.user?.username ?? 'unknown'}.`
        },
        {
            role: 'system',
            content: `If requested to ping or mention, you should do so using the appropriate Discord syntax. For example, to mention a user with ID 123456789, you would use <@123456789>. To mention a role with ID 987654321, you would use <@&987654321>. To mention a channel with ID 555555555, you would use <#555555555>.`
        },
        ...additionalSystemPrompts
    ]

    const chatResponse = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-5.4-mini',
        messages: ([
            ...systemPrompts,
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
        const response = await fetchChatResponse(interaction)
        await interaction.followUp(response)
    }
}

export default chatCommand
