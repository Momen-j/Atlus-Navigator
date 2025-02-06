import { fetchEnemyStats } from "./fetchMetaphorEnemyStats";
import { db, metaphorEnemyStats } from "../drizzleconfig.js";
//TODO: ADD COMMENTS TO THIS FILE + CREATE EXCEPTION HANDLERS IN QUERY FUNCTIONS TO HANDLE NO MONSTER IN DB OR DB CONNECTION ERRORS

// Mock the database
jest.mock("../drizzleconfig", () => {
  const mockQueryBuilder = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([
      {
        level: "10",
        hp: "500",
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
      level: null,
      hp: null,
    },
  };
});

describe("fetchEnemyStats", () => {
  it("should return the correct stats for a given enemy", async () => {
    const result = await fetchEnemyStats("Shadow");

    expect(result).toEqual([
      {
        level: "10",
        hp: "500",
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

    const result = await fetchEnemyStats("Shadow");

    expect(result).toEqual([]);
  });
});
