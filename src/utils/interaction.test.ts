import { afterAll, describe, expect, spyOn, test } from "bun:test";
import { MessageFlags } from "discord.js";
import { fakeInteraction } from "../test/discord";
import { COMMAND_ERROR_MESSAGE, reportCommandError } from "./interaction";

// Silence the expected error logging from failure cases
const consoleError = spyOn(console, "error").mockImplementation(() => {})

afterAll(() => consoleError.mockRestore())

describe("reportCommandError", () => {
    test("replies ephemerally when the interaction hasn't been answered", async () => {
        const interaction = fakeInteraction()

        await reportCommandError(interaction)

        expect(interaction.reply).toHaveBeenCalledWith({ content: COMMAND_ERROR_MESSAGE, flags: MessageFlags.Ephemeral })
        expect(interaction.editReply).not.toHaveBeenCalled()
    })

    test("edits the reply when the interaction was deferred", async () => {
        const interaction = fakeInteraction()
        interaction.deferred = true

        await reportCommandError(interaction)

        expect(interaction.editReply).toHaveBeenCalledWith({ content: COMMAND_ERROR_MESSAGE })
        expect(interaction.reply).not.toHaveBeenCalled()
    })

    test("edits the reply when the interaction was already replied to", async () => {
        const interaction = fakeInteraction()
        interaction.replied = true

        await reportCommandError(interaction)

        expect(interaction.editReply).toHaveBeenCalledWith({ content: COMMAND_ERROR_MESSAGE })
        expect(interaction.reply).not.toHaveBeenCalled()
    })

    test("doesn't throw when Discord rejects the error message", async () => {
        const interaction = fakeInteraction()
        interaction.deferred = true
        interaction.editReply.mockImplementation(async () => { throw new Error("Unknown interaction") })

        await expect(reportCommandError(interaction)).resolves.toBeUndefined()
        expect(consoleError).toHaveBeenCalled()
    })
})
