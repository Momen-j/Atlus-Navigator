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
          content: "```md\n# Atlus Navigator Help\n\n## General Commands\n- /help - Display this help message\n- /feedback - Submit feedback or report issues\n\n## Game Commands\n- /metaphor - Display a weakness chart for a monster/persona within Metaphor: ReFantazio\n- /p3r - Display a weakness chart for a monster/persona within Persona 3 Reload (not including Aegis)\n- /p3e - Display a weakness chart for a monster/persona within Persona 3 Reload: Episode Aegis\n- /p4g - Display a weakness chart for a monster/persona within Persona 4 Golden\n- /p5g - Display a weakness chart for a monster/persona within Persona 5 Royal\n```",
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