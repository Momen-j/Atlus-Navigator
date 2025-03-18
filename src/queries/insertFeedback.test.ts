import { insertFeedback } from "./insertFeedback";
import { db, feedback } from "../drizzleconfig.js";

// Mock the database
jest.mock("../drizzleconfig", () => {
  // Create a mock for the values function
  const valuesMock = jest.fn().mockResolvedValue(undefined);
  
  // Create a reusable insert result object that always returns the same values mock
  const insertResultMock = { values: valuesMock };
  
  // Create the insert mock that always returns the same insert result
  const insertMock = jest.fn().mockReturnValue(insertResultMock);
  
  return {
    db: {
      insert: insertMock
    },
    feedback: {
      description: null,
    },
  };
});

describe("insertFeedback", () => {
  // Store references to mocks for easier access in tests
  const valuesMock = jest.fn();
  const insertResultMock = { values: valuesMock };
  const insertMock = jest.fn().mockReturnValue(insertResultMock);
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Reset our local references to the mocks to match the imported ones
    insertMock.mockReturnValue(insertResultMock);
    valuesMock.mockResolvedValue(undefined);
    
    // Replace the mocked functions with our local references
    db.insert = insertMock;
    insertResultMock.values = valuesMock;
  });

  it("should insert feedback with the provided description", async () => {
    const testDescription = "This is a test feedback";
    
    await insertFeedback(testDescription);
    
    // Verify db.insert was called with the feedback table
    expect(insertMock).toHaveBeenCalledWith(feedback);
    
    // Verify values was called with the correct description
    expect(valuesMock).toHaveBeenCalledWith({
      description: testDescription,
    });
  });

  it("should throw an error when database insertion fails", async () => {
    const testDescription = "Test feedback";
    const errorMessage = "Database insertion failed";
    
    // Make the values method reject with an error
    valuesMock.mockRejectedValueOnce(new Error(errorMessage));
    
    // Verify that the function throws the expected error
    await expect(insertFeedback(testDescription)).rejects.toThrow(errorMessage);
    
    // Verify the insert function was called with the right parameters
    expect(insertMock).toHaveBeenCalledWith(feedback);
    expect(valuesMock).toHaveBeenCalledWith({
      description: testDescription,
    });
  });
});