import { db, metaphorEnemyStats, p3eEnemyStats } from "../drizzleconfig.js";
import { MetaphorEnemyStats } from "src/interfaces.js";

/***/

export async function fetchMonsterNames(gameName) {
  let enemiesStats;

  if (gameName === 'metaphor') {
    enemiesStats = await db
    .selectDistinct({
      name: metaphorEnemyStats.enemyName,
    })
    .from(metaphorEnemyStats);
  }
  
  if (gameName === 'p3-aigis') {
    enemiesStats = await db
    .selectDistinct({
      name: p3eEnemyStats.enemyName,
    })
    .from(p3eEnemyStats);
  }

  return enemiesStats;
}
