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
  // ✅ Ready event (triggers when the bot starts)
  client.once("ready", async () => {
    consoleLog(client); // Log bot startup details

    try {
      console.log("🚀 Bot is online. Cleaning up old commands...");

      // Clear GLOBAL commands
      const globalCommands = await client.application?.commands.fetch();
      if (globalCommands) {
        for (const command of globalCommands.values()) {
          await client.application?.commands.delete(command.id);
          //console.log(`🗑️ Deleted global command: ${command.name}`);
        }
      }

      // Clear GUILD commands
      for (const guild of client.guilds.cache.values()) {
        const guildCommands = await guild.commands.fetch();
        for (const command of guildCommands.values()) {
          await guild.commands.delete(command.id);
          //console.log(`🗑️ Deleted command in "${guild.name}": ${command.name}`);
        }

        // ✅ Register new commands for each guild
        await registerCommands(client, guild.id);
      }

      console.log("✅ Commands cleaned and re-registered.");
    } catch (error) {
      console.error("❌ Error during command cleanup: ", error);
    }
  });

  // ✅ Interaction Create event (handles slash commands and autocomplete)
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isAutocomplete()) {
      await handleAutocomplete(client, interaction); // Handle autocomplete
    } else if (interaction.isChatInputCommand()) {
      await handleCommands(client, interaction); // Handle slash commands
    }
  });

  // ✅ Guild Create event (when the bot joins a new guild)
  client.on("guildCreate", async (guild: Guild) => {
    try {
      console.log(`📥 Joined a new guild: ${guild.name}`);

      // Clear old commands for the newly joined guild
      const guildCommands = await guild.commands.fetch();
      for (const command of guildCommands.values()) {
        await guild.commands.delete(command.id);
        //console.log(`🗑️ Deleted old command in new guild: ${command.name}`);
      }

      // ✅ Register new commands for this specific guild
      await registerCommands(client, guild.id);

      // ✅ Send a welcome message if the bot has permissions
      const welcomeChannel = guild.channels.cache.find(
        (channel) =>
          channel.type === 0 &&
          (channel as TextChannel)
            .permissionsFor(guild.members.me!)
            ?.has("SendMessages")
      ) as TextChannel;

      if (welcomeChannel) {
        await welcomeChannel.send(
          `👋 **Hello ${guild.name}!**\nThanks for adding Atlus Bot! It's here to assist you in tackling Persona & Metaphor enemies with the knowledge to impress all of your social links & confidants!\n\nGive Atlus Bot a rating on https://discordbotlist.com/ & https://top.gg/`
        );
        console.log(`✅ Welcome message sent to ${guild.name}`);
      } else {
        console.warn(
          `⚠️ No valid channel found to send welcome message in ${guild.name}.`
        );
      }
    } catch (error) {
      console.error(`❌ Error in guildCreate event for ${guild.name}:`, error);
    }
  });
}
