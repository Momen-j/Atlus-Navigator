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
  // Keep track of whether global commands have been registered
  let globalCommandsRegistered = false;

  // ✅ Ready event (triggers when the bot starts)
  client.once("ready", async () => {
    consoleLog(client); // Log bot startup details

    try {
      console.log("🚀 Bot is online. Beginning command registration...");

       // Register commands globally ONCE
       if (!globalCommandsRegistered) {
        await registerCommands(client); // No guildId means global registration
        globalCommandsRegistered = true;
        console.log("✅ Commands registered globally");
      }
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
  
      // Find the first text channel where the bot has permission to send messages
      const welcomeChannel = guild.channels.cache
        .filter(channel => 
          channel.type === 0 && // Text channel
          channel.permissionsFor(guild.members.me!)?.has(["SendMessages", "ViewChannel"])
        )
        .first() as TextChannel | undefined;
  
      if (welcomeChannel) {
        try {
          await welcomeChannel.send(
            `👋 **Hello ${guild.name}!**\nThanks for adding Atlus Navigator! It's here to assist you in tackling Persona & Metaphor enemies with the knowledge to impress all of your social links & confidants!\n\nIf you like Atlus Navigator, consider rating it on [discordbotlist.com](https://discordbotlist.com/bots/atlus-navigator) & [top.gg](https://top.gg/bot/1328884093777350696) 😉`
          );
          console.log(`✅ Welcome message sent to ${guild.name} in #${welcomeChannel.name}`);
        } catch (messageError) {
          // Handle specific permission errors or rate limits
          console.warn(`⚠️ Could not send welcome message in ${guild.name} (${welcomeChannel.name}):`, messageError);
        }
      } else {
        // No suitable channel found with proper permissions
        console.log(`ℹ️ No suitable channel found to send welcome message in ${guild.name}`);
      }
    } catch (error) {
      console.error(`❌ Error in guildCreate event for ${guild.name}:`, error);
    }
  });

  // GuildDelete event (when bot is deleted from a server)
  client.on("guildDelete", (guild: Guild) => {
    console.log(`🚫 Removed from guild: ${guild.name}`);
  });
}
