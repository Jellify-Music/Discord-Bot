import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createIssueOnGithub, searchIssuesOnGithub } from "./issue";
import type { SlashCommand } from "../../types/command";

/**
 * Handles the `/issue` command for searching and creating GitHub issues.
 */
export const issueCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('issue')
        .setDescription("Search for or create issues on GitHub")
        .addSubcommand(subCommand =>
            subCommand
                .setName('search')
                .setDescription('Search for an issue')
                .addStringOption((option) =>
                    option
                        .setName('query')
                        .setDescription('What to search for')
                        .setRequired(true)
                )
        )
        .addSubcommand(subCommand =>
            subCommand
                .setName('create')
                .setDescription('Creates a new issue on GitHub')
                .addStringOption((option) =>
                    option
                        .setName('title')
                        .setDescription('The title for this issue')
                        .setRequired(true)
                        .setMaxLength(256)
                )
                .addStringOption((option) =>
                    option
                        .setName('description')
                        .setDescription('A description of the issue')
                )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const embed = interaction.options.getSubcommand() === 'create'
            ? await createIssueOnGithub(
                interaction.options.getString('title', true),
                interaction.options.getString('description'),
                interaction.user
            )
            : await searchIssuesOnGithub(interaction.options.getString('query', true))

        if (interaction.replied) {
            return
        }

        await interaction.editReply({ embeds: [embed] });
    }
}
