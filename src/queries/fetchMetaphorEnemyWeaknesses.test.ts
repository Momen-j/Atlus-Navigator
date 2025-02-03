import { fetchEnemyWeaknesses } from "./fetchMetaphorEnemyWeaknesses";
import { db, metaphorEnemyStats } from "../drizzle.config";
//TODO: ADD COMMENTS TO THIS FILE + CREATE EXCEPTION HANDLERS IN QUERY FUNCTIONS TO HANDLE NO MONSTER IN DB OR DB CONNECTION ERRORS

// Mock the database
jest.mock("../drizzle.config", () => {
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
    // all column keys are assigned null b/c the 
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

  it("should return an empty array when the query fails", async () => {
    jest
      .spyOn(db.select(expect.any(Object)).from(metaphorEnemyStats), "where")
      .mockRejectedValue(new Error("Database error"));

    const result = await fetchEnemyWeaknesses("Shadow");

    expect(result).toEqual([]);
  });
});
