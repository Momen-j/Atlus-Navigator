import { Client, ApplicationCommandOptionType } from "discord.js";
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

// Keep track of command signatures to avoid unnecessary updates
const commandSignatures = new Map<string, string>();

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
    const applicationCommands = await getApplicationCommands(client, guildId);
    const existingCommandMap = new Map();
    applicationCommands.cache.forEach((cmd) => {
      existingCommandMap.set(cmd.name, cmd);
    });

    // Track which commands need updating
    const commandsToUpdate = [];
    const commandsToCreate = [];
    const commandsToDelete = [];

    // Process all local commands
    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;
      const existingCommand = existingCommandMap.get(name);

      // Generate a signature for this command's current state
      const currentSignature = JSON.stringify({ name, description, options });
      const previousSignature = commandSignatures.get(name);

      // Skip if this exact command has been processed before and hasn't changed
      if (previousSignature === currentSignature && existingCommand) {
        continue;
      }

      // Update command signature cache
      commandSignatures.set(name, currentSignature);

      // Check if any option has autocomplete enabled
      const hasAutocomplete = localCommand.options?.some(
        (option) => option.autocomplete === true
      );

      if (existingCommand) {
        // Handle deletion if marked as deleted
        if (localCommand.deleted) {
          commandsToDelete.push(existingCommand.id);
          continue;
        }

        // Check if command needs updating
        if (areChoicesDifferent(existingCommand, localCommand)) {
          const commandOptions = hasAutocomplete
            ? [
                {
                  name: "monster-name",
                  description: "Name of monster",
                  type: ApplicationCommandOptionType.String,
                  required: true,
                  autocomplete: true,
                },
              ]
            : [
                {
                  name: "message",
                  description:
                    "Submit feedback, suggestions, or report issues.",
                  type: ApplicationCommandOptionType.String,
                  required: true,
                },
              ];

          commandsToUpdate.push({
            id: existingCommand.id,
            data: { description, options: commandOptions },
          });
        }
      } else {
        // Skip deleted commands
        if (localCommand.deleted) {
          continue;
        }

        // Prepare command creation data
        const commandOptions = hasAutocomplete
          ? [
              {
                name: "monster-name",
                description: "Name of monster",
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

        commandsToCreate.push({
          name,
          description,
          options: commandOptions,
        });
      }
    }

    // Execute the batch operations
    if (commandsToDelete.length > 0) {
      await Promise.all(
        commandsToDelete.map((id) => applicationCommands.delete(id))
      );
      console.log(`👺 Deleted ${commandsToDelete.length} commands`);
    }

    if (commandsToUpdate.length > 0) {
      await Promise.all(
        commandsToUpdate.map((cmd) =>
          applicationCommands.edit(cmd.id, cmd.data)
        )
      );
      console.log(`🔄 Edited ${commandsToUpdate.length} commands`);
    }

    if (commandsToCreate.length > 0) {
      await Promise.all(
        commandsToCreate.map((cmd) => applicationCommands.create(cmd))
      );
      console.log(`👍 Registered ${commandsToCreate.length} new commands`);
    }

    if (
      commandsToDelete.length === 0 &&
      commandsToUpdate.length === 0 &&
      commandsToCreate.length === 0
    ) {
      console.log(`✅ All commands are up to date, no changes needed`);
    }
  } catch (error) {
    console.log(`❌ Error during command registration: ${error}`);
  }
}
