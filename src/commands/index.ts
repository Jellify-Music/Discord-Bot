import ping from "./ping";
import gd from "./gd";
import type { SlashCommand } from "../types/command";

const commands: SlashCommand[] = [ping, gd];

export default commands;
