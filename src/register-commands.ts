import dotenv from "dotenv";
import { ApplicationCommandOptionType, REST, Routes } from "discord.js";
dotenv.config();

const commands = [
  {
    name: "embedder",
    description: "returns an embed",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");

    const response = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands registered 🍭");
  } catch (error) {
    console.error("Error registering slash commands:", error);
  }
})();
