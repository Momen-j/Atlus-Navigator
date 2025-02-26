import { Client, Guild, TextChannel } from "discord.js";
import handleAutocomplete from "../events/interactionCreate/handleAutocomplete.js";
import handleCommands from "../events/interactionCreate/handleCommands.js";
import { registerCommands } from "../events/ready/01registerCommands.js";
import { consoleLog } from "../events/ready/consoleLog.js";

/**
 * @module eventHandler
 */

/**
 * Function listens for the specific event and once it occurs, the bot calls the imported functions from the folder corresponding to the occuring event.  <br>
 * Allows for automation of running event functions everytime the bot comes online.
 *
 * @param {Client} client Represents the instance of the Atlus Discord Bot. Listens on events and is used as a param for the current event function
 * @returns {void} Returns nothing but calls an event function.
 */
export function eventHandler(client: Client) {
  // Ready event (triggers when the bot starts)
  client.once("ready", async () => {
    await registerCommands(client); // Run this first
    consoleLog(client); // Then log bot startup details
  });

  // Interaction Create event (handles slash commands and autocomplete)
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isAutocomplete()) {
      await handleAutocomplete(client, interaction); // Handles autocomplete
    } else if (interaction.isChatInputCommand()) {
      await handleCommands(client, interaction); // Handles slash commands
    }
  });

  client.on("guildCreate", async (guild: Guild) => {
    try {
      // Find the first available text channel where the bot can send messages
      const welcomeChannel = guild.channels.cache.find(
        (channel) =>
          channel.type === 0 &&
          (channel as TextChannel)
            .permissionsFor(guild.members.me!)
            ?.has("SendMessages")
      ) as TextChannel;

      if (!welcomeChannel) {
        console.warn(
          `No valid channel found in ${guild.name} to send a welcome message.`
        );
        return;
      }

      await registerCommands(client); // Run this first before sending welcome message

      // Send the welcome message
      await welcomeChannel.send(
        `👋 **Hello, ${guild.name}!**\nThanks for adding Atlus Bot! It's here to assist you with tackling Persona & Metaphor enemies with the knowledge to impress all of your social links & confidants!\n\nGive Atlus Bot a rating on https://discordbotlist.com/ & https://top.gg/`
      );

      console.log(`✅ Welcome message sent to ${guild.name}`);
    } catch (error) {
      console.error(`Error sending welcome message in ${guild.name}:`, error);
    }
  });
}
