import { createCanvas, loadImage } from "canvas"; // Canvas package for creating images
import path from "path";
import { MetaphorEnemyWeaknesses } from "src/interfaces.js";

/**
 * Generates a Metaphor: ReFantazio weakness chart as an image buffer given a specific monster's weakness data within an object.
 * The chart visually represents a monster's reaction to every element within the game.
 *
 * @memberof WeaknessChartFunctions
 * @async
 * @function createMetaphorWeaknessChart
 * @param {MetaphorEnemyWeaknesses} data - An object mapping element names to their respective weaknesses/reactions for a specific monster.
 * @returns {Promise<Buffer>} A Promise that resolves to an image buffer containing the generated Metaphor: ReFantazio weakness chart.
 * @see {@link DatabaseQueries.exports.fetchMetaphorEnemyWeaknesses}
 */

export default async function createMetaphorWeaknessChart(data: MetaphorEnemyWeaknesses): Promise<Buffer> {
  //! BREAK UP INTO HELPER FUNCTIONS FOR DIFFERENT GAMES and make game type a parameter
  // Canvas & context setup to draw on canvas
  const canvas = createCanvas(2000, 350);
  const ctx = canvas.getContext("2d");

  // Fill background with black
  ctx.fillStyle = "#C05F68";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fill top row with white
  ctx.fillStyle = "#6B9591";
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  // Grid and cell properties
  const cellWidth = canvas.width / 10; // Width of each cell //! Since we want 10 columns we divide width by 10
  const cellHeight = canvas.height / 2; // Height of each cell //! Since we want 2 rows we divide height by 2
  const cols = 10; // Fixed number of columns
  const rows = 2; // Always 2 rows (top for elements, bottom for weaknesses)

  // Draw grid lines
  ctx.strokeStyle = "black";
  ctx.lineWidth = 6;

  // Draw vertical lines for columns
  for (let col = 0; col <= cols; col++) {
    // pick up pen
    ctx.beginPath();

    // bring pen to the start of whichever column we are drawing
    ctx.moveTo(col * cellWidth, 0);

    // the pen will end drawing at the bottom of the canvas
    ctx.lineTo(col * cellWidth, rows * cellHeight);

    // draw the line
    ctx.stroke();
  }

  // Draw horizontal lines for rows
  for (let row = 0; row <= rows; row++) {
    // pick up pen
    ctx.beginPath();

    // bring pen to the start of whichever row we are drawing
    ctx.moveTo(0, row * cellHeight);

    // the pen will end drawing at the right most side of the canvas
    ctx.lineTo(cols * cellWidth, row * cellHeight);

    // draw the line
    ctx.stroke();
  }

  // Explicitly define paths to the elements and reactions folders
  const elementsFolder = path.resolve("./src/assets/elements");
  const reactionsFolder = path.resolve("./src/assets/reactions");

  // preload weakness images into an object
  const imagePaths = {
    weak: path.join(reactionsFolder, "weak.png"),
    resist: path.join(reactionsFolder, "resist.png"),
    null: path.join(reactionsFolder, "null.png"),
    drain: path.join(reactionsFolder, "drain.png"),
    reflect: path.join(reactionsFolder, "reflect.png"),
    vulnerable: path.join(reactionsFolder, "vulnerable.png"),
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

    // Define a scaling factor
    const widthScaleFactor = 1.5; // Increase size by xx% (2.5 IS WIDTH SWEETSPOT for 2000 px length canvas)
    //const heightScaleFactor = 1; // Increase size by xx%

    // Scale the width & height
    const newWidth = img.width * widthScaleFactor;
    const newHeight = img.height * widthScaleFactor;

    // Center image within the cell
    //! LOOK INTO HOW THIS WORKS + HOW FORMULA DYNAMICALLY CENTERS
    const x = index * cellWidth + (cellWidth - newWidth) / 2;
    const y = (cellHeight - newHeight) / 2;

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
      case "Weak":
        weaknessImagePath = imagePaths.weak;
        break;
      case "Resist":
        weaknessImagePath = imagePaths.resist;
        break;
      case "Null":
        weaknessImagePath = imagePaths.null;
        break;
      case "Drain":
        weaknessImagePath = imagePaths.drain;
        break;
      case "Repel":
        weaknessImagePath = imagePaths.reflect;
        break;
      case "Vulnerable":
        weaknessImagePath = imagePaths.vulnerable;
        break;
      case "Neutral":
        weaknessImagePath = imagePaths.neutral;
        break;
      default:
        weaknessImagePath = imagePaths.neutral;
    }

    // grab the reaction image using the image path
    const img = await loadImage(weaknessImagePath);

    // Center image in the cell (bottom row)
    //! LOOK INTO HOW THIS WORKS + HOW FORMULA DYNAMICALLY CENTERS
    const x = index * cellWidth + (cellWidth - img.width) / 2;
    const y = cellHeight + (cellHeight - img.height) / 2; // Bottom row offset by `cellHeight`

    // draw the image within the x & y coordinates given
    ctx.drawImage(img, x, y);
  }

  return canvas.toBuffer(); // Convert canvas to buffer
}