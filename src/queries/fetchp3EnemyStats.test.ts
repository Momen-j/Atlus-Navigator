import { fetchP3EnemyStats } from "./fetchp3EnemyStats";
import { db, p3rEnemyStats } from "../drizzleconfig.js";

// Mock the database
jest.mock("../drizzleconfig", () => {
  const mockQueryBuilder = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([
      {
        level: "10",
        hp: "500",
        appears: "Dungeon",
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
    p3rEnemyStats: {
      level: null,
      hp: null,
      appears: null,
    },
  };
});

describe("fetchP3EnemyStats", () => {
  it("should return the correct stats for a given enemy", async () => {
    const result = await fetchP3EnemyStats("Shadow");

    expect(result).toEqual([
      {
        level: "10",
        hp: "500",
        appears: "Dungeon",
      },
    ]);

    // Ensure select() was called with an object (fields to select)
    expect(db.select).toHaveBeenCalledWith(expect.any(Object));

    // Ensure from() was called with the p3rEnemyStats table
    expect(db.select(expect.any(Object)).from).toHaveBeenCalledWith(
      p3rEnemyStats
    );

    // Ensure where() was called with some condition (enemy name check)
    expect(
      db.select(expect.any(Object)).from(p3rEnemyStats).where
    ).toHaveBeenCalledWith(expect.anything());
  });

  it("should return an empty array when no enemy is found", async () => {
    jest
      .spyOn(db.select(expect.any(Object)).from(p3rEnemyStats), "where")
      .mockResolvedValue([]);

    const result = await fetchP3EnemyStats("NonExistentEnemy");

    expect(result).toEqual([]); // This confirms we don’t treat this as an error
  });
});
