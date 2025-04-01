import {
    Client,
    ChatInputCommandInteraction,
    MessageFlags
  } from "discord.js";
  
  /**
   * @module helpCommand
   */
  
  /**
   * Slash command for displaying help information.
   * @type {Object}
   * @property {string} name - The command name for the help.
   * @property {string} description - The description of the command.
   * @property {Array<Object>} options - No options needed for help command.
   * @property {Function} callback - The function handling the command execution.
   */
  export default {
    name: "help",
    description: "Displays information about available bot commands",
    options: [], // No options needed for help command
  
    /**
     *
     * @async
     * @param {Client} client Represents an instance of the Discord client.
     * @param {ChatInputCommandInteraction} interaction The interaction from the user.
     * @returns Returns a help message with command information.
     */
    callback: async (
      client: Client,
      interaction: ChatInputCommandInteraction
    ) => {
      try {
        // Reply with help information using markdown formatting
        await interaction.reply({
          content: "```md\n# Atlus Navigator Help\n\n## General Commands\n- /help - Display this help message\n- /feedback - Submit feedback or report issues\n\n## Game Commands\n- /metaphor - Get information about Metaphor\n- /p3e - Get information about Persona 3 Eternal\n- /p3 - Get information about Persona 3\n- /p4 - Get information about Persona 4\n- /p5 - Get information about Persona 5\n```",
        });
      } catch (error: any) {
        console.error("Error displaying help:", error);
  
        // Handle errors and respond with an error message
        await interaction.reply({
          content:
            "❌ There was an error displaying the help information. Please try again later.",
          flags: MessageFlags.Ephemeral,
        });
      }
    },
  };