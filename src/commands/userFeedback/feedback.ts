import {
  ApplicationCommandOptionType,
  Client,
  ChatInputCommandInteraction,
  MessageFlags
} from "discord.js";
import { insertFeedback } from "../../queries/insertFeedback.js";

/**
 * @module feedbackCommand
 */

//? Stores user ids and user cooldown timestamps in milliseconds (key = userId, value = timestamp in milliseconds)
const cooldowns = new Map<string, number>();

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
      name: "message",
      description: "Submit feedback, suggestions, or report issues.",
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
  callback: async (
    client: Client,
    interaction: ChatInputCommandInteraction
  ) => {
    // get userId to store
    const userId = interaction.user.id;

    // get current timestamp in milliseconds
    const now = Date.now();

    const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours = 24 * 60 * 60 * 1000

    // Check cooldown on specific user if they exist in the cooldowns map
    if (cooldowns.has(userId)) {
      const lastUsed = cooldowns.get(userId) || 0; // Get timestamp of the last time the user used the command in milliseconds or get 0
      const timeLeft = cooldownTime - (now - lastUsed); // Calculate time left

      if (timeLeft > 0) {
        return interaction.reply({
          content: `⏳ You can submit feedback again in **${(timeLeft / 1000 / 60 / 60).toFixed(1)} hours**.`,
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    // Get the feedback description from the interaction
    const description: string = interaction.options.get("message")
      .value as string;

    // Check if the description exceeds 255 characters
    if (description.length > 255) {
      return interaction.reply({
        content:
          "❌ Your feedback cannot exceed 255 characters. Please shorten it and try again.",
        flags: MessageFlags.Ephemeral,
      });
    }

    // Check if the description is 0 characters
    if (description.length === 0) {
      return interaction.reply({
        content: "You can't submit nothing as feedback silly 😝!",
        //flags: MessageFlags.Ephemeral,
      });
    }

    try {
      // Insert the feedback into the database
      await insertFeedback(description);

      // Store userId and timestamp at time of submission in milliseconds for this user into cooldowns Map
      cooldowns.set(userId, now);

      // set an scheduled function call to delete userId key from Map after cooldown time ends
      // Remove cooldown after time expires & helps to stop map from growing indefinitely
      setTimeout(() => cooldowns.delete(userId), cooldownTime);

      // Reply to the user confirming the submission
      await interaction.reply({
        content: `Your feedback 👇 **\n\n${description}** \n\nhas been submitted successfully! You can submit feedback again in the next **${(cooldownTime / 1000 / 60 / 60).toFixed(1)} hours!** If you like the bot, rate Atlus Navigator on https://discordbotlist.com/ & https://top.gg/`,
        flags: MessageFlags.Ephemeral, // This ensures the reply is only visible to the user who issued the command
      });
    } catch (error: any) {
      console.error("Error submitting feedback:", error);

      // Handle errors and respond with an error message
      await interaction.reply({
        content:
          "❌ There was an error submitting your feedback. Please try again later.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
