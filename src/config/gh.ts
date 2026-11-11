
// The repository that issues are searched in and created on
export const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER || "Jellify-Music"
export const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME || "App"

// Optional: only members with this role can create issues. Read on each call so it can be changed in tests
export const getIssueCreatorRoleId = () => process.env.GITHUB_ISSUE_CREATOR_ROLE_ID || undefined
