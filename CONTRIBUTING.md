# Contributing to Discord-Bot

Thank you for your interest in contributing! This project welcomes PRs, issues, and suggestions.

## How to Add a New Slash Command

1. **Create a new command file:**
   - Add a new file in `src/commands/`, e.g. `src/commands/yourcommand.ts`.
   - Export a default object that implements the `SlashCommand` type:

```ts
import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { SlashCommand } from "../types/command";

const yourCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("yourcommand")
    .setDescription("Describe what your command does!"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Your command response!");
  },
};

export default yourCommand;
```

2. **Export your command in the command index:**
   - Open `src/commands/index.ts` and import your new command:

```ts
import yourCommand from "./yourcommand";
// ...existing imports

const commands: SlashCommand[] = [
  // ...existing commands
  yourCommand,
];

export default commands;
```

3. **Restart the bot:**
   - Run `bun start` to reload the bot and register your new command.

4. **Test your command in Discord!**

## Coding Style
- Use TypeScript and follow the patterns in existing commands.
- Use the `SlashCommand` type for strong typing and autocompletion.
- Keep command logic modular and focused.

## Submitting PRs
- Fork the repo and create a feature branch.
- Open a pull request with a clear description of your changes.
- Be kind and respectful in code reviews and discussions.

## Special Thanks
- See the main README for credits and acknowledgments.

---
Happy hacking!
