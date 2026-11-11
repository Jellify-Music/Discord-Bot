import ping from "./ping";
import gd from "./gd";
import chat from "./chat"
import { issueCommand }  from "./github"
import type { SlashCommand } from "../types/command";

const commands: SlashCommand[] = [ping, gd];

if (process.env.OPENAI_API_KEY) {
    commands.push(chat)
}

if (process.env.GITHUB_TOKEN) {
    commands.push(issueCommand)
}

export default commands;
