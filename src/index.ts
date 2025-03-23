import { Client, IntentsBitField } from "discord.js";
import { eventHandler } from "./handlers/eventHandler.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * @file <strong>Atlus Navigator Codebase Documentation</strong>
 * 
 * <br><br> <strong>Atlus Navigator</strong> is a TypeScript-powered Discord bot designed to help users discover enemy and Persona weaknesses in Atlus games.  
 * To better understand the codebase, please refer to this documentation.  
 * 
 * <br><br> For a full overview of Atlus Navigator's features, visit the {@link https://github.com/Momen-j/Atlus-Navigator Atlus Navigator README}!
 * 
 * @author Moses Joseph
 */

// Sets up discord bot with permissions in order to perform actions based on events
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// handles all events using the instance of the Atlus Discord Bot
eventHandler(client);

// Bot logs in using the bot token
client.login(process.env.DISCORD_BOT_TOKEN);
