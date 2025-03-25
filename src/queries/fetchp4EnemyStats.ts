import { eq } from "drizzle-orm";
import { db, p4EnemyStats } from "../drizzleconfig.js";
import { P4EnemyStats } from "src/interfaces.js";

/**
 * Fetches the general stats of a Persona 4 Golden shadow from the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} enemyName The name of the enemy given by the user.
 * @returns {Promise<P4EnemyStats[]>} A promise that resolves to an array of objects containing general stats as keys and the accompnaying data as values
 * If the enemy is not found, the array will be empty.
 * @throws {Error} Throws an error if there is a database connection issue or a query failure.
 * @example export interface P4EnemyStats {
  level: string;
  hp: string;
  appears: string;
}
 */

export async function fetchP4EnemyStats(
  enemyName: string
): Promise<P4EnemyStats[]> {
    const enemiesStats = await db
      .select({
        level: p4EnemyStats.level,
        hp: p4EnemyStats.hp,
        appears: p4EnemyStats.appears,
        race: p4EnemyStats.race,
      })
      .from(p4EnemyStats)
      .where(eq(p4EnemyStats.enemyName, enemyName));

    return enemiesStats;
}
