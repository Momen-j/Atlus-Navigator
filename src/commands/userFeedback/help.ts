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
          content: `**Atlus Navigator Help**

__General Commands__
**/help**
Display this help message

**/feedback**
Submit feedback or report issues

__Game Commands__
**/metaphor**
Display a weakness chart for a monster within Metaphor: ReFantazio

**/p3r**
Display a weakness chart for a monster/persona within Persona 3 Reload (not including Aigis)

**/p3r-aigis**
Display a weakness chart for a monster/persona within Persona 3 Reload: Episode Aigis

**/p4g**
Display a weakness chart for a monster/persona within Persona 4 Golden

**/p5g**
Display a weakness chart for a monster/persona within Persona 5 Royal`,
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