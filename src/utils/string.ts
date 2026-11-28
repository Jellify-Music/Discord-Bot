
/**
 * Truncates the given text to the specified maximum length, adding an ellipsis if necessary.
 * @param text The text to truncate
 * @param maxLength The maximum allowed length of the text
 * @returns The truncated text if it exceeds the maximum length, otherwise the original text
 */
export function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text
}

/**
 * Removes reasoning blocks (e.g. `<think>…</think>`) that some local model servers
 * leave inline in the completion content.
 *
 * Also handles the case where the chat template opens the `<think>` tag in the prompt,
 * so only the closing tag appears in the output, and the case where generation stopped
 * mid-thought, leaving an unclosed `<think>` tag.
 * @param text The raw completion content
 * @returns The content with any reasoning removed
 */
export function stripThinking(text: string): string {
    let result = text.replace(/<think>[\s\S]*?<\/think>/g, '')

    const orphanedClose = result.lastIndexOf('</think>')
    if (orphanedClose !== -1) result = result.slice(orphanedClose + '</think>'.length)

    const unclosedOpen = result.indexOf('<think>')
    if (unclosedOpen !== -1) result = result.slice(0, unclosedOpen)

    return result.trim()
}
