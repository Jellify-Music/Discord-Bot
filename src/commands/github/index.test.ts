import { afterAll, beforeEach, describe, expect, spyOn, test } from "bun:test";
import { EmbedBuilder } from "discord.js";
import { issueCommand } from "./index";
import * as issue from "./issue";
import { fakeInteraction, fakeUser } from "../../test/discord";

const createEmbed = new EmbedBuilder().setTitle("created")
const searchEmbed = new EmbedBuilder().setTitle("searched")

// Spies (unlike mock.module) are restorable, so they don't leak into issue.test.ts
const createIssueOnGithub = spyOn(issue, "createIssueOnGithub").mockResolvedValue(createEmbed)
const searchIssuesOnGithub = spyOn(issue, "searchIssuesOnGithub").mockResolvedValue(searchEmbed)

beforeEach(() => {
    createIssueOnGithub.mockClear()
    searchIssuesOnGithub.mockClear()
})

afterAll(() => {
    createIssueOnGithub.mockRestore()
    searchIssuesOnGithub.mockRestore()
})

describe("/issue", () => {
    test("registers create and search subcommands", () => {
        const json = issueCommand.data.toJSON()

        expect(json.name).toBe("issue")
        expect(json.options?.map((option) => option.name)).toEqual(["search", "create"])
    })

    test("create subcommand creates an issue and replies with the embed", async () => {
        const user = fakeUser("violet")
        const interaction = fakeInteraction({
            subcommand: "create",
            strings: { title: "Crash on launch", description: "It crashes." },
            user
        })

        await issueCommand.execute(interaction)

        expect(interaction.deferReply).toHaveBeenCalled()
        expect(createIssueOnGithub).toHaveBeenCalledWith("Crash on launch", "It crashes.", user)
        expect(searchIssuesOnGithub).not.toHaveBeenCalled()
        expect(interaction.editReply).toHaveBeenCalledWith({ embeds: [createEmbed] })
    })

    test("search subcommand searches issues and replies with the embed", async () => {
        const interaction = fakeInteraction({ subcommand: "search", strings: { query: "crash" } })

        await issueCommand.execute(interaction)

        expect(searchIssuesOnGithub).toHaveBeenCalledWith("crash")
        expect(createIssueOnGithub).not.toHaveBeenCalled()
        expect(interaction.editReply).toHaveBeenCalledWith({ embeds: [searchEmbed] })
    })
})
