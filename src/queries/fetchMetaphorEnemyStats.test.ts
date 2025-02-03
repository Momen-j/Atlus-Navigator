import { fetchEnemyStats } from "./fetchMetaphorEnemyStats";

// Mock the module
jest.mock("./fetchMetaphorEnemyStats", () => ({
  fetchEnemyStats: jest.fn(),
  }));
  
// test to see if function returns weakness data for golbin
test("Returns weaknesses for a monster", async () => {
  (fetchEnemyStats as jest.Mock).mockImplementation((monsterName) => {
    if (monsterName === "goblin") {
      return Promise.resolve([
        {
          level: "10",
          hp: "1200",
        },
      ]);
    }
    return Promise.resolve([]);
  });

  const result = await fetchEnemyStats("goblin");
  expect(result).toEqual([
    {
      level: "10",
      hp: "1200",
    },
  ]);
});
