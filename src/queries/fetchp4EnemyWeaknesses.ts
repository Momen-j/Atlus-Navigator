import { eq } from "drizzle-orm";
import { db, p4EnemyStats } from "../drizzleconfig.js";

//! Returns an object where keys represent the element type
//! and the values are the enemy's reaction to the element
export async function fetchP4EnemyWeaknesses(enemyName: string) {
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
