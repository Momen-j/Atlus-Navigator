import { Client, ApplicationCommandOptionType, Routes, Collection, ApplicationCommand } from "discord.js";
//import jsonConfig from "../../../config.json" assert { type: "json" };
import { areChoicesDifferent } from "../../utils/areCommandsDifferent.js";
import { getApplicationCommands } from "../../utils/getApplicationCommands.js";
import metaphorEmbed from "../../commands/atlusEmbeds/metaphorEmbed.js";
import p3eEmbed from "../../commands/atlusEmbeds/p3e_embed.js";
import p3Embed from "../../commands/atlusEmbeds/p3embed.js";
import p4Embed from "../../commands/atlusEmbeds/p4Embed.js";
import p5Embed from "../../commands/atlusEmbeds/p5Embed.js";
import feedback from "../../commands/userFeedback/feedback.js";
import { SlashCommand } from "src/interfaces";

/**
 * @module registerCommands
 */

// Cache of local commands to avoid re-creating on every function call
const localCommands = [
  metaphorEmbed as unknown,
  p3eEmbed as unknown,
  p3Embed as unknown,
  p4Embed as unknown,
  p5Embed as unknown,
  feedback as unknown,
] as SlashCommand[];

/**
 * Registers commands for the bot, optimized to only update when necessary.
 *
 * @async
 * @param {Client} client Bot client instance
 * @param {string} guildId Guild ID to register commands for
 * @see {@link module:eventHandler}
 */
export async function registerCommands(client: Client, guildId?: string) {
  // Check if the bot exists in any servers
  if (client.guilds.cache.size === 0) {
    console.log(
      `🤖 ${client.user.tag} is not in any servers. Skipping command registration.`
    );
    return;
  }

  try {
    console.log(`🔍 Checking existing commands ${guildId ? `for guild ${guildId}` : 'globally'}...`);
    
    // Get existing commands
    let existingCommands: Collection<string, ApplicationCommand>;
    if (guildId) {
      existingCommands = await client.application.commands.fetch({ guildId });
    } else {
      existingCommands = await client.application.commands.fetch();
    }
    
    // Check for duplicates (commands with the same name)
    const commandNames = new Set();
    const duplicateCommands = [];
    
    existingCommands.forEach(cmd => {
      if (commandNames.has(cmd.name)) {
        duplicateCommands.push(cmd.id);
      } else {
        commandNames.add(cmd.name);
      }
    });
    
    // If duplicates exist, delete them
    if (duplicateCommands.length > 0) {
      console.log(`⚠️ Found ${duplicateCommands.length} duplicate commands. Cleaning up...`);
      
      for (const cmdId of duplicateCommands) {
        if (guildId) {
          await client.application.commands.delete(cmdId, guildId);
        } else {
          await client.application.commands.delete(cmdId);
        }
      }
      
      console.log(`✅ Successfully removed ${duplicateCommands.length} duplicate commands.`);
    }
    
    // Prepare all commands to register
    const commandsToRegister = [];

    // Process all local commands
    for (const localCommand of localCommands) {
      // Skip deleted commands
      if (localCommand.deleted) {
        continue;
      }

      const { name, description } = localCommand;
      
      // Check if any option has autocomplete enabled
      const hasAutocomplete = localCommand.options?.some(
        (option) => option.autocomplete === true
      );

      // Prepare command creation data with appropriate options
      const commandOptions = hasAutocomplete
        ? [
            {
              name: "monster-name",
              description: "Name of monster/persona",
              type: ApplicationCommandOptionType.String,
              required: true,
              autocomplete: true,
            },
          ]
        : [
            {
              name: "message",
              description: "Submit feedback, suggestions, or report issues.",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ];

      commandsToRegister.push({
        name,
        description,
        options: commandOptions,
      });
    }

    if (commandsToRegister.length > 0) {
      console.log(`🔄 Registering ${commandsToRegister.length} commands...`);
      
      // Use REST API to set all commands at once (this will overwrite existing commands)
      const rest = client.rest;
      
      if (guildId) {
        // Guild-specific commands
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, guildId),
          { body: commandsToRegister }
        );
        console.log(`✅ Successfully registered ${commandsToRegister.length} commands in guild ${guildId}`);
      } else {
        // Global commands
        await rest.put(
          Routes.applicationCommands(client.user.id),
          { body: commandsToRegister }
        );
        console.log(`✅ Successfully registered ${commandsToRegister.length} global commands`);
      }
    } else {
      console.log(`⚠️ No commands to register`);
    }

  } catch (error) {
    console.log(`❌ Error during command registration:`, error);
  }
}