import { Client } from "discord.js";
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
}
