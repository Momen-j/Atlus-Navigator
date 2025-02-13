import { Client } from "discord.js";

/**
 * @module consoleLog
 */

/**
 * Runs when ready event is called by eventHandler. <br>
 * Function indicates that Atlus Discord Bot comes online after running.
 *
 * @param {Client} client Represents the instance of the Atlus Discord Bot.
 * @see {@link module:eventHandler}
 */

export function consoleLog(client: Client) {
  console.log(`🤖 ${client.user.tag} is online.`);
}
