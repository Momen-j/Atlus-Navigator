import { eq } from "drizzle-orm";
import { db, p4EnemyStats } from "../drizzleconfig.js";
import { P4EnemyWeaknesses } from "src/interfaces.js";

/**
 * Fetches the weaknesses of a Persona 4 Golden shadow from the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} enemyName The name of the enemy given by the user.
 * @returns {Promise<P4EnemyWeaknesses[]>} A promise that resolves to an array of objects containing elements as keys and enemy weaknesses/reactions as values
 * If the enemy is not found, the array will be empty.
 * @throws {Error} Throws an error if there is a database connection issue or a query failure.
 * @example export interface P4EnemyWeaknesses {
  phys: string;
  fire: string;
  ice: string;
  elec: string;
  wind: string;
  light: string;
  dark: string;
  almighty: string;
}
 */

export async function fetchP4EnemyWeaknesses(
  enemyName: string
): Promise<P4EnemyWeaknesses[]> {
  try {
    const enemiesWeaknesses = await db
      .select({
        phys: p4EnemyStats.phys,
        fire: p4EnemyStats.fire,
        ice: p4EnemyStats.ice,
        elec: p4EnemyStats.elec,
        wind: p4EnemyStats.wind,
        light: p4EnemyStats.light,
        dark: p4EnemyStats.dark,
        almighty: p4EnemyStats.almighty,
      })
      .from(p4EnemyStats)
      .where(eq(p4EnemyStats.enemyName, enemyName));

    return enemiesWeaknesses;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
