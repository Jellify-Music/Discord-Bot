import { expect, test } from "bun:test";
import pingCommand from "./ping";
import { fakeInteraction } from "../test/discord";

test("/ping replies with Pong!", async () => {
    const interaction = fakeInteraction()

    await pingCommand.execute(interaction)

    expect(pingCommand.data.name).toBe("ping")
    expect(interaction.reply).toHaveBeenCalledWith("Pong!")
})
