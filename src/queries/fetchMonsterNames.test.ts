import { fetchMonsterNames } from "./fetchMonsterNames"; 
import { db, metaphorEnemyStats, p3eEnemyStats, p3rEnemyStats, p4EnemyStats, p5EnemyStats } from "../drizzleconfig.js";
import { AtlusGame } from "../enums.js";

// Mock the database and tables
jest.mock("../drizzleconfig", () => {
  const mockQueryBuilder = {
    from: jest.fn().mockReturnThis(),
  };

  return {
    db: {
      selectDistinct: jest.fn(() => {
        return mockQueryBuilder;
      }),
    },
    // Mock tables with null values as we only care about the structure
    metaphorEnemyStats: {
      enemyName: null
    },
    p3eEnemyStats: {
      enemyName: null
    },
    p3rEnemyStats: {
      enemyName: null
    },
    p4EnemyStats: {
      enemyName: null
    },
    p5EnemyStats: {
      enemyName: null
    }
  };
});

describe("fetchMonsterNames", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch monster names for Metaphor", async () => {
    // Mock the return value for this specific test
    const mockEnemies = [
      { name: "Shadow" },
      { name: "Slime" }
    ];
    
    const mockFrom = jest.fn().mockResolvedValue(mockEnemies);
    (db.selectDistinct as jest.Mock).mockReturnValue({ from: mockFrom });

    const result = await fetchMonsterNames(AtlusGame.Metaphor);

    expect(result).toEqual(mockEnemies);
    expect(db.selectDistinct).toHaveBeenCalledWith({ name: metaphorEnemyStats.enemyName });
    expect(mockFrom).toHaveBeenCalledWith(metaphorEnemyStats);
  });

  it("should fetch monster names for Persona 3 Reload", async () => {
    const mockEnemies = [
      { name: "Maya" },
      { name: "Thanatos" }
    ];
    
    const mockFrom = jest.fn().mockResolvedValue(mockEnemies);
    (db.selectDistinct as jest.Mock).mockReturnValue({ from: mockFrom });

    const result = await fetchMonsterNames(AtlusGame.Persona3Reload);

    expect(result).toEqual(mockEnemies);
    expect(db.selectDistinct).toHaveBeenCalledWith({ name: p3rEnemyStats.enemyName });
    expect(mockFrom).toHaveBeenCalledWith(p3rEnemyStats);
  });

  it("should fetch monster names for Persona 3 Reload Aigis", async () => {
    const mockEnemies = [
      { name: "Orpheus" },
      { name: "Cerberus" }
    ];
    
    const mockFrom = jest.fn().mockResolvedValue(mockEnemies);
    (db.selectDistinct as jest.Mock).mockReturnValue({ from: mockFrom });

    const result = await fetchMonsterNames(AtlusGame.Persona3ReloadAigis);

    expect(result).toEqual(mockEnemies);
    expect(db.selectDistinct).toHaveBeenCalledWith({ name: p3eEnemyStats.enemyName });
    expect(mockFrom).toHaveBeenCalledWith(p3eEnemyStats);
  });

  it("should fetch monster names for Persona 4 Golden", async () => {
    const mockEnemies = [
      { name: "Izanagi" },
      { name: "Jack Frost" }
    ];
    
    const mockFrom = jest.fn().mockResolvedValue(mockEnemies);
    (db.selectDistinct as jest.Mock).mockReturnValue({ from: mockFrom });

    const result = await fetchMonsterNames(AtlusGame.Persona4Golden);

    expect(result).toEqual(mockEnemies);
    expect(db.selectDistinct).toHaveBeenCalledWith({ name: p4EnemyStats.enemyName });
    expect(mockFrom).toHaveBeenCalledWith(p4EnemyStats);
  });

  it("should fetch monster names for Persona 5 Royal", async () => {
    const mockEnemies = [
      { name: "Arsene" },
      { name: "Pixie" }
    ];
    
    const mockFrom = jest.fn().mockResolvedValue(mockEnemies);
    (db.selectDistinct as jest.Mock).mockReturnValue({ from: mockFrom });

    const result = await fetchMonsterNames(AtlusGame.Persona5Royal);

    expect(result).toEqual(mockEnemies);
    expect(db.selectDistinct).toHaveBeenCalledWith({ name: p5EnemyStats.enemyName });
    expect(mockFrom).toHaveBeenCalledWith(p5EnemyStats);
  });

  it("should return an empty array when no monsters are found", async () => {
    const mockFrom = jest.fn().mockResolvedValue([]);
    (db.selectDistinct as jest.Mock).mockReturnValue({ from: mockFrom });

    const result = await fetchMonsterNames(AtlusGame.Metaphor);

    expect(result).toEqual([]);
    expect(db.selectDistinct).toHaveBeenCalledWith({ name: metaphorEnemyStats.enemyName });
    expect(mockFrom).toHaveBeenCalledWith(metaphorEnemyStats);
  });

  it("should handle database errors properly", async () => {
    const mockError = new Error("Database connection failed");
    const mockFrom = jest.fn().mockRejectedValue(mockError);
    (db.selectDistinct as jest.Mock).mockReturnValue({ from: mockFrom });

    await expect(fetchMonsterNames(AtlusGame.Metaphor)).rejects.toThrow("Database connection failed");
  });
});