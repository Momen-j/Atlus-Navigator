import { fetchP5EnemyWeaknesses } from "./fetchp5EnemyWeaknesses";
import { db, p5EnemyStats } from "../drizzleconfig.js";

// Mock the database
jest.mock("../drizzleconfig", () => {
  const mockQueryBuilder = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([
      {
        phys: "weak",
        gun: "resist",
        fire: "absorb",
        ice: "weak",
        elec: "null",
        wind: "resist",
        psy: "neutral",
        nuke: "neutral",
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
    p5EnemyStats: {
      phys: null,
      gun: null,
      fire: null,
      ice: null,
      elec: null,
      wind: null,
      psy: null,
      nuke: null,
      light: null,
      dark: null,
      almighty: null,
    },
  };
});

describe("fetchP5EnemyWeaknesses", () => {
  it("should return the correct weaknesses for a given shadow", async () => {
    const result = await fetchP5EnemyWeaknesses("Shadow");

    expect(result).toEqual([
      {
        phys: "weak",
        gun: "resist",
        fire: "absorb",
        ice: "weak",
        elec: "null",
        wind: "resist",
        psy: "neutral",
        nuke: "neutral",
        light: "null",
        dark: "null",
        almighty: "neutral",
      },
    ]);

    // Ensure select() was called with an object (fields to select)
    expect(db.select).toHaveBeenCalledWith(expect.any(Object));

    // Ensure from() was called with the p5EnemyStats table
    expect(db.select(expect.any(Object)).from).toHaveBeenCalledWith(
      p5EnemyStats
    );

    // Ensure where() was called with some condition (enemy name check)
    expect(
      db.select(expect.any(Object)).from(p5EnemyStats).where
    ).toHaveBeenCalledWith(expect.anything());
  });

  it("should return an empty array when no enemy is found", async () => {
    jest
      .spyOn(db.select(expect.any(Object)).from(p5EnemyStats), "where")
      .mockResolvedValue([]);

    const result = await fetchP5EnemyWeaknesses("NonExistentEnemy");

    expect(result).toEqual([]); // This confirms we don’t treat this as an error
  });
});
