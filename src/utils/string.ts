
/**
 * Truncates the given text to the specified maximum length, adding an ellipsis if necessary.
 * @param text The text to truncate
 * @param maxLength The maximum allowed length of the text
 * @returns The truncated text if it exceeds the maximum length, otherwise the original text
 */
export function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text
}
