import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { fetchEnemyWeaknesses } from "../../queries/fetchMetaphorEnemyWeaknesses.js";
import createMetaphorWeaknessChart from "../../createmetaphorWeaknessChart.js";
import { fetchEnemyStats } from "../../queries/fetchMetaphorEnemyStats.js";
import { MetaphorEnemyStats } from "src/metaphorInterface.js";
import { MetaphorEnemyWeaknesses } from "src/metaphorInterface.js";

//! Creates slash command that returns a weakness chart image based on the monster
//! name inputted by the user
/** Represents the embed returning Metaphor: ReFantazio data */
export default {
  name: "metaphor-monster-name",
  description: "Provides info on a monster within Metaphor: ReFantazio",
  options: [
    {
      name: "monster-name",
      description: "Name of monster",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  //options: Object[],
  //deleted: Boolean,
  // permissionsRequired: Boolean,
  // botPermissions: Boolean
  callback: async (client, interaction) => {
    //! this callback function takes the monster name inputted
    //! by the user and returns the weakness chart of the monster

    // init dbResult & enemyStats
    let dbResult: MetaphorEnemyWeaknesses[];
    let enemyStats: MetaphorEnemyStats[];

    // Get the monster name from the interaction
    const monsterName = interaction.options.get("monster-name").value;

    try {
      // Fetch weaknesses and stats
      dbResult = await fetchEnemyWeaknesses(monsterName);
      enemyStats = await fetchEnemyStats(monsterName);

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
        ephemeral: true, // Ensures only the user who triggered the command sees the error
      });
    }

      // If no data is returned from the database, respond to the user
      if (dbResult.length === 0) {
        return interaction.reply({
          content:
            "❌ This monster does not exist within the world of Metaphor: ReFantazio.",
          ephemeral: true, // Sends a private message to the user
        });
      }

      // Create weakness chart (image buffer) using the database result
      const weaknessChart = await createMetaphorWeaknessChart(dbResult[0]);

      // Create an embed and set the image attachment link
      const embed = new EmbedBuilder()
        .setTitle(`**${monsterName}**`)
        .setDescription(
          `**Metaphor: ReFantazio** \n**Level:** ${enemyStats[0]?.level ?? "Unknown"}\n**HP:** ${enemyStats[0]?.hp ?? "Unknown"}`
        )
        .setColor("#908581")
        .setImage("attachment://elements.png");

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
