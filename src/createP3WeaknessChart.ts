import { createCanvas, loadImage } from "canvas"; // Canvas package for creating images
import path from "path";
import { P3EnemyWeaknesses } from "src/interfaces.js";

/**
 * Generates a Persona 3 Reload (including Episode Aigis) weakness chart as an image buffer given a specific shadow's weakness data within an object.
 * The chart visually represents a shadow's reaction to every element within the game.
 *
 * @memberof WeaknessChartFunctions
 * @async
 * @function createP3WeaknessChart
 * @param {P3EnemyWeaknesses} data - An object mapping element names to their respective weaknesses/reactions for a specific shadow.
 * @returns {Promise<Buffer>} A Promise that resolves to an image buffer containing the generated Persona 3 Reload (including Episode Aigis) weakness chart.
 * @see {@link DatabaseQueries.exports.fetchP3EnemyWeaknesses}
 */

export default async function createP3WeaknessChart(data: P3EnemyWeaknesses): Promise<Buffer> {
  //! BREAK UP INTO HELPER FUNCTIONS FOR DIFFERENT GAMES and make game type a parameter
  // Canvas & context setup to draw on canvas
  const canvas = createCanvas(2200, 275);
  const ctx = canvas.getContext("2d");

  // Define a scaling factor
  const widthScaleFactor = 2.65; // Increase size by xx% (2.5 IS WIDTH SWEETSPOT for 2000 px length canvas)
  const heightScaleFactor = 4.5; // Increase size by xx%

  // Grid and cell properties
  const cellWidth = canvas.width / 10; // Width of each cell //! Since we want 10 columns we divide width by 10
  const iconCellHeight = heightScaleFactor * 27;
  const cellHeight = canvas.height - iconCellHeight; // Height of each cell //! Since we want 2 rows we divide height by 2
  const cols = 10; // Fixed number of columns
  const rows = 2; // Always 2 rows (top for elements, bottom for weaknesses)

  // Fill background with light blue
  ctx.fillStyle = "#0079EE";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fill top row with icon background color
  ctx.fillStyle = "#07041C";
  ctx.fillRect(0, 0, canvas.width, iconCellHeight);

  // Explicitly define paths to the elements and reactions folders
  const elementsFolder = path.resolve("./src/assets/p3_elements");
  const reactionsFolder = path.resolve("./src/assets/reactions");

  // preload weakness images into an object
  const imagePaths = {
    weak: path.join(reactionsFolder, "weak.png"),
    resist: path.join(reactionsFolder, "resist.png"),
    null: path.join(reactionsFolder, "null.png"),
    drain: path.join(reactionsFolder, "drain.png"),
    reflect: path.join(reactionsFolder, "reflect.png"),
    neutral: path.join(reactionsFolder, "neutral.png"),
  };

  // Draw elements within the top row aka the columns
  const elementKeys = Object.keys(data); // ['fire', 'ice', 'elec']

  // for every element within elementKeys
  for (let index = 0; index < elementKeys.length; index++) {
    // grab the element
    const element = elementKeys[index];

    // grab the image associated with that element
    const img = await loadImage(path.join(elementsFolder, `${element}.png`));

    // Scale the width & height
    const newWidth = img.width * widthScaleFactor;
    const newHeight = img.height * heightScaleFactor;

    // Center image within the cell
    const x = index * cellWidth + (cellWidth - newWidth) / 2;
    const y = (iconCellHeight - newHeight) / 2;

    // draw the image within the x & y coordinates given
    ctx.drawImage(img, x, y, newWidth, newHeight);
  }

  // Draw reaction images based on data parameter given
  for (let index = 0; index < elementKeys.length; index++) {
    // grab the element
    const element = elementKeys[index];

    // grab the reaction data associated with the element
    const reaction = data[element];

    const weakness = reaction.split(" ")[0];

    let weaknessImagePath = imagePaths.neutral; // Default value

    // switch statement to determine which image to produce in bottom row
    switch (weakness) {
      case "wk":
        weaknessImagePath = imagePaths.weak;
        break;
      case "rs":
        weaknessImagePath = imagePaths.resist;
        break;
      case "nu":
        weaknessImagePath = imagePaths.null;
        break;
      case "ab":
        weaknessImagePath = imagePaths.drain;
        break;
      case "rp":
        weaknessImagePath = imagePaths.reflect;
        break;
      case "no":
        weaknessImagePath = imagePaths.neutral;
        break;
      default:
        weaknessImagePath = imagePaths.neutral;
    }

    // grab the reaction image using the image path
    const img = await loadImage(weaknessImagePath);

    // Center image in the cell (bottom row)
    const x = index * cellWidth + (cellWidth - img.width) / 2;
    const y = iconCellHeight + (cellHeight - img.height) / 2; // Bottom row offset by `cellHeight`

    // draw the image within the x & y coordinates given
    ctx.drawImage(img, x, y);

    // Draw grid lines
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;

    // Draw vertical lines for columns
    for (let col = 1; col < cols; col++) {
      // pick up pen
      ctx.beginPath();

      // bring pen to the start of whichever column we are drawing
      // EX. first column begins at = (col = 0 * cellwidth, 0) aka (0,0)
      ctx.moveTo(col * cellWidth, 0);

      // the pen will end drawing at the bottom of the canvas
      ctx.lineTo(col * cellWidth, rows * cellHeight);

      // draw the line
      ctx.stroke();
    }

    // Draw horizontal lines for rows
    for (let row = 1; row < rows; row++) {
      // pick up pen
      ctx.beginPath();

      // bring pen to the start of whichever row we are drawing
      ctx.moveTo(0, row * iconCellHeight);

      // the pen will end drawing at the right most side of the canvas
      ctx.lineTo(cols * cellWidth, row * iconCellHeight);

      // draw the line
      ctx.stroke();
    }
  }

  return canvas.toBuffer(); // Convert canvas to buffer
}

//! change color of both embed returns based on game
