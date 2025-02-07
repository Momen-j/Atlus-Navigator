import { eq } from "drizzle-orm";
import { db, p3eEnemyStats } from "../drizzleconfig.js";

//! grabs enemy stats outside of their weaknesses
export async function fetchP3E_EnemyStats(enemyName: string) {
  try {
    const enemiesStats = await db
      .select({
        level: p3eEnemyStats.level,
        hp: p3eEnemyStats.hp,
        appears: p3eEnemyStats.appears,
      })
      .from(p3eEnemyStats)
      .where(eq(p3eEnemyStats.enemyName, enemyName));

    return enemiesStats;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
