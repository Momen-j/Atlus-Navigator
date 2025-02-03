import { eq } from "drizzle-orm";
import { db, metaphorEnemyStats } from "../drizzle.config";

//! Returns an object where keys represent the element type
//! and the values are the enemy's reaction to the element
export async function fetchEnemyWeaknesses(enemyName: string) {
  try {
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

    return enemiesWeaknesses;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
