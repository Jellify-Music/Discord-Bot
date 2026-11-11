import { Octokit } from "octokit";
import { Colors, EmbedBuilder, type User } from "discord.js";
import { truncate } from "../../utils/string";
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "../../config/gh";
import { MAX_SEARCH_RESULTS, MAX_EMBED_TITLE_LENGTH, MAX_EMBED_DESCRIPTION_LENGTH, REPO, REPO_URL } from "./config";
import { buildErrorEmbed, buildIssueEmbed } from "./utils/embed";

function getOctokit(): Octokit {
    return new Octokit({ auth: process.env.GITHUB_TOKEN })
}

export async function createIssueOnGithub(
    title: string,
    description: string | null,
    author: User
) : Promise<EmbedBuilder> {
    const body = [
        description ?? "",
        "",
        "---",
        `_Reported from Discord by **${author.username}**_`
    ].join("\n").trim()

    try {
        const { data: issue } = await getOctokit().rest.issues.create({
            owner: GITHUB_REPO_OWNER,
            repo: GITHUB_REPO_NAME,
            title,
            body
        })

        const embed = buildIssueEmbed(issue, author)

        if (description) {
            embed.setDescription(truncate(description, MAX_EMBED_DESCRIPTION_LENGTH))
        }

        return embed
    } catch (error) {
        console.error(error)
        return buildErrorEmbed("Sorry! I wasn't able to create that issue on GitHub.")
    }
}

export async function searchIssuesOnGithub(query: string) : Promise<EmbedBuilder> {
    const searchQuery = `${query} repo:${REPO} is:issue`

    try {
        const { data } = await getOctokit().rest.search.issuesAndPullRequests({
            q: searchQuery,
            per_page: MAX_SEARCH_RESULTS
        })

        const embed = new EmbedBuilder()
            .setTitle(truncate(`Issues matching "${query}"`, MAX_EMBED_TITLE_LENGTH))
            .setURL(`${REPO_URL}/issues?q=${encodeURIComponent(searchQuery)}`)

        if (!data.items.length) {
            return embed
                .setColor(Colors.Grey)
                .setDescription("No issues found.")
        }

        const results = data.items.map((issue) =>
            `${issue.state === "open" ? "🟢" : "🟣"} [#${issue.number}: ${issue.title}](${issue.html_url})`
        )

        return embed
            .setColor(Colors.Blurple)
            .setDescription(truncate(results.join("\n"), MAX_EMBED_DESCRIPTION_LENGTH))
            .setFooter({
                text: `Showing ${data.items.length} of ${data.total_count} result${data.total_count === 1 ? "" : "s"} on ${REPO}`
            })
    } catch (error) {
        console.error(error)
        return buildErrorEmbed("Sorry! I wasn't able to search for issues on GitHub.")
    }
}
