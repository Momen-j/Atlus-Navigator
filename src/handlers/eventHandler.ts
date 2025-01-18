import path from "path";
import { getAllFiles } from "../utils/getAllFiles.js";
import { fileURLToPath } from "url";

export function eventHandler(client) {
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
    eventFiles.sort((a, b) => a - b);
    console.log(eventFiles);

    /*
        windows returns file paths with \ (special character) instead of / 
        so we need to replace \ with / then pop the last element to get
        the name of the eventName/fileName
        */
    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    //! the above code allows us to setup an event listener for the discord bot
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
