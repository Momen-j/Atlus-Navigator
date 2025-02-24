import { Client, ApplicationCommandOptionType } from "discord.js";
import jsonConfig from "../../../config.json" assert { type: "json" };
import { areChoicesDifferent } from "../../utils/areCommandsDifferent.js";
import { getApplicationCommands } from "../../utils/getApplicationCommands.js";
//import { getLocalCommands } from "../../utils/getLocalCommands.js";
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

/**
 * Runs when ready event is called by eventHandler. <br>
 * Function checks between local & existing (Discord/Server) commands to determine whether to update Atlus Discord Bot commands. <br>
 * If no commands need to be updated, then a new command is created.
 *
 * @async
 * @param {Client} client Represents the instance of the Atlus Discord Bot.
 * @see {@link module:eventHandler}
 */
export async function registerCommands(client: Client) {
  const { testServer } = jsonConfig;
  // compare the local commands which our bot controls and creates against the commands within the guild/server
  try {
    // tells the language server the commands within the array are slash commands
    const localCommands = [metaphorEmbed as unknown, p3eEmbed as unknown, p3Embed as unknown, p4Embed as unknown, p5Embed as unknown, feedback as unknown] as SlashCommand[];
    //const localCommands = await getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );

    // loop thru all local commands, compare them to applications commands, & check for differences
    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find((cmd) => {
        // check is application command name is equal to our local command name
        return cmd.name === name;
      });

      // Check if any option has autocomplete enabled
    const hasAutocomplete = localCommand.options?.some((option) => option.autocomplete === true);


      // if existingCommand is truthy/has value AKA local command exists within applicationCommands
      if (existingCommand) {
        // check if deleted key has been marked as true.
        if (localCommand.deleted) {
          // if so: delete command and log it
          await applicationCommands.delete(existingCommand.id);
          console.log(`👺 Deleted command ${name}`);
          continue;
        }

        // if commands aren't different, take the existing command and update it to match the localCommand version
        if (areChoicesDifferent(existingCommand, localCommand)) {
          // if the local command has autocomplete (is an embed)
          if (hasAutocomplete) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options: [
                {
                  name: "monster-name",
                  description: "Name of monster",
                  type: ApplicationCommandOptionType.String,
                  required: true,
                  autocomplete: true,
                },
              ],
            });
          } else {
            // else if the local command doesn't have autocomplete (not an embed) and is a feedback command for now
            await applicationCommands.edit(existingCommand.id, {
              description,
              options: [
                {
                  name: "description",
                  description: "Provide your feedback",
                  type: ApplicationCommandOptionType.String,
                  required: true, // This makes the description field required
                },
              ],
            });
          }

          console.log(`🔄 Edited Command: ${name}`);
        }
      } else {
        // if localCommand is marked as deleted then skip it
        if (localCommand.deleted) {
          console.log(
            `Skipping registering command "${name}" as it is set to delete.`
          );
          continue;
        }

        // code below only runs if command doesn't exist & isn't set to be deleted
        // sets the name, description, & option to the ones object destructured at the beginning of the for loop
        // when we first grabbed the localCommand
        await applicationCommands.create({
          name,
          description,
          ...options,
        });

        console.log(`👍 Registed command "${name}"`);
      }
    }
  } catch (error) {
    console.log(`There was an error ${error}`);
  }
}
