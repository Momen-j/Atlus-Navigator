import { ApplicationCommandOptionType, Client, ChatInputCommandInteraction } from "discord.js";
import { insertFeedback } from "../../queries/insertFeedback.js";

/**
 * @module feedbackCommand
 */

/**
 * Slash command for submitting feedback.
 * @type {Object}
 * @property {string} name - The command name for the feedback submission.
 * @property {string} description - The description of the command.
 * @property {Array<Object>} options - The available options (user types in the feedback).
 * @property {Function} callback - The function handling the command execution.
 */
export default {
  name: "feedback",
  description: "Submit feedback to the database",
  //deleted: true,
  options: [
    {
      name: "description",
      description: "Provide your feedback",
      type: ApplicationCommandOptionType.String,
      required: true, // This makes the description field required
    },
  ],

  /**
   * 
   * @async
   * @param {Client} client Represents an instance of the Discord client.
   * @param {ChatInputCommandInteraction} interaction The interaction from the user.
   * @returns Returns a response after submitting feedback.
   */
  callback: async (client: Client, interaction: ChatInputCommandInteraction) => {
    // Get the feedback description from the interaction
    const description: string = interaction.options.get("description").value as string;

    // Check if the description exceeds 255 characters
    if (description.length > 255) {
      return interaction.reply({
        content: "❌ Your feedback cannot exceed 255 characters. Please shorten it and try again.",
        ephemeral: true,
      });
    }

    try {
      // Insert the feedback into the database
      await insertFeedback(description);

      // Reply to the user confirming the submission
      await interaction.reply({
        content: `Your feedback 👇 **\n\n${description}** \n\nhas been submitted successfully!`,
        ephemeral: true, // This ensures the reply is only visible to the user who issued the command
      });
    } catch (error: any) {
      console.error("Error submitting feedback:", error);

      // Handle errors and respond with an error message
      await interaction.reply({
        content: "❌ There was an error submitting your feedback. Please try again later.",
        ephemeral: true,
      });
    }
  },
};