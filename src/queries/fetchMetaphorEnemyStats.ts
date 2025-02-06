import { eq } from "drizzle-orm";
import { db, metaphorEnemyStats } from "../drizzleconfig.js";

//! grabs enemy stats outside of their weaknesses
export async function fetchEnemyStats(enemyName: string) {
  try {
    const enemiesStats = await db
      .select({
        level: metaphorEnemyStats.level,
        hp: metaphorEnemyStats.hp,
      })
      .from(metaphorEnemyStats)
      .where(eq(metaphorEnemyStats.enemyName, enemyName));

    return enemiesStats;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
