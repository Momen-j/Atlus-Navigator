import { Client, AutocompleteInteraction } from "discord.js";

export default async function handleAutocomplete(
  client: Client,
  interaction: AutocompleteInteraction
) {
  // Example: Provide a dynamic list of autocomplete choices
  const focusedOption = interaction.options.getFocused();
  const choices = ["Orgo", "Goborn", "Gold Elementa"];

  const filteredChoices = choices.filter((choice) =>
    choice.toLowerCase().startsWith(focusedOption.toLowerCase())
  );

  await interaction.respond(
    filteredChoices.map((choice) => ({ name: choice, value: choice }))
  );
}