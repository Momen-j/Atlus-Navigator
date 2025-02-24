import { ChatInputCommandInteraction, Client } from "discord.js";
import jsonConfig from "../../../config.json" assert { type: "json" };
//import { getLocalCommands } from "../../utils/getLocalCommands.js";
import metaphorEmbed from "../../commands/atlusEmbeds/metaphorEmbed.js";
import p3eEmbed from "../../commands/atlusEmbeds/p3e_embed.js";
import p3Embed from "../../commands/atlusEmbeds/p3embed.js";
import p4Embed from "../../commands/atlusEmbeds/p4Embed.js";
import p5Embed from "../../commands/atlusEmbeds/p5Embed.js";
import feedback from "../../commands/userFeedback/feedback.js";
import { SlashCommand } from "src/interfaces";

/**
 * @module handleCommands
 */

/**
 * Function that handles each command object & checks a couple of conditions to ensure that the <br>
 * command object callback function can be called properly.
 *
 * @async
 * @param {Client} client Represents an instance of the Atlus Discord Bot.
 * @param {ChatInputCommandInteraction} interaction Current instance of the chat input command inputted by user.
 * @returns {Promise<void>} Returns nothing but calls a callback function if all checks pass.
 */
export default async function (
  client: Client,
  interaction: ChatInputCommandInteraction
): Promise<void> {
  // if not a slash command, end function call
  //if (!interaction.isChatInputCommand()) return;

  const { testServer, devs } = jsonConfig;

  // get local commands
  const localCommands = [metaphorEmbed as unknown, p3eEmbed as unknown, p3Embed as unknown, p4Embed as unknown, p5Embed as unknown, feedback as unknown] as SlashCommand[];

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
      if (
        !interaction.member ||
        !("id" in interaction.member) ||
        !devs.includes(interaction.member.id)
      ) {
        interaction.reply({
          content:
            "You don't have enough Charm for this task, only the developer does.",
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
        if (!interaction.memberPermissions.has(permission)) {
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
