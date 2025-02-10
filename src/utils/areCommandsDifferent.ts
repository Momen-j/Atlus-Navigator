import { ApplicationCommand } from "discord.js";
import { SlashCommand } from "src/interfaces";

/**
 * Compares an existing command with a local command within the project to determine if they have differences.
 * 
 * @memberof UtilityFunctions
 * @param {ApplicationCommand | undefined} existingCommand The existing command fetched from Discord or Server, or undefined if not found.
 * @param {SlashCommand} localCommand The local command definition.
 * @returns {Boolean} Returns `true` if choices are different, otherwise `false`.
 */
export function areChoicesDifferent(existingCommand: ApplicationCommand | undefined, localCommand: SlashCommand): Boolean {
  const areChoicesDifferent = (existingChoices, localChoices) => {
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices?.find(
        (choice) => choice.name === localChoice.name
      );

      if (!existingChoice) {
        return true;
      }

      if (localChoice.value !== existingChoice.value) {
        return true;
      }
    }
    return false;
  };

  // Checks if options within commands are different
  const areOptionsDifferent = (existingOptions, localOptions) => {
    for (const localOption of localOptions) {
      const existingOption = existingOptions?.find(
        (option) => option.name === localOption.name
      );

      if (!existingOption) {
        return true;
      }

      if (
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type ||
        (localOption.required || false) !== existingOption.required ||
        (localOption.choices?.length || 0) !==
          (existingOption.choices?.length || 0) ||
        areChoicesDifferent(
          localOption.choices || [],
          existingOption.choices || []
        )
      ) {
        return true;
      }
    }
    return false;
  };

  // check if description is the same, or if the options' length has changed, or if the options have changed
  if (
    existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(existingCommand.options, localCommand.options || [])
  ) {
    return true;
  }

  return false;
}
