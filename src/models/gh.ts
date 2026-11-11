
/**
 * Represents a GitHub issue retrieved from the GitHub API.
 */
export interface GithubIssue {
    number: number
    title: string
    html_url: string
    state: string
    created_at: string
}
