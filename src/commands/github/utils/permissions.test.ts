import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { canCreateIssue } from "./permissions";
import { fakeInteraction } from "../../../test/discord";

const roleId = "123456789"

afterEach(() => {
    delete process.env.GITHUB_ISSUE_CREATOR_ROLE_ID
})

describe("canCreateIssue", () => {
    describe("without a creator role configured", () => {
        test("allows guild members", () => {
            expect(canCreateIssue(fakeInteraction({ member: { roles: [] } }))).toBe(true)
        })

        test("allows users outside a guild", () => {
            expect(canCreateIssue(fakeInteraction({ member: null }))).toBe(true)
        })

        test("treats an empty role ID as unset", () => {
            process.env.GITHUB_ISSUE_CREATOR_ROLE_ID = ""

            expect(canCreateIssue(fakeInteraction({ member: null }))).toBe(true)
        })
    })

    describe("with a creator role configured", () => {
        beforeEach(() => {
            process.env.GITHUB_ISSUE_CREATOR_ROLE_ID = roleId
        })

        test("rejects users outside a guild", () => {
            expect(canCreateIssue(fakeInteraction({ member: null }))).toBe(false)
        })

        describe("for raw API members", () => {
            test("allows members with the role", () => {
                const interaction = fakeInteraction({ member: { roles: ["111", roleId] } })

                expect(canCreateIssue(interaction)).toBe(true)
            })

            test("rejects members without the role", () => {
                const interaction = fakeInteraction({ member: { roles: ["111", "222"] } })

                expect(canCreateIssue(interaction)).toBe(false)
            })

            test("rejects members with no roles", () => {
                expect(canCreateIssue(fakeInteraction({ member: { roles: [] } }))).toBe(false)
            })
        })

        describe("for cached guild members", () => {
            test("allows members with the role", () => {
                const interaction = fakeInteraction({ member: { roles: { cache: new Map([[roleId, {}]]) } } })

                expect(canCreateIssue(interaction)).toBe(true)
            })

            test("rejects members without the role", () => {
                const interaction = fakeInteraction({ member: { roles: { cache: new Map([["111", {}]]) } } })

                expect(canCreateIssue(interaction)).toBe(false)
            })
        })
    })
})
