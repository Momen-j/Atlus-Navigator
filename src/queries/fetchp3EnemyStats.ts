import { eq } from "drizzle-orm";
import { db, p3rEnemyStats } from "../drizzleconfig.js";
import { P3EnemyStats } from "src/interfaces.js";

/**
 * Fetches the general stats of a Persona 3 Reload shadow from the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} enemyName The name of the enemy given by the user.
 * @returns {Promise<P3EnemyStats[]>} A promise that resolves to an array of objects containing general stats as keys and the accompnaying data as values
 * If the enemy is not found, the array will be empty.
 * @throws {Error} Throws an error if there is a database connection issue or a query failure.
 * @example export interface P3EnemyStats {
  level: string;
  hp: string;
  appears: string;
}
 */

export async function fetchP3EnemyStats(
  enemyName: string
): Promise<P3EnemyStats[]> {
  const enemiesStats = await db
    .select({
      level: p3rEnemyStats.level,
      hp: p3rEnemyStats.hp,
      appears: p3rEnemyStats.appears,
      race: p3rEnemyStats.race,
    })
    .from(p3rEnemyStats)
    .where(eq(p3rEnemyStats.enemyName, enemyName));

  return enemiesStats;
}
