import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

//! Create connection to the DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle(pool);

// Define tables
export const metaphorEnemyStats = pgTable("metaphor_enemy_stats", {
  id: serial("id").primaryKey(), // Auto-incrementing ID remains the same
  enemyName: text("Enemy Name").notNull(), // Enemy name is required
  level: text("level"), // Text type for level (even if it's numeric data)
  hp: text("hp"),
  mp: text("mp"),
  strength: text("strength"),
  magic: text("magic"),
  endurance: text("endurance"),
  agility: text("agility"),
  luck: text("luck"),
  slash: text("slash"),
  pierce: text("pierce"),
  strike: text("strike"),
  fire: text("fire"),
  ice: text("ice"),
  elec: text("elec"),
  wind: text("wind"),
  light: text("light"),
  dark: text("dark"),
  almighty: text("almighty"),
});

export const p3rEnemyStats = pgTable("p3_enemies", {
  id: serial("id").primaryKey(), // Auto-incrementing ID remains the same
  race: text("race").notNull(),
  level: text("level"), // Text type for level (even if it's numeric data)
  enemyName: text("name").notNull(), // Enemy name is required
  hp: text("hp"),
  mp: text("mp"),
  slash: text("sword"),
  strike: text("strike"),
  pierce: text("gun"),
  fire: text("fire"),
  ice: text("ice"),
  elec: text("elec"),
  wind: text("wind"),
  light: text("light"),
  dark: text("dark"),
  almighty: text("almighty"),
  drops: text("drops"),
  appears: text("appears"),
});

export const p3eEnemyStats = pgTable("p3e_enemies", {
  id: serial("id").primaryKey(), // Auto-incrementing ID remains the same
  race: text("race").notNull(),
  level: text("level"), // Text type for level (even if it's numeric data)
  enemyName: text("name").notNull(), // Enemy name is required
  hp: text("hp"),
  mp: text("mp"),
  slash: text("sword"),
  strike: text("strike"),
  pierce: text("gun"),
  fire: text("fire"),
  ice: text("ice"),
  elec: text("elec"),
  wind: text("wind"),
  light: text("light"),
  dark: text("dark"),
  almighty: text("almighty"),
  drops: text("drops"),
  appears: text("appears"),
});

export const p4EnemyStats = pgTable("p4_enemies", {
  id: serial("id").primaryKey(), // Auto-incrementing ID remains the same
  race: text("race").notNull(),
  level: text("level"), // Text type for level (even if it's numeric data)
  enemyName: text("name").notNull(), // Enemy name is required
  hp: text("hp"),
  mp: text("mp"),
  phys: text("phys"),
  fire: text("fire"),
  ice: text("ice"),
  elec: text("elec"),
  wind: text("wind"),
  light: text("light"),
  dark: text("dark"),
  almighty: text("almighty"),
  drops: text("drops"),
  appears: text("appears"),
});

export const p5EnemyStats = pgTable("p5_enemies", {
  id: serial("id").primaryKey(), // Auto-incrementing ID remains the same
  race: text("race").notNull(),
  level: text("level"), // Text type for level (even if it's numeric data)
  enemyName: text("name").notNull(), // Enemy name is required
  hp: text("hp"),
  mp: text("mp"),
  phys: text("phys"),
  gun: text("gun"),
  fire: text("fire"),
  ice: text("ice"),
  elec: text("elec"),
  wind: text("wind"),
  psychic: text("psychic"),
  nuke: text("nuke"),
  light: text("light"),
  dark: text("dark"),
  almighty: text("almighty"),
  drops: text("drops"),
  appears: text("appears"),
});