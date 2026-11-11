import { mock } from "bun:test";
import type { ChatInputCommandInteraction, User } from "discord.js";

/**
 * Builds a minimal fake Discord user for tests.
 */
export function fakeUser(username = "tester"): User {
    return {
        username,
        displayAvatarURL: () => `https://cdn.discordapp.com/avatars/${username}.png`
    } as unknown as User
}

interface FakeInteractionOptions {
    subcommand?: string
    strings?: Record<string, string | null>
    user?: User
}

/**
 * Builds a minimal fake slash command interaction with mocked reply methods.
 */
export function fakeInteraction({ subcommand, strings = {}, user = fakeUser() }: FakeInteractionOptions = {}) {
    const interaction = {
        user,
        replied: false,
        deferReply: mock(async () => {}),
        reply: mock(async () => {}),
        editReply: mock(async () => {}),
        options: {
            getSubcommand: () => subcommand,
            getString: (name: string) => strings[name] ?? null
        }
    }

    return interaction as typeof interaction & ChatInputCommandInteraction
}
