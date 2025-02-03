import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import {
  fetchEnemyWeaknesses,
} from "../../queries/fetchMetaphorEnemyWeaknesses.js";
import createWeaknessChart from "../../createWeaknessChart.js";
import { fetchEnemyStats } from "../../queries/fetchMetaphorEnemyStats.js";

//! Creates slash command that returns a weakness chart image based on the monster
//! name inputted by the user
export default {
  name: "metaphor-monster-name",
  description: "Provides info on a monster within Methaphor Refantazio",
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

    // get the monster name from the interaction
    const monsterName = interaction.options.get("monster-name").value;

    const dbResult = await fetchEnemyWeaknesses(monsterName);

    const enemyStats = await fetchEnemyStats(monsterName);

    console.log(enemyStats);

    // if nothing is returned byu query to DB then respond to user
    if (dbResult.length === 0) {
      interaction.reply({
        content:
          "This monster does not exist within the world of Metaphor Refantazio",
      });
    }

    // create weakness chart (aka Image Buffer) for monster using data from dbResult
    const weaknessChart = await createWeaknessChart(dbResult[0]);

    // Create an embed and set the image attachment link
    const embed = new EmbedBuilder()
      .setTitle(`**${monsterName}**`)
      .setDescription(
        `**Level:** ${enemyStats[0].level} **HP:** ${enemyStats[0].hp}`
      )
      .setColor("Blue")
      .setImage("attachment://elements.png");

    // Send the embed with the weaknessChart as an attachment
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
