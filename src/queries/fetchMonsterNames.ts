import {
  db,
  metaphorEnemyStats,
  p3eEnemyStats,
  p3rEnemyStats,
  p4EnemyStats,
  p5EnemyStats,
} from "../drizzleconfig.js";
import { AtlusGame } from "../enums.js";

/***/

function getDBTable(game: AtlusGame): any {
  // change return type
  switch (game) {
    case AtlusGame.Metaphor:
      return metaphorEnemyStats;
    case AtlusGame.Persona3ReloadAigis:
      return p3eEnemyStats;
    case AtlusGame.Persona3Reload:
      return p3rEnemyStats;
    case AtlusGame.Persona4Golden:
      return p4EnemyStats;
    case AtlusGame.Persona5Royal:
      return p5EnemyStats;
  }
}

export async function fetchMonsterNames(game: AtlusGame) {
  let enemiesStats;

  let table = getDBTable(game);

  enemiesStats = await db
      .selectDistinct({
        name: table.enemyName,
      })
      .from(table);

  return enemiesStats;
}
