import { eq } from "drizzle-orm";
import { db, metaphorEnemyStats } from "../drizzleconfig.js";
import { MetaphorEnemyWeaknesses } from "src/metaphorInterface.js";

//! Returns an object where keys represent the element type
//! and the values are the enemy's reaction to the element

/**
 * Fetches the weaknesses of a Metaphor: Refantazio enemy from the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} enemyName The name of the enemy given by the user.
 * @returns {Promise<MetaphorEnemyWeaknesses[]>} A promise that resolves to an array of objects containing elements as keys and enemy weaknesses/reactions as values
 * If the enemy is not found, the array will be empty.
 * @throws {Error} Throws an error if there is a database connection issue or a query failure.
 */
export async function fetchMetaphorEnemyWeaknesses(
  enemyName: string
): Promise<MetaphorEnemyWeaknesses[]> {
  const enemiesWeaknesses = await db
    .select({
      slash: metaphorEnemyStats.slash,
      pierce: metaphorEnemyStats.pierce,
      strike: metaphorEnemyStats.strike,
      fire: metaphorEnemyStats.fire,
      ice: metaphorEnemyStats.ice,
      elec: metaphorEnemyStats.elec,
      wind: metaphorEnemyStats.wind,
      light: metaphorEnemyStats.light,
      dark: metaphorEnemyStats.dark,
      almighty: metaphorEnemyStats.almighty,
    })
    .from(metaphorEnemyStats)
    .where(eq(metaphorEnemyStats.enemyName, enemyName));

  // when no enemies are found in db, return empty array
  if (enemiesWeaknesses.length === 0) {
    return [];
  }

  // otherwise, return array of objects containing enemy weaknesses
  return enemiesWeaknesses;
}
