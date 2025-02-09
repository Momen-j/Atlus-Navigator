import { eq } from "drizzle-orm";
import { db, p5EnemyStats } from "../drizzleconfig.js";
import { P5EnemyWeaknesses } from "src/interfaces.js";

/**
 * Fetches the weaknesses of a Persona 5 Royal shadow from the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} enemyName The name of the enemy given by the user.
 * @returns {Promise<P5EnemyWeaknesses[]>} A promise that resolves to an array of objects containing elements as keys and enemy weaknesses/reactions as values
 * If the enemy is not found, the array will be empty.
 * @throws {Error} Throws an error if there is a database connection issue or a query failure.
 * @example export interface P5EnemyWeaknesses {
  phys: string;
  gun: string;
  fire: string;
  ice: string;
  elec: string;
  wind: string;
  psy: string;
  nuke: string;
  light: string;
  dark: string;
  almighty: string;
}
 */

export async function fetchP5EnemyWeaknesses(
  enemyName: string
): Promise<P5EnemyWeaknesses[]> {
  try {
    const enemiesWeaknesses = await db
      .select({
        phys: p5EnemyStats.phys,
        gun: p5EnemyStats.gun,
        fire: p5EnemyStats.fire,
        ice: p5EnemyStats.ice,
        elec: p5EnemyStats.elec,
        wind: p5EnemyStats.wind,
        psy: p5EnemyStats.psychic,
        nuke: p5EnemyStats.nuke,
        light: p5EnemyStats.light,
        dark: p5EnemyStats.dark,
        almighty: p5EnemyStats.almighty,
      })
      .from(p5EnemyStats)
      .where(eq(p5EnemyStats.enemyName, enemyName));

    return enemiesWeaknesses;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
