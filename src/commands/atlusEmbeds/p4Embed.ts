import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import {
  fetchP4EnemyWeaknesses,
} from "../../queries/fetchp4EnemyWeaknesses.js";
import createP4WeaknessChart from "../../createP4WeaknessChart.js";
import { fetchP4EnemyStats } from "../../queries/fetchp4EnemyStats.js";



//! Creates slash command that returns a weakness chart image based on the monster
//! name inputted by the user
export default {
  name: "p4-monster-name",
  description: "Provides info on a monster within Persona 4 Golden",
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

    const dbResult = await fetchP4EnemyWeaknesses(monsterName);

    const enemyStats = await fetchP4EnemyStats(monsterName);

    console.log(enemyStats);

    // if nothing is returned byu query to DB then respond to user
    if (dbResult.length === 0) {
      interaction.reply({
        content:
          "This shadow does not exist within the world of Persona 4 Golden",
      });
    }

    // create weakness chart (aka Image Buffer) for monster using data from dbResult
    const weaknessChart = await createP4WeaknessChart(dbResult[0]);

    // Create an embed and set the image attachment link
    const embed = new EmbedBuilder()
      .setTitle(`**${monsterName}**`)
      .setDescription(
        `**Persona 4 Golden** \n**Level:** ${enemyStats[0].level}\n**HP:** ${enemyStats[0].hp}\n**Located:** ${enemyStats[0].appears}`
      )
      .setColor("Yellow")
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
