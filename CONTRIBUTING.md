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

## Running Tests

Tests use Bun's built-in test runner (`bun:test`) and live next to the code they cover as `*.test.ts` files.

```sh
bun test           # run all tests
bun test --watch   # re-run on changes
```

- Use `fakeInteraction()` and `fakeUser()` from `src/test/discord.ts` to call a command's `execute` without connecting to Discord.
- Mock external APIs (GitHub, OpenAI, etc.) so tests never make network calls. See `src/commands/github/issue.test.ts`.
- Bun runs every test file in a single process, and `mock.module()` mocks can't be undone. Only use `mock.module()` for third-party packages. For the project's own modules, use `spyOn()` and call `mockRestore()` afterwards so the mock doesn't leak into other test files.

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
