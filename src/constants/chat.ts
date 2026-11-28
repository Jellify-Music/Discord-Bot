import OpenAI from "openai"
import { CHAT_REQUEST_TIMEOUT_MS } from "../config/chat"

export const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
    timeout: CHAT_REQUEST_TIMEOUT_MS,
    maxRetries: 0
})
