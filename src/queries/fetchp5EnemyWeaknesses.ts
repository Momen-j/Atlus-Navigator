import { eq } from "drizzle-orm";
import { db, p5EnemyStats } from "../drizzleconfig.js";

//! Returns an object where keys represent the element type
//! and the values are the enemy's reaction to the element
export async function fetchP5EnemyWeaknesses(enemyName: string) {
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
