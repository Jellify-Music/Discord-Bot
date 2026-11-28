import type { SlashCommand } from "../../types/command";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchChatResponse } from "./utils/fetch";

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
        await interaction.editReply(response)
    }
}

export default chatCommand
