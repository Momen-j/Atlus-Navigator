import path from "path";
import { getAllFiles } from "./getAllFiles.js";
import { fileURLToPath } from "url";

export async function getLocalCommands(exceptions = []) {
  let localCommands = [];

  // change URL of current module file to a path
  const __filename = fileURLToPath(import.meta.url);

  // Extracts the directory path from the file path
  const __dirname = path.dirname(__filename);

  // get all folders within the commands folder
  const commandCategories = getAllFiles(
    path.join(__dirname, "..", "commands"),
    true
  );

  // loop thru each folder and grab each file
  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    // after grabbing a file
    for (const commandFile of commandFiles) {
      // Resolves the event file path
      const filePath = path.resolve(commandFile);

      // Convert backslashes to forward slashes and add file://
      const fileURL = "file://" + filePath.replace(/\\/g, "/");

      // get the command object from file
      const module = await import(fileURL);

      // command object is a default exports so need to grab this way
      const commandObject = module.default;

      if (exceptions.includes(commandObject.name)) {
        continue;
      }

      // push command object into localCommands array
      localCommands.push(commandObject);
    }
  }

  return localCommands;
}
