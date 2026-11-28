
export const CHAT__SYSTEM_PROMPT = `
When responding, you should use markdown formatting where appropriate. For example, you can use **bold** for emphasis, *italics* for emphasis, and \`inline code\` for code snippets. You can also use triple backticks for multi-line code blocks.
You should always respond in a way that is appropriate for a Discord chat. This means you should keep your responses concise and to the point, and avoid long paragraphs of text. You should also avoid using overly formal language, and instead aim for a friendly and conversational tone.
If you are unsure how to respond to a message, it's okay to ask for clarification or more information. You can also use emojis to add personality and express emotions in your responses.
`

/** 
 * The maximum length of a message that Discord will accept.
 * 
 * Discord rejects messages longer than this 
 * */
export const DISCORD_MAX_MESSAGE_LENGTH = 2000

/** 
 * The timeout for chat requests in milliseconds.
 * 
 * Discord interaction tokens expire after 15 minutes, so stay well under that 
 */
export const CHAT_REQUEST_TIMEOUT_MS = 2 * 60 * 1000

/**
 * Sent when the model returns no content (e.g. the response was only reasoning).
 *
 * Request errors are reported by the command error handler instead.
 */
export const FALLBACK_RESPONSE = "Sorry! I got tongue-tied and couldn't figure out what to say!"
