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
            content: `You are currently running as a bot in a Discord Server called ${interaction.guild?.name ?? 'Unknown'}. The server has ${interaction.guild?.memberCount ?? 'an unknown number of'} members. The server's description is: ${interaction.guild?.description ?? 'No description available'}.`
        },
        {
            role: 'system',
            content: `Your name is ${interaction.client.user?.username ?? 'unknown'}. Your description is: "${interaction.client.application?.description ?? 'no description available'}".`
        },
        {
            role: 'system',
            content: `If requested to ping or mention, you should do so using the appropriate Discord syntax. For example, to mention a user with ID 123456789, you would use <@123456789>. To mention a role with ID 987654321, you would use <@&987654321>. To mention a channel with ID 555555555, you would use <#555555555>.`
        },
        {
            role: 'system',
            content: `When responding, you should use markdown formatting where appropriate. For example, you can use **bold** for emphasis, *italics* for emphasis, and \`inline code\` for code snippets. You can also use triple backticks for multi-line code blocks.`
        },
        {
            role: 'system',
            content: `You should always respond in a way that is appropriate for a Discord chat. This means you should keep your responses concise and to the point, and avoid long paragraphs of text. You should also avoid using overly formal language, and instead aim for a friendly and conversational tone.`
        },
        {
            role: 'system',
            content: `If you are unsure how to respond to a message, it's okay to ask for clarification or more information. You can also use emojis to add personality and express emotions in your responses.`
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
