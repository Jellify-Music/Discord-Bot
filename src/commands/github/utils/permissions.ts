import type { ChatInputCommandInteraction } from "discord.js"
import { getIssueCreatorRoleId } from "../../../config/gh"

/**
 * Whether the user may create issues. Anyone can if no creator role is configured.
 */
export function canCreateIssue(interaction: ChatInputCommandInteraction): boolean {
    const roleId = getIssueCreatorRoleId()

    if (!roleId) {
        return true
    }

    const roles = interaction.member?.roles

    if (!roles) {
        return false
    }

    // Uncached guild members come through as raw API data with a list of role IDs
    return Array.isArray(roles) ? roles.includes(roleId) : roles.cache.has(roleId)
}
