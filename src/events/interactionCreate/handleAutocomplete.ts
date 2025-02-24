import { Client, AutocompleteInteraction } from "discord.js";
import { fetchMonsterNames } from "../../queries/fetchMonsterNames.js";
import { AtlusGame } from "../../enums.js";


export default async function handleAutocomplete(
  client: Client,
  interaction: AutocompleteInteraction
) {
  // Get the user's current input
  const focusedOption = interaction.options.getFocused();

  let allMonsters;

  if (interaction.commandName === AtlusGame.Metaphor) {
    // Fetch all monster objects from the database
    allMonsters = await fetchMonsterNames(AtlusGame.Metaphor); // Returns an array of objects
  }

  if (interaction.commandName === AtlusGame.Persona3ReloadAigis) {
    // Fetch all monster objects from the database
    allMonsters = await fetchMonsterNames(AtlusGame.Persona3ReloadAigis); // Returns an array of objects
  }

  if (interaction.commandName === AtlusGame.Persona3Reload) {
    // Fetch all monster objects from the database
    allMonsters = await fetchMonsterNames(AtlusGame.Persona3Reload); // Returns an array of objects
  }

  if (interaction.commandName === AtlusGame.Persona4Golden) {
    // Fetch all monster objects from the database
    allMonsters = await fetchMonsterNames(AtlusGame.Persona4Golden); // Returns an array of objects
  }

  if (interaction.commandName === AtlusGame.Persona5Royal) {
    // Fetch all monster objects from the database
    allMonsters = await fetchMonsterNames(AtlusGame.Persona5Royal); // Returns an array of objects
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
