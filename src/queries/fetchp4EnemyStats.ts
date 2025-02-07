import { eq } from "drizzle-orm";
import { db, p4EnemyStats } from "../drizzleconfig.js";

//! grabs enemy stats outside of their weaknesses
export async function fetchP4EnemyStats(enemyName: string) {
  try {
    const enemiesStats = await db
      .select({
        level: p4EnemyStats.level,
        hp: p4EnemyStats.hp,
        appears: p4EnemyStats.appears,
      })
      .from(p4EnemyStats)
      .where(eq(p4EnemyStats.enemyName, enemyName));

    return enemiesStats;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
