import { ApplicationCommandOptionType } from "discord.js";

export interface CommandOption {
  name: string; // The name of the option (e.g., "monster-name")
  description: string; // A brief description of the option
  type: ApplicationCommandOptionType; // The type of the option (e.g., String, Integer, etc.)
  required: boolean; // Whether the option is required
  autocomplete?: Boolean;
}

export interface SlashCommand {
  name: string; // The name of the slash command
  description: string; // The description of the slash command
  options: CommandOption[]; // Array of options that the command accepts
  callback: (client: any, interaction: any) => Promise<void>; // The callback function that is executed when the command is run
  // optional fields below 
  // question marks indicate optional fields
  deleted?: Boolean; 
  autocomplete?: Boolean;
  devOnly?: Boolean;
  testOnly?: Boolean;
  permissionsRequired?: bigint[]; // Array of strings
  botPermissions?: bigint[]; // Array of strings
}

export interface MetaphorEnemyWeaknesses {
  slash: string;
  pierce: string;
  strike: string;
  fire: string;
  ice: string;
  elec: string;
  wind: string;
  light: string;
  dark: string;
  almighty: string;
}

export interface MetaphorEnemyStats {
  level: string;
  hp: string;
}

export interface P3EnemyWeaknesses {
  slash: string;
  pierce: string;
  strike: string;
  fire: string;
  ice: string;
  elec: string;
  wind: string;
  light: string;
  dark: string;
  almighty: string;
}

export interface P3EnemyStats {
  level: string;
  hp: string;
  appears: string;
}

export interface P4EnemyWeaknesses {
  phys: string;
  fire: string;
  ice: string;
  elec: string;
  wind: string;
  light: string;
  dark: string;
  almighty: string;
}

export interface P4EnemyStats {
  level: string;
  hp: string;
  appears: string;
}

export interface P5EnemyWeaknesses {
  phys: string;
  gun: string;
  fire: string;
  ice: string;
  elec: string;
  wind: string;
  psy: string;
  nuke: string;
  light: string;
  dark: string;
  almighty: string;
}

export interface P5EnemyStats {
  level: string;
  hp: string;
  appears: string;
}