import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { createIssueOnGithub, searchIssuesOnGithub } from "./issue";
import { buildErrorEmbed } from "./utils/embed";
import type { SlashCommand } from "../../types/command";
import { canCreateIssue } from "./utils/permissions";

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
        const isCreate = interaction.options.getSubcommand() === 'create'

        if (isCreate && !canCreateIssue(interaction)) {
            await interaction.reply({
                embeds: [buildErrorEmbed("Sorry! You don't have permission to create issues.")],
                flags: MessageFlags.Ephemeral
            });
            return
        }

        await interaction.deferReply();

        const embed = isCreate
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
