import { eq } from "drizzle-orm";
import { db, p5EnemyStats } from "../drizzleconfig.js";
import { P5EnemyStats } from "src/interfaces.js";

/**
 * Fetches the general stats of a Persona 5 Royal shadow from the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} enemyName The name of the enemy given by the user.
 * @returns {Promise<P5EnemyStats[]>} A promise that resolves to an array of objects containing general stats as keys and the accompnaying data as values
 * If the enemy is not found, the array will be empty.
 * @throws {Error} Throws an error if there is a database connection issue or a query failure.
 * @example export interface P5EnemyStats {
  level: string;
  hp: string;
  appears: string;
}
 */

export async function fetchP5EnemyStats(
  enemyName: string
): Promise<P5EnemyStats[]> {
    const enemiesStats = await db
      .select({
        level: p5EnemyStats.level,
        hp: p5EnemyStats.hp,
        appears: p5EnemyStats.appears,
        race: p5EnemyStats.race,
      })
      .from(p5EnemyStats)
      .where(eq(p5EnemyStats.enemyName, enemyName));

    return enemiesStats;
}
