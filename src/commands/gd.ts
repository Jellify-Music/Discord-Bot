import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { SlashCommand } from "../types/command";
import InternetArchive from "internetarchive-sdk-js";

// Helper to fetch a random Grateful Dead show from archive.org for today's date
async function fetchGDShow(): Promise<string> {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const ia = new InternetArchive();
  let allDocs: any[] = [];
  // Loop through all years of the Grateful Dead (1965-1995)
  for (let year = 1965; year <= 1995; year++) {
    try {
      const items = await ia.getItems({
        filters: {
          collection: "etree",
          creator: "Grateful Dead",
          year: String(year),
          month,
          day
        },
        options: {
          rows: 100,
          fields: "identifier,date",
        }
      });
      if (items?.response?.docs && Array.isArray(items.response.docs)) {
        allDocs.push(...items.response.docs);
      }
    } catch (e) {
      // Ignore errors for years with no shows
    }
  }
  if (!allDocs.length) return `No Grateful Dead shows found for today (${month}-${day}) in any year.`;
  // Pick a random show from the list
  const show = allDocs[Math.floor(Math.random() * allDocs.length)];
  if (show) {
    const showDate = show.date || "Unknown date";
    const identifier = show.identifier;
    const showUrl = `https://archive.org/details/${identifier}`;
    // Format date as Month Day, Year
    let formattedDate = showDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(showDate)) {
      const [y, m, d] = showDate.split("-");
      // Use UTC to avoid timezone offset
      const dateObj = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
      formattedDate = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
    }
    return `**On This Day in Grateful Dead History**\n\n**Date:** ${formattedDate}\n[Listen on Archive.org](${showUrl})`;
  } else {
    return "No Grateful Dead shows found for today.";
  }
}

const gdCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("gd-history")
    .setDescription("Fetch a random Grateful Dead show from today's date on archive.org"),
  async execute(interaction: ChatInputCommandInteraction) {
    // defer reply in case fetching takes a while
    await interaction.deferReply();
    const result = await fetchGDShow();
    if (interaction.replied) {
      // If already replied, just log error
      console.error("Interaction already replied.");
      return;
    }
    await interaction.editReply(result);
  },
};

export default gdCommand;
