import { beforeEach, describe, expect, test } from "bun:test";
import { completion, createCompletion } from "../../test/openai";
import { fakeInteraction } from "../../test/discord";

const { default: chatCommand } = await import("./index")

beforeEach(() => createCompletion.mockReset())

describe("/chat", () => {
    test("is registered as 'chat' with a required message option", () => {
        const json = chatCommand.data.toJSON()

        expect(json.name).toBe("chat")
        expect(json.options?.[0]).toMatchObject({ name: "message", required: true })
    })

    test("defers, then edits the reply with the response", async () => {
        createCompletion.mockResolvedValue(completion("Keep on truckin'"))
        const interaction = fakeInteraction({ strings: { message: "hey jerry" } })

        await chatCommand.execute(interaction)

        expect(interaction.deferReply).toHaveBeenCalled()
        expect(interaction.editReply).toHaveBeenCalledWith("Keep on truckin'")
    })

    test("rethrows request errors so the error handler can report them", async () => {
        createCompletion.mockRejectedValue(new Error("Connection error."))
        const interaction = fakeInteraction({ strings: { message: "hey jerry" } })

        await expect(chatCommand.execute(interaction)).rejects.toThrow("Connection error.")
        expect(interaction.deferReply).toHaveBeenCalled()
        expect(interaction.editReply).not.toHaveBeenCalled()
    })
})
