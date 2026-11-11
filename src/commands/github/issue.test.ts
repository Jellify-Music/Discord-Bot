import { afterAll, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { Colors } from "discord.js";
import { fakeUser } from "../../test/discord";
import { MAX_SEARCH_RESULTS, REPO } from "./config";
import { GITHUB_REPO_NAME, GITHUB_REPO_OWNER } from "../../config/gh";

const createIssue = mock()
const searchIssues = mock()

mock.module("octokit", () => ({
    Octokit: class {
        rest = {
            issues: { create: createIssue },
            search: { issuesAndPullRequests: searchIssues }
        }
    }
}))

const { createIssueOnGithub, searchIssuesOnGithub } = await import("./issue")

// Silence the expected error logging from failure cases
const consoleError = spyOn(console, "error").mockImplementation(() => {})

afterAll(() => consoleError.mockRestore())

beforeEach(() => {
    createIssue.mockReset()
    searchIssues.mockReset()
})

describe("createIssueOnGithub", () => {
    const issue = {
        number: 7,
        title: "Crash on launch",
        html_url: "https://github.com/Jellify-Music/App/issues/7",
        state: "open",
        created_at: "2026-01-02T03:04:05Z"
    }

    test("creates the issue with attribution and returns an embed", async () => {
        createIssue.mockResolvedValue({ data: issue })

        const { data } = await createIssueOnGithub("Crash on launch", "It crashes.", fakeUser("violet"))

        expect(createIssue).toHaveBeenCalledWith({
            owner: GITHUB_REPO_OWNER,
            repo: GITHUB_REPO_NAME,
            title: "Crash on launch",
            body: "It crashes.\n\n---\n_Reported from Discord by **violet**_"
        })
        expect(data.title).toBe("#7: Crash on launch")
        expect(data.description).toBe("It crashes.")
    })

    test("omits the description when none is given", async () => {
        createIssue.mockResolvedValue({ data: issue })

        const { data } = await createIssueOnGithub("Crash on launch", null, fakeUser("violet"))

        expect(createIssue.mock.calls[0]?.[0].body).toBe("---\n_Reported from Discord by **violet**_")
        expect(data.description).toBeUndefined()
    })

    test("returns an error embed when the GitHub API fails", async () => {
        createIssue.mockRejectedValue(new Error("Bad credentials"))

        const { data } = await createIssueOnGithub("Crash on launch", null, fakeUser())

        expect(data.color).toBe(Colors.Red)
        expect(data.description).toContain("wasn't able to create")
    })
})

describe("searchIssuesOnGithub", () => {
    test("scopes the search to the configured repo", async () => {
        searchIssues.mockResolvedValue({ data: { items: [], total_count: 0 } })

        await searchIssuesOnGithub("crash")

        expect(searchIssues).toHaveBeenCalledWith({
            q: `crash repo:${REPO} is:issue`,
            per_page: MAX_SEARCH_RESULTS
        })
    })

    test("lists matching issues with their state", async () => {
        searchIssues.mockResolvedValue({
            data: {
                total_count: 12,
                items: [
                    { number: 1, title: "Open one", html_url: "https://example.com/1", state: "open" },
                    { number: 2, title: "Closed one", html_url: "https://example.com/2", state: "closed" }
                ]
            }
        })

        const { data } = await searchIssuesOnGithub("crash")

        expect(data.color).toBe(Colors.Blurple)
        expect(data.title).toBe('Issues matching "crash"')
        expect(data.description).toBe(
            "🟢 [#1: Open one](https://example.com/1)\n🟣 [#2: Closed one](https://example.com/2)"
        )
        expect(data.footer?.text).toBe(`Showing 2 of 12 results on ${REPO}`)
    })

    test("uses singular wording for a single result", async () => {
        searchIssues.mockResolvedValue({
            data: {
                total_count: 1,
                items: [{ number: 1, title: "Only one", html_url: "https://example.com/1", state: "open" }]
            }
        })

        const { data } = await searchIssuesOnGithub("crash")

        expect(data.footer?.text).toBe(`Showing 1 of 1 result on ${REPO}`)
    })

    test("says so when nothing matches", async () => {
        searchIssues.mockResolvedValue({ data: { items: [], total_count: 0 } })

        const { data } = await searchIssuesOnGithub("nonexistent")

        expect(data.color).toBe(Colors.Grey)
        expect(data.description).toBe("No issues found.")
    })

    test("returns an error embed when the GitHub API fails", async () => {
        searchIssues.mockRejectedValue(new Error("Rate limited"))

        const { data } = await searchIssuesOnGithub("crash")

        expect(data.color).toBe(Colors.Red)
        expect(data.description).toContain("wasn't able to search")
    })
})
