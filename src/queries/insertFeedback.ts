import { db, feedback } from "../drizzleconfig.js";

/**
 * Inserts feedback into the database.
 * @memberof DatabaseQueries
 * @async
 * @param {string} description The feedback description submitted by the user.
 * @returns {Promise<void>} A promise that resolves once the insertion is complete.
 * @throws {Error} Throws an error if there is a database connection issue or insertion failure.
 */
export async function insertFeedback(description: string): Promise<void> {
  await db.insert(feedback).values({
    description,
  });
}
