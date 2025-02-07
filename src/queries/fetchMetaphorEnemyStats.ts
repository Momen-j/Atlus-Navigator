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
  } catch (error: any) {
    if (error.message.includes("ECONNREFUSED")) {
      throw new Error("Database connection failed.");
    }
    if (error.message.includes("timeout")) {
      throw new Error("Database query timed out.");
    }
    throw new Error("Unexpected database error.");
  }
}
