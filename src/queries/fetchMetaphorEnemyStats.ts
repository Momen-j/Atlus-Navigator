import { eq } from "drizzle-orm";
import { db, metaphorEnemyStats } from "../drizzleconfig.js";
import { MetaphorEnemyStats } from "src/metaphorInterface.js";

//! grabs enemy stats outside of their weaknesses
export async function fetchEnemyStats(enemyName: string): Promise<MetaphorEnemyStats[]> {
    const enemiesStats = await db
      .select({
        level: metaphorEnemyStats.level,
        hp: metaphorEnemyStats.hp,
      })
      .from(metaphorEnemyStats)
      .where(eq(metaphorEnemyStats.enemyName, enemyName));

    return enemiesStats;
  } 
