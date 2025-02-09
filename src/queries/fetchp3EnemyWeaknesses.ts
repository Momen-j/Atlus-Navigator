import { eq } from "drizzle-orm";
import { db, p3rEnemyStats } from "../drizzleconfig.js";
import { P3EnemyWeaknesses } from "src/interfaces.js";

/**
 * Fetches the weaknesses of a Persona 3 Reload shadow from the database.
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

export async function fetchP3EnemyWeaknesses(
  enemyName: string
): Promise<P3EnemyWeaknesses[]> {
  const enemiesWeaknesses = await db
    .select({
      slash: p3rEnemyStats.slash,
      pierce: p3rEnemyStats.pierce,
      strike: p3rEnemyStats.strike,
      fire: p3rEnemyStats.fire,
      ice: p3rEnemyStats.ice,
      elec: p3rEnemyStats.elec,
      wind: p3rEnemyStats.wind,
      light: p3rEnemyStats.light,
      dark: p3rEnemyStats.dark,
      almighty: p3rEnemyStats.almighty,
    })
    .from(p3rEnemyStats)
    .where(eq(p3rEnemyStats.enemyName, enemyName));

  // when no enemies are found in db, return empty array
  if (enemiesWeaknesses.length === 0) {
    return [];
  }

  return enemiesWeaknesses;
}
