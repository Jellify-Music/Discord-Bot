import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { SlashCommand } from "../types/command";
import InternetArchive from "internetarchive-sdk-js";

// Helper to fetch a random Grateful Dead show from archive.org for today's date
async function fetchGDShow(): Promise<string> {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const ia = new InternetArchive();
  let items;
  try {
    items = await ia.getItems({
      filters: {
        collection: "GratefulDead",
      },
      options: {
        rows: 5000,
        fields: "identifier,date",
      }
    });
  } catch (e) {
    return "Could not fetch shows from archive.org.";
  }
  if (!items?.response?.docs || !Array.isArray(items.response.docs)) {
    return "No Grateful Dead shows found (bad response).";
  }

  // Debug response structure
  console.log("Archive.org response:", JSON.stringify(items, null, 2));

  // Filter for shows matching today's MM-DD
  const docs = items.response.docs.filter((doc: any) => {
    if (!doc.date) return false;
    const parts = doc.date.split("-");
    return parts[1] === month && parts[2] === day;
  });
  if (!docs.length) return `No Grateful Dead shows found for today (${month}-${day}).`;
  // Pick a random show from the list
  const show = docs[Math.floor(Math.random() * docs.length)];

  if (show) {
    const showDate = show.date || "Unknown date";
    const identifier = show.identifier;
    const showUrl = `https://archive.org/details/${identifier}`;
    return `On this day in Grateful Dead history: (${showDate}): ${showUrl}`;
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
