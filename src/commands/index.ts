import ping from "./ping";
import gd from "./gd";
import chat from "./chat"
import type { SlashCommand } from "../types/command";

const commands: SlashCommand[] = [ping, gd];

if (process.env.OPENAI_API_KEY) {
    commands.push(chat)
}

export default commands;
