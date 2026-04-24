# Discord-Bot
A bot for monitoring and supporting the Jellify Discord server

## Features
- Written in TypeScript, runs on Bun
- Loads environment variables from `.env` (see `.env.example`)
- Modular slash command system (add commands in `src/commands`)
- `/ping` — Replies with Pong!
- `/gd-history` — Fetches a random Grateful Dead show from today's date on archive.org

## Setup
1. Install dependencies:
   ```sh
   bun install
   ```
2. Copy `.env.example` to `.env` and fill in your Discord credentials:
   - `DISCORD_TOKEN` (your bot token)
   - `DISCORD_CLIENT_ID` (your bot's client ID)
   - `DISCORD_GUILD_ID` (optional, for guild-specific commands)
3. Start the bot:
   ```sh
   bun start
   ```

## Adding Commands
- Add new files to `src/commands` and export them via `src/commands/index.ts`.
- Use the `SlashCommand` type for strong typing and autocompletion.

## Dependencies
- [discord.js](https://discord.js.org/)
- [internetarchive-sdk-js](https://www.npmjs.com/package/internetarchive-sdk-js)
- [bun](https://bun.sh/)

---
PRs welcome!
