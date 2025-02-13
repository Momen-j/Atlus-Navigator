import { Client, AutocompleteInteraction } from "discord.js";
import { fetchMonsterNames } from "../../queries/fetchMonsterNames.js";

export default async function handleAutocomplete(
  client: Client,
  interaction: AutocompleteInteraction
) {
  // Get the user's current input
  const focusedOption = interaction.options.getFocused();

  let allMonsters;

  if (interaction.commandName === 'metaphor') {
    // Fetch all monster objects from the database
    allMonsters = await fetchMonsterNames('metaphor'); // Returns an array of objects
  }

  if (interaction.commandName === 'p3-aigis') {
    // Fetch all monster objects from the database
    allMonsters = await fetchMonsterNames('p3-aigis'); // Returns an array of objects
  }

  // Extract just the `monster_name` values from the objects
  const allMonsterNames = allMonsters.map((monster) => monster.name);

  // Filter names that start with the user's input (case-insensitive)
  const filteredChoices = allMonsterNames
    .filter((name) =>
      name.toLowerCase().startsWith(focusedOption.toLowerCase())
    )
    .slice(0, 25); // Limit to 25 choices (Discord API max)

  // Respond with the filtered choices
  await interaction.respond(
    filteredChoices.map((name) => ({ name, value: name }))
  );
}
