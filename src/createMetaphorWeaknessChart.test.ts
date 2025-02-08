import createMetaphorWeaknessChart from "./createmetaphorWeaknessChart";
import { createCanvas, loadImage } from "canvas";

// Store the mock context to track calls across tests
const mockContext = {
  fillStyle: "",
  fillRect: jest.fn(),
  strokeStyle: "",
  lineWidth: 0,
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  drawImage: jest.fn(),
  toBuffer: jest.fn(() => Buffer.from("mockBuffer")),
};

// Mock the canvas package
jest.mock("canvas", () => {
    // imports the actual canvas module
    // we do this to only override createCanvas and loadImage, but keep the rest of canvas untouched for proper testing functionality
  const actualCanvas = jest.requireActual("canvas"); 

  return {
    ...actualCanvas,
    createCanvas: jest.fn(() => ({
      getContext: jest.fn(() => mockContext),
      toBuffer: mockContext.toBuffer,
      width: 2000,
      height: 350,
    })),
    loadImage: jest.fn(async () => ({ width: 100, height: 50 })), // Mock loadImage (average size of an asset icon)
  };
});

// Setup function to reset mocks (aka the drawImage/loadImage functions start fresh)
describe("createMetaphorWeaknessChart", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should generate a weakness chart and return an image buffer", async () => {
    const weaknesses = {
      slash: "Weak (1.5x)",
      pierce: "Neutral",
      strike: "Neutral",
      fire: "Resist (0.5x)",
      ice: "Drain",
      elec: "Repel",
      wind: "Weak (1.5x)",
      light: "Null",
      dark: "Resist (0.4x)",
      almighty: "Neutral",
    };

    const metaphorChartCanvasBuffer =
      await createMetaphorWeaknessChart(weaknesses);

    // Ensure output is a Buffer
    expect(metaphorChartCanvasBuffer).toBeInstanceOf(Buffer);

    // Ensure createCanvas was called with expected dimensions
    expect(createCanvas).toHaveBeenCalledWith(2000, 350);

    // Ensure loadImage was called for each element and reaction
    expect(loadImage).toHaveBeenCalledTimes(Object.keys(weaknesses).length * 2);
  });

  it("should draw images on the canvas for each cell within the weakness chart", async () => {
    const weaknesses = {
      slash: "Weak (1.5x)",
      pierce: "Neutral",
      strike: "Neutral",
      fire: "Resist (0.5x)",
      ice: "Drain",
      elec: "Repel",
      wind: "Weak (1.5x)",
      light: "Null",
      dark: "Resist (0.4x)",
      almighty: "Neutral",
    };

    await createMetaphorWeaknessChart(weaknesses);

    // Ensure drawImage was called for each element and reaction
    expect(mockContext.drawImage).toHaveBeenCalledTimes(
      Object.keys(weaknesses).length * 2
    );
  });
});
