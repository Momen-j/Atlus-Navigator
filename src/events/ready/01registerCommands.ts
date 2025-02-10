import { Client } from "discord.js";
import jsonConfig from "../../../config.json" assert { type: "json" };
import { areChoicesDifferent } from "../../utils/areCommandsDifferent.js";
import { getApplicationCommands } from "../../utils/getApplicationCommands.js";
import { getLocalCommands } from "../../utils/getLocalCommands.js";

/**
 * @module events
 */

/**
 *
 * @param {Client} client Represents the instance of the Atlus Discord Bot.
 */
export default async function (client: Client) {
  const { testServer } = jsonConfig;
  // compare the local commands which our bot controls and creates against the commands within the guild/server
  try {
    const localCommands = await getLocalCommands();
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
          await applicationCommands.edit(existingCommand.id, {
            description,
            ...options,
          });

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
