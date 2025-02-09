import { eq } from "drizzle-orm";
import { db, p3eEnemyStats } from "../drizzleconfig.js";
import { P3EnemyWeaknesses } from "src/interfaces.js";

/**
 * Fetches the weaknesses of a Persona 3 Reload: Episode Aigis shadow from the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} enemyName The name of the enemy given by the user.
 * @returns {Promise<P3EnemyWeaknesses[]>} A promise that resolves to an array of objects containing elements as keys and enemy weaknesses/reactions as values
 * If the enemy is not found, the array will be empty.
 * @throws {Error} Throws an error if there is a database connection issue or a query failure.
 * @example export interface P3EnemyWeaknesses {
  slash: string;
  pierce: string;
  strike: string;
  fire: string;
  ice: string;
  elec: string;
  wind: string;
  light: string;
  dark: string;
  almighty: string;
}
 */

export async function fetchP3E_EnemyWeaknesses(
  enemyName: string
): Promise<P3EnemyWeaknesses[]> {
  try {
    const enemiesWeaknesses = await db
      .select({
        slash: p3eEnemyStats.slash,
        pierce: p3eEnemyStats.pierce,
        strike: p3eEnemyStats.strike,
        fire: p3eEnemyStats.fire,
        ice: p3eEnemyStats.ice,
        elec: p3eEnemyStats.elec,
        wind: p3eEnemyStats.wind,
        light: p3eEnemyStats.light,
        dark: p3eEnemyStats.dark,
        almighty: p3eEnemyStats.almighty,
      })
      .from(p3eEnemyStats)
      .where(eq(p3eEnemyStats.enemyName, enemyName));

    return enemiesWeaknesses;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
