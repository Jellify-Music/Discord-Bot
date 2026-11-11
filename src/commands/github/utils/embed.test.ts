import { describe, expect, test } from "bun:test";
import { Colors } from "discord.js";
import { buildErrorEmbed, buildIssueEmbed } from "./embed";
import { MAX_EMBED_TITLE_LENGTH, REPO } from "../config";
import { fakeUser } from "../../../test/discord";
import type { GithubIssue } from "../../../models/gh";

const issue: GithubIssue = {
    number: 42,
    title: "Playback stops after one song",
    html_url: "https://github.com/Jellify-Music/App/issues/42",
    state: "open",
    created_at: "2026-01-02T03:04:05Z"
}

describe("buildIssueEmbed", () => {
    test("populates the embed from the issue and author", () => {
        const { data } = buildIssueEmbed(issue, fakeUser("violet"))

        expect(data.color).toBe(Colors.Green)
        expect(data.title).toBe("#42: Playback stops after one song")
        expect(data.url).toBe(issue.html_url)
        expect(data.author?.name).toBe("violet")
        expect(data.footer?.text).toBe(`Created on ${REPO}`)
        expect(data.timestamp).toBe(new Date(issue.created_at).toISOString())
    })

    test("truncates long titles to the Discord limit", () => {
        const { data } = buildIssueEmbed({ ...issue, title: "a".repeat(500) }, fakeUser())

        expect(data.title).toHaveLength(MAX_EMBED_TITLE_LENGTH)
        expect(data.title?.endsWith("…")).toBe(true)
    })
})

describe("buildErrorEmbed", () => {
    test("builds a red embed with the message", () => {
        const { data } = buildErrorEmbed("Oops")

        expect(data.color).toBe(Colors.Red)
        expect(data.description).toBe("Oops")
    })
})
