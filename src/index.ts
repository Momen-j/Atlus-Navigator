import { Client, IntentsBitField, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

//? Sets up discord bot with permissions in order to perform actions based on events
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

console.log(process.env.TOKEN);

client.on("ready", (c) => {
  console.log(`🤖 Atlus Bot ${c.user?.tag} is rearing and ready to go!`);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "embedder") {
    const embed = new EmbedBuilder()
      .setTitle("Embed Title")
      .setDescription("This is an embed description")
      .setColor("Random")
      .addFields({
        name: "Field title",
        value: "some random value",
        inline: true,
      }, {
        name: "2nd Field title",
        value: "some random value",
        inline: true,
      },);

    interaction.reply({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
