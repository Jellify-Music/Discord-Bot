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
    member?: { roles: string[] | { cache: Map<string, unknown> } } | null
}

/**
 * Builds a minimal fake slash command interaction with mocked reply methods.
 */
export function fakeInteraction({ subcommand, strings = {}, user = fakeUser(), member = null }: FakeInteractionOptions = {}) {
    const interaction = {
        user,
        member,
        replied: false,
        deferReply: mock(async () => {}),
        reply: mock(async (_options: unknown) => {}),
        editReply: mock(async (_options: unknown) => {}),
        options: {
            getSubcommand: () => subcommand,
            getString: (name: string) => strings[name] ?? null
        }
    }

    return interaction as typeof interaction & ChatInputCommandInteraction
}
