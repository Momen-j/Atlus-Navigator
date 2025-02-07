import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import {
  fetchP5EnemyWeaknesses,
} from "../../queries/fetchp5EnemyWeaknesses.js";
import createP5WeaknessChart from "../../createP5WeaknessChart.js";
import { fetchP5EnemyStats } from "../../queries/fetchp5EnemyStats.js";



//! Creates slash command that returns a weakness chart image based on the monster
//! name inputted by the user
export default {
  name: "p5-monster-name",
  description: "Provides info on a monster within Persona 5 Royal",
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

    const dbResult = await fetchP5EnemyWeaknesses(monsterName);

    const enemyStats = await fetchP5EnemyStats(monsterName);

    console.log(enemyStats);

    // if nothing is returned byu query to DB then respond to user
    if (dbResult.length === 0) {
      interaction.reply({
        content:
          "This shadow does not exist within the world of Persona 5 Royal",
      });
    }

    // create weakness chart (aka Image Buffer) for monster using data from dbResult
    const weaknessChart = await createP5WeaknessChart(dbResult[0]);

    // Create an embed and set the image attachment link
    const embed = new EmbedBuilder()
      .setTitle(`**${monsterName}**`)
      .setDescription(
        `**Persona 5 Royal** \n**Level:** ${enemyStats[0].level}\n**HP:** ${enemyStats[0].hp}\n**Located:** ${enemyStats[0].appears}`
      )
      .setColor("Red")
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
