import { eq } from "drizzle-orm";
import { db, p3rEnemyStats } from "../drizzleconfig.js";

//! grabs enemy stats outside of their weaknesses
export async function fetchP3EnemyStats(enemyName: string) {
  try {
    const enemiesStats = await db
      .select({
        level: p3rEnemyStats.level,
        hp: p3rEnemyStats.hp,
        appears: p3rEnemyStats.appears,
      })
      .from(p3rEnemyStats)
      .where(eq(p3rEnemyStats.enemyName, enemyName));

    return enemiesStats;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
