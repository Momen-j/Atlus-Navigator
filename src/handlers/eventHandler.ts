import path from "path";
import { getAllFiles } from "../utils/getAllFiles.js";
import { fileURLToPath } from "url";
import { Client } from "discord.js";

/**
 * @module eventHandler
 */

/**
 * Function gets all folders within events and iterates through each file importing the function from within it.  <br>
 * The bot then listens for the specific event and once it occurs, the bot calls the imported functions from the folder corresponding to the occuring event. <br>
 * Allows for automation of running event functions everytime the bot comes online.
 *
 * @param {Client} client Represents the instance of the Atlus Discord Bot. Listens on events and is used as a param for the current event function
 * @returns {void} Returns nothing but calls an event function.
 */
export function eventHandler(client: Client) {
  // change URL of current module file to a path
  const __filename = fileURLToPath(import.meta.url);

  // Extracts the directory path from the file path
  const __dirname = path.dirname(__filename);

  // get all folders inside of the events directory
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  // loop thru eventFolders and get all files and execute the functions within them
  for (const eventFolder of eventFolders) {
    // returns an array of file(s) inside of the current events folder
    const eventFiles = getAllFiles(eventFolder);

    // sort eventFiles so certain files' functions run first
    eventFiles.sort((a, b) => a.localeCompare(b));

    /*
        windows returns file paths with \ (special character) instead of / 
        so we need to replace \ with / then pop the last element to get
        the name of the eventName/fileName
        */
    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    //! the above code allows us to setup an event listener for the discord bot

    /**
     * Atlus Discord Bot (Client) listens on a specific event name and runs the appropriate function from the event folder with the same name.
     */
    client.on(eventName, async (arg) => {
      // loop thru each file within eventFiles, extract the function, then run the function inside of the file
      for (const eventFile of eventFiles) {
        // Resolves the event file path
        const filePath = path.resolve(eventFile);

        // Convert backslashes to forward slashes and add file://
        const fileURL = "file://" + filePath.replace(/\\/g, "/");

        // get function from file
        const { default: eventFunction } = await import(fileURL);
        //console.log(typeof eventFunction);

        // call function
        await eventFunction(client, arg);
      }
    });
  }
}
