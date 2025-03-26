import { Client, Guild, TextChannel } from "discord.js";
import handleAutocomplete from "../events/interactionCreate/handleAutocomplete.js";
import handleCommands from "../events/interactionCreate/handleCommands.js";
import { registerCommands } from "../events/ready/01registerCommands.js";
import { consoleLog } from "../events/ready/consoleLog.js";

/**
 * @module eventHandler
 */

/**
 * Function listens for specific events and handles them appropriately.  <br>
 * Allows for automation of running event functions everytime the bot comes online.
 *
 * @param {Client} client Represents the instance of the Atlus Discord Bot. Listens on events and is used as a param for the current event function
 * @returns {void} Returns nothing but calls an event function.
 */
export function eventHandler(client: Client) {
  // Cache to track which guilds have already had commands registered
  const registeredGuilds = new Set<string>();

  // ✅ Ready event (triggers when the bot starts)
  client.once("ready", async () => {
    consoleLog(client); // Log bot startup details

    try {
      console.log("🚀 Bot is online. Beginning command registration...");

      // Process guilds in parallel for faster startup
      const guilds = Array.from(client.guilds.cache.values());
      
      // Register commands only for guilds not yet registered
      const pendingRegistrations = guilds
        .filter(guild => !registeredGuilds.has(guild.id))
        .map(async (guild) => {
          await registerCommands(client, guild.id);
          registeredGuilds.add(guild.id);
          console.log(`✅ Commands registered for "${guild.name}"`);
        });

      await Promise.all(pendingRegistrations);
      
      console.log(`✅ Commands registered for ${pendingRegistrations.length} guilds.`);
    } catch (error) {
      console.error("❌ Error during command registration: ", error);
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

      // Only register commands if we haven't already
      if (!registeredGuilds.has(guild.id)) {
        await registerCommands(client, guild.id);
        registeredGuilds.add(guild.id);
        console.log(`✅ Commands registered for new guild: ${guild.name}`);
      }

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
          `👋 **Hello ${guild.name}!**\nThanks for adding Atlus Navigator! It's here to assist you in tackling Persona & Metaphor enemies with the knowledge to impress all of your social links & confidants!\n\nIf you like Atlus Navigator, consider rating it on https://discordbotlist.com/ & https://top.gg/`
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

  // GuildDelete event (when bot is deleted from a server)
  client.on("guildDelete", (guild: Guild) => {
    // Remove the guild from our tracking set when the bot is removed
    registeredGuilds.delete(guild.id);
    console.log(`🚫 Removed from guild: ${guild.name}`);
  });
}
