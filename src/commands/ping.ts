import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/command";

const pingCommand : SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default pingCommand;
