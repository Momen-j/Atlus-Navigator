import { eq } from "drizzle-orm";
import { db, p3eEnemyStats } from "../drizzleconfig.js";

//! Returns an object where keys represent the element type
//! and the values are the enemy's reaction to the element
export async function fetchP3E_EnemyWeaknesses(enemyName: string) {
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
