import { eq } from "drizzle-orm";
import { db, p3rEnemyStats } from "../drizzleconfig.js";

//! Returns an object where keys represent the element type
//! and the values are the enemy's reaction to the element
export async function fetchP3EnemyWeaknesses(enemyName: string) {
  try {
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

    return enemiesWeaknesses;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
