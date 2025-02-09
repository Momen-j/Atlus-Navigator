import { eq } from "drizzle-orm";
import { db, metaphorEnemyStats } from "../drizzleconfig.js";
import { MetaphorEnemyStats } from "src/interfaces.js";

/**
 * Fetches the general stats of a Metaphor: Refantazio enemy from the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} enemyName The name of the enemy given by the user.
 * @returns {Promise<MetaphorEnemyStats[]>} A promise that resolves to an array of objects containing general stats as keys and the accompnaying data as values
 * If the enemy is not found, the array will be empty.
 * @throws {Error} Throws an error if there is a database connection issue or a query failure.
 */
export async function fetchMetaphorEnemyStats(
  enemyName: string
): Promise<MetaphorEnemyStats[]> {
  const enemiesStats = await db
    .select({
      level: metaphorEnemyStats.level,
      hp: metaphorEnemyStats.hp,
    })
    .from(metaphorEnemyStats)
    .where(eq(metaphorEnemyStats.enemyName, enemyName));

  return enemiesStats;
}
