import {
  EmbedBuilder,
  ApplicationCommandOptionType,
  Client,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { fetchP5EnemyWeaknesses } from "../../queries/fetchp5EnemyWeaknesses.js";
import createP5WeaknessChart from "../../createP5WeaknessChart.js";
import { fetchP5EnemyStats } from "../../queries/fetchp5EnemyStats.js";
import { P5EnemyStats } from "src/interfaces.js";
import { P5EnemyWeaknesses } from "src/interfaces.js";

//! Creates slash command that returns a weakness chart image based on the monster
//! name inputted by the user
export default {
  name: "p5r",
  description: "Provides info on a monster/persona within Persona 5 Royal",
  options: [
    {
      name: "monster-name",
      description: "Name of monster/persona",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],
  //options: Object[],
  //deleted: true,
  // permissionsRequired: Boolean,
  // botPermissions: Boolean
  callback: async (
    client: Client,
    interaction: ChatInputCommandInteraction
  ) => {
    //! this callback function takes the monster name inputted
    //! by the user and returns the weakness chart of the monster

    // init dbResult & enemyStats
    let dbResult: P5EnemyWeaknesses[];
    let enemyStats: P5EnemyStats[];

    // Get the monster name from the interaction
    const monsterName = interaction.options.get("monster-name").value as string;

    try {
      // Fetch weaknesses and stats
      dbResult = await fetchP5EnemyWeaknesses(monsterName);
      enemyStats = await fetchP5EnemyStats(monsterName);
    } catch (error: any) {
      console.error("Error fetching enemy data:", error);

      let errorMessage =
        "❌ An unexpected error occurred. Please try again later.";

      if (error.message.includes("ECONNREFUSED")) {
        errorMessage =
          "⚠️ My connection to the database is currently down. Please try again later!";
      } else if (error.message.includes("timeout")) {
        errorMessage =
          "⏳ The database took too long to respond. Try again in a few moments.";
      }

      return interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral, // Ensures only the user who triggered the command sees the error
      });
    }

    // If no data is returned from the database, respond to the user
    if (dbResult.length === 0) {
      return interaction.reply({
        content:
          "❌ This shadow does not exist within the world of Persona 5 Royal.",
        flags: MessageFlags.Ephemeral, // Sends a private message to the user
      });
    }

    // Create weakness chart (image buffer) using the database result
    const weaknessChart = await createP5WeaknessChart(dbResult[0]);

    // Create an embed and set the image attachment link
    let embed;

    if (Number(enemyStats[0].hp) === 0) {
      embed = new EmbedBuilder()
      .setTitle(`**${monsterName}**`)
      .setDescription(
        `**Persona 5 Royal** \n**Level:** ${enemyStats[0]?.level ?? "Unknown"}\n**Arcana:** ${enemyStats[0]?.race ?? "Unknown"}`
      )
      .setColor("Red")
      .setImage("attachment://elements.png");
    } else {
      embed = new EmbedBuilder()
      .setTitle(`**${monsterName}**`)
      .setDescription(
        `**Persona 5 Royal** \n**Level:** ${enemyStats[0]?.level ?? "Unknown"}\n**HP:** ${enemyStats[0]?.hp ?? "Unknown"}\n**Located:** ${enemyStats[0]?.appears ?? "Unknown"}`
      )
      .setColor("Red")
      .setImage("attachment://elements.png");
    }

    // Send the embed with the weakness chart as an attachment
    await interaction.reply({
      embeds: [embed],
      files: [
        {
          attachment: weaknessChart,
          name: "elements.png", // The image name in the embed
        },
      ],
    });
  },
};
