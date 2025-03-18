import createP4WeaknessChart from "./createP4WeaknessChart";
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
      width: 1615,
      height: 275,
    })),
    loadImage: jest.fn(async () => ({ width: 100, height: 50 })), // Mock loadImage (average size of an asset icon)
  };
});

// Setup function to reset mocks (aka the drawImage/loadImage functions start fresh)
describe("createP4WeaknessChart", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should generate a weakness chart and return an image buffer", async () => {
    const weaknesses = {
      phys: "wk",
      fire: "rs",
      ice: "ab",
      elec: "rp",
      wind: "wk",
      light: "nu",
      dark: "rs",
      almighty: "no",
    };

    const p4ChartCanvasBuffer =
      await createP4WeaknessChart(weaknesses);

    // Ensure output is a Buffer
    expect(p4ChartCanvasBuffer).toBeInstanceOf(Buffer);

    // Ensure createCanvas was called with expected dimensions
    expect(createCanvas).toHaveBeenCalledWith(1615, 275);

    // Ensure loadImage was called for each element and reaction
    expect(loadImage).toHaveBeenCalledTimes(Object.keys(weaknesses).length * 2);
  });

  it("should draw images on the canvas for each cell within the weakness chart", async () => {
    const weaknesses = {
        phys: "wk",
        fire: "rs",
        ice: "ab",
        elec: "rp",
        wind: "wk",
        light: "nu",
        dark: "rs",
        almighty: "no",
    };

    await createP4WeaknessChart(weaknesses);

    // Ensure drawImage was called for each element and reaction
    expect(mockContext.drawImage).toHaveBeenCalledTimes(
      Object.keys(weaknesses).length * 2
    );
  });
});
