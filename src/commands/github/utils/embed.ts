import { Colors, EmbedBuilder, User } from "discord.js";
import { MAX_EMBED_TITLE_LENGTH, REPO } from "../config";
import { truncate } from "../../../utils/string";
import type { GithubIssue } from "../../../models/gh";

export function buildIssueEmbed(issue: GithubIssue, author: User): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setAuthor({ name: author.username, iconURL: author.displayAvatarURL() })
        .setTitle(truncate(`#${issue.number}: ${issue.title}`, MAX_EMBED_TITLE_LENGTH))
        .setURL(issue.html_url)
        .setFooter({ text: `Created on ${REPO}` })
        .setTimestamp(new Date(issue.created_at))
    return embed
}

export function buildErrorEmbed(message: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Something went wrong")
        .setDescription(message)
}
