import jsonConfig from "../../../config.json" assert { type: "json" };
import { getLocalCommands } from "../../utils/getLocalCommands.js";

export default async function (client, interaction) {
  // if not a slash command, end function call
  if (!interaction.isChatInputCommand()) return;

  const { testServer, devs } = jsonConfig;

  // get local commands
  const localCommands = await getLocalCommands();

  // try to check if the command by the user matches one of our local commands
  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    // if command object doesn't exist, end function call
    // otherwise
    if (!commandObject) return;

    // if the command's devOnly value is true, check if the user who typed command is a dev
    // if not, return a stern message
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: "Only devs can run this command",
          ephemeral: true,
        });
        return;
      }
    }

    // if the command's testOnly value is true, check if the interaction's server matches the test server
    // if not, return a stern message
    //! Very good when I need to add new features to the discord bot
    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: "You don't have enough Courage for this task.",
          ephemeral: true,
        });
        return;
      }
    }

    // check if the person running the command has the appropriate permissions
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          // if not, reply to interaction
          interaction.reply({
            content: "Not enough permissions",
            ephemeral: true,
          });
          break;
        }
      }
    }

    // check if bot running the command has the appropriate permissions
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        // if not, reply to interaction
        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "Not enough permissions",
            ephemeral: true,
          });
          break;
        }
      }
    }

    // if all checks pass then call command callback function
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
}
