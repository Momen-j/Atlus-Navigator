import { eq } from "drizzle-orm";
import { db, p5EnemyStats } from "../drizzleconfig.js";

//! grabs enemy stats outside of their weaknesses
export async function fetchP5EnemyStats(enemyName: string) {
  try {
    const enemiesStats = await db
      .select({
        level: p5EnemyStats.level,
        hp: p5EnemyStats.hp,
        appears: p5EnemyStats.appears,
      })
      .from(p5EnemyStats)
      .where(eq(p5EnemyStats.enemyName, enemyName));

    return enemiesStats;
  } catch (error) {
    console.log(`There was an error querying the DB: ${error}`);
    return [];
  }
}
