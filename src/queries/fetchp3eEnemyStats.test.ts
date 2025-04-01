import { fetchP3E_EnemyStats } from "./fetchp3eEnemyStats";
import { db, p3eEnemyStats } from "../drizzleconfig.js";

// Mock the database
jest.mock("../drizzleconfig", () => {
  const mockQueryBuilder = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([
      {
        level: "10",
        hp: "500",
        appears: "Dungeon",
        race: "Fool"
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
    p3eEnemyStats: {
      level: null,
      hp: null,
      appears: null,
      race: null,
    },
  };
});

describe("fetchP3E_EnemyStats", () => {
  it("should return the correct stats for a given enemy", async () => {
    const result = await fetchP3E_EnemyStats("Shadow");

    expect(result).toEqual([
      {
        level: "10",
        hp: "500",
        appears: "Dungeon",
        race: "Fool",
      },
    ]);

    // Ensure select() was called with an object (fields to select)
    expect(db.select).toHaveBeenCalledWith(expect.any(Object));

    // Ensure from() was called with the p3eEnemyStats table
    expect(db.select(expect.any(Object)).from).toHaveBeenCalledWith(
      p3eEnemyStats
    );

    // Ensure where() was called with some condition (enemy name check)
    expect(
      db.select(expect.any(Object)).from(p3eEnemyStats).where
    ).toHaveBeenCalledWith(expect.anything());
  });

  it("should return an empty array when no enemy is found", async () => {
    jest
      .spyOn(db.select(expect.any(Object)).from(p3eEnemyStats), "where")
      .mockResolvedValue([]);

    const result = await fetchP3E_EnemyStats("NonExistentEnemy");

    expect(result).toEqual([]); // This confirms we don’t treat this as an error
  });
});
