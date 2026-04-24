
import { Client, GatewayIntentBits, REST, Routes, type Interaction, Collection } from "discord.js";
import type { SlashCommand } from "./src/types/command";
import commandsArray from "./src/commands";

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID; // Optional: for guild-specific commands

if (!token) {
  throw new Error("DISCORD_TOKEN is not set in environment variables.");
}


const commands = new Collection<string, SlashCommand>();
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.commands = new Collection<string, SlashCommand>();

for (const command of commandsArray) {
  commands.set(command.data.name, command);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

// Slash command registration
async function registerCommands() {
  if (!clientId) {
    throw new Error("DISCORD_CLIENT_ID is not set in environment variables.");
  }

  if (!token) {
    throw new Error("DISCORD_TOKEN is not set in environment variables.");
  }

  const rest = new REST({ version: "10" }).setToken(token);
  
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      guildId
        ? Routes.applicationGuildCommands(clientId, guildId)
        : Routes.applicationCommands(clientId),
      { body: commands.map(command => command.data.toJSON()) }
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "There was an error executing that command!", ephemeral: true });
  }
});

registerCommands();
client.login(token);
