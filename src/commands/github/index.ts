import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createIssueOnGithub } from "./issue";
import type { SlashCommand } from "../../types/command";


export const issue: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('create-issue')
        .setDescription("Creates an issue on GitHub")
        .addSubcommand(subCommand => 
            subCommand
                .setName('search')
                .setDescription('Search for an issue')
                .addStringOption((input) => 
                    input
                        .setName('search')
                )
        )
        .addSubcommand(subCommand => 
            subCommand
                .setName('create a new issue')
                .setDescription('Creates a new issue on GitHub')
                .addStringOption((option) => 
                    option.setName('title')
                    .setDescription('The title for this issue')
                )
                .addStringOption((option) => 
                    option
                        .setName('description')
                        .setDescription
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const result = await createIssueOnGithub()

        if (interaction.replied) {
            return
        }

        await interaction.editReply(result);
    }
}
