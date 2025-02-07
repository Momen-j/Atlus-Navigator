import { fetchEnemyWeaknesses } from "./fetchMetaphorEnemyWeaknesses";
import { db, metaphorEnemyStats } from "../drizzleconfig.js";
//TODO: ADD COMMENTS TO THIS FILE + CREATE EXCEPTION HANDLERS IN QUERY FUNCTIONS TO HANDLE NO MONSTER IN DB OR DB CONNECTION ERRORS

// Mock the database
jest.mock("../drizzleconfig", () => {
  const mockQueryBuilder = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([
      {
        slash: "weak",
        pierce: "resist",
        strike: "null",
        fire: "absorb",
        ice: "weak",
        elec: "null",
        wind: "resist",
        light: "null",
        dark: "null",
        almighty: "neutral",
      },
    ]),
  };

  return {
    db: {
      select: jest.fn((fields) => {
        if (!fields) {
          throw new Error("select() must be called with an argument");
        }
        return mockQueryBuilder;
      }),
    },
    // all column keys are assigned null b/c the values within the table don't matter as long as we have the same fields
    // null = we don't care about the values just that the fields exist
    metaphorEnemyStats: {
      slash: null,
      pierce: null,
      strike: null,
      fire: null,
      ice: null,
      elec: null,
      wind: null,
      light: null,
      dark: null,
      almighty: null,
    },
  };
});

describe("fetchEnemyWeaknesses", () => {
  it("should return the correct weaknesses for a given enemy", async () => {
    const result = await fetchEnemyWeaknesses("Shadow");

    expect(result).toEqual([
      {
        slash: "weak",
        pierce: "resist",
        strike: "null",
        fire: "absorb",
        ice: "weak",
        elec: "null",
        wind: "resist",
        light: "null",
        dark: "null",
        almighty: "neutral",
      },
    ]);

    // Ensure select() was called with an object (fields to select)
    expect(db.select).toHaveBeenCalledWith(expect.any(Object));

    // Ensure from() was called with the metaphorEnemyStats table
    expect(db.select(expect.any(Object)).from).toHaveBeenCalledWith(
      metaphorEnemyStats
    );

    // Ensure where() was called with some condition (enemy name check)
    expect(
      db.select(expect.any(Object)).from(metaphorEnemyStats).where
    ).toHaveBeenCalledWith(expect.anything());
  });
  
  it("should return an empty array when no enemy is found", async () => {
    jest.spyOn(db.select(expect.any(Object)).from(metaphorEnemyStats), "where").mockResolvedValue([]);
  
    const result = await fetchEnemyWeaknesses("NonExistentEnemy");
  
    expect(result).toEqual([]); // This confirms we don’t treat this as an error
  });

  it("should throw an error if the database connection fails", async () => {
    jest.spyOn(db, "select").mockImplementation(() => {
      throw new Error("ECONNREFUSED"); // Simulates a database connection error
    });
  
    await expect(fetchEnemyWeaknesses("Shadow")).rejects.toThrow("Database connection failed.");
  });

  it("should throw an error if the query times out", async () => {
    jest.spyOn(db, "select").mockImplementation(() => {
      throw new Error("timeout"); // Simulates a query timeout
    });
  
    await expect(fetchEnemyWeaknesses("Shadow")).rejects.toThrow("Database query timed out.");
  });

  it("should throw an error for an unexpected database issue", async () => {
    jest.spyOn(db, "select").mockImplementation(() => {
      throw new Error("Some unknown database issue"); // Simulates an error we aren't prepared for in the query function
    });
  
    await expect(fetchEnemyWeaknesses("Shadow")).rejects.toThrow("Unexpected database error.");
  });
});
