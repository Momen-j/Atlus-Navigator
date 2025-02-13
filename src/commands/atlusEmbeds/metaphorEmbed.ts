import { EmbedBuilder, ApplicationCommandOptionType, Client, ChatInputCommandInteraction  } from "discord.js";
import { fetchMetaphorEnemyWeaknesses } from "../../queries/fetchMetaphorEnemyWeaknesses.js";
import createMetaphorWeaknessChart from "../../createmetaphorWeaknessChart.js";
import { fetchMetaphorEnemyStats } from "../../queries/fetchMetaphorEnemyStats.js";
import { MetaphorEnemyStats } from "src/interfaces.js";
import { MetaphorEnemyWeaknesses } from "src/interfaces.js";

/**
 * @module metaphorMonsterCommand
 */

/**
 * Slash command for fetching monster weaknesses.
 * @type {Object}
 * @property {string} name - The command name for the specific game.
 * @property {string} description - The description of the command.
 * @property {Array<Object>} options - The available options (user types in shadow/monster they are curious about).
 * @property {Function} callback - The function handling the command execution. 
 * We call query functions to the database using the option given by the user then send that data off into the weakness chart function to then reply with a weakness chart embed.
 */
export default {
  name: "metaphor-monster-name",
  description: "Provides info on a monster within Metaphor: ReFantazio",
  options: [
    {
      name: "monster-name",
      description: "Name of monster",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true
    },
  ],
  //options: Object[],
  //deleted: Boolean,
  // permissionsRequired: Boolean,
  // botPermissions: Boolean,

  /**
   * 
   * @async
   * @param {Client} client Represents an instance of the Atlus Discord Bot.
   * @param {ChatInputCommandInteraction} interaction Current instance of the chat input command inputted by user.
   * @returns Returns nothing but calls an async callback function if it passes all checks in handleCommands function.
   * @see {@link module:handleCommands}
   */
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    // init dbResult & enemyStats
    let dbResult: MetaphorEnemyWeaknesses[];
    let enemyStats: MetaphorEnemyStats[];

    // Get the monster name from the interaction
    const monsterName: string = interaction.options.get("monster-name").value as string;

    try {
      // Fetch weaknesses and stats
      dbResult = await fetchMetaphorEnemyWeaknesses(monsterName);
      enemyStats = await fetchMetaphorEnemyStats(monsterName);
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
