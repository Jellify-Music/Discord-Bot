import { MessageFlags, type ChatInputCommandInteraction } from "discord.js";

export const COMMAND_ERROR_MESSAGE = "There was an error executing that command!"

/**
 * Tells the user a command failed.
 *
 * A deferred interaction can't be replied to again, so it gets its "thinking"
 * message edited instead - otherwise Discord would keep showing "thinking" until
 * the interaction expires.
 *
 * Never throws: a failure to reach Discord is logged.
 * @param interaction The interaction whose command failed
 */
export async function reportCommandError(interaction: ChatInputCommandInteraction): Promise<void> {
    const content = COMMAND_ERROR_MESSAGE
    try {
        if (interaction.deferred || interaction.replied) await interaction.editReply({ content })
        else await interaction.reply({ content, flags: MessageFlags.Ephemeral })
    } catch (replyError) {
        console.error("Failed to report command error to Discord:", replyError)
    }
}
