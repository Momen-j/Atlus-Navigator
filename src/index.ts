import { Client, IntentsBitField, EmbedBuilder } from "discord.js";
import { eventHandler } from "./handlers/eventHandler.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * @file this is the root
 * @author Moses Joseph
 */

//? Sets up discord bot with permissions in order to perform actions based on events
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

eventHandler(client);

client.login(process.env.TOKEN);
