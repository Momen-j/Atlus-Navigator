import {
  ApplicationCommandManager,
  Guild,
  GuildApplicationCommandManager,
} from "discord.js";

/**
 * Function check if guildId exists. <br>
 * If so, retrieve the commands within that server. <br>
 * If not, retrieve commands from Discord itself.
 *
 * @async
 * @param client Represents the Atlus Discord Bot.
 * @param guildId Represents the server that the Atlus Discord Bot (client) is added to.
 * @returns {Promise<ApplicationCommandManager>} Returns a collection of commands
 */
export async function getApplicationCommands(
  client,
  guildId
): Promise<ApplicationCommandManager | GuildApplicationCommandManager> {
  let applicationCommands;

  // check if guildId exists, if so get the commands inside the specific guild
  if (guildId) {
    const guild: Guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands as GuildApplicationCommandManager;
  } else {
    // if it doesn't exist, get the commands within Discord in its entirety
    applicationCommands = (await client.application
      .commands) as ApplicationCommandManager;
  }

  // fetch commands at once
  await applicationCommands.fetch();
  return applicationCommands;
}