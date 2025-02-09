import fs from "fs";
import path from "path";

/**
 * Function retrieves all files & folders (can excludes files) from a given directory/path.
 * 
 * @memberof UtilityFunctions
 * @param {string} directory Directory to retrieve files from.
 * @param {boolean} foldersOnly Adjusts result array to exclude or include files with directory.
 * @returns {Array<string>} Returns a list of files & folders within a certain directory (can exclude files thru foldersOnly param).
 */
export function getAllFiles(directory: string, foldersOnly:boolean = false): Array<string> {
  let fileNames = [];

  // read contents of directory and return an array of names of files and 
  // subdirectories
  const files = fs.readdirSync(directory, { withFileTypes: true });

  // loop thru every file to check if it is a folder
  for (const file of files) {
    // get filepath
    const filePath = path.join(directory, file.name);

    // if foldersOnly is true, push only the folder paths into the fileNames array
    // otherwise push file paths
    if (foldersOnly) {
      if (file.isDirectory()) {
        fileNames.push(filePath);
      }
    } else {
      if (file.isFile()) {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
}
