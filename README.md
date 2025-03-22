# Atlus-Discord-Bot Project

## A TypeScript-Powered Discord bot for discovering enemy weaknesses in Atlus Games

Atlus Navigator is designed to help players quickly identify the weaknesses of enemies in popular Atlus RPGs, including Persona 3 Reload (and Episode Aigis), Persona 4 Golden, Persona 5 Royal, and Metaphor: ReFantazio. Instead of searching through multiple tabs or wikis to find enemy weaknesses, simply tell the bot the game and enemy you're facing, and it will provide a detailed weakness chart. Plan your strategy in advance or uncover unexpected vulnerabilities mid-battle, all without leaving Discord!

## Watch the video below to see Atlus Navigator in action!

Click the image below to watch the demo on YouTube. *(Right-click → "Open link in new tab" for best experience!)*  

[![Atlus Navigator Demo](https://img.youtube.com/vi/i62492cbECA/maxresdefault.jpg)](https://youtu.be/i62492cbECA)

## How to add Atlus Navigator to your Discord Server

Click the link below to invite the bot to your server. You’ll be redirected to Discord, where you can choose a server and grant the necessary permissions.<br>

👉 Invite [Atlus Navigator](https://github.com/Momen-j)!

⭐ If you enjoy using the bot, consider rating it on [discordbotlist.com](https://discordbotlist.com/) & [Top.gg](https://top.gg/)! (add the bot to these sites)

## How to run this project for your own uses (or to potentially help me 👀)

### Prerequisites
* Install Node v20
* Install [Docker](https://docs.docker.com/engine/install/) 
* Get a **Discord bot token** through the [Discord Developer Portal](https://discord.com/developers/)

### Build Guide
1. Clone the project repository. 
2. Run `npm install` to install the necessary dependencies.
3. Create a `.env` file in the project's root directory and add an environment variable representing the Discord bot token value (ex. `DISCORD_BOT_TOKEN = XXX`).
4. If you want to change the default database credentials, modify the values in `x-db-env` within `docker-compose.yml`. These credentials will be used by the Postgres container when it starts.
5. Run `docker compose build`.

## Find a bug?

You can report a bug by either using ```/feedback``` in Discord or submitting an issue on GitHub with a detailed description of the problem.

## Credits

* GitHub user [aqiu384](https://github.com/aqiu384/aqiu384.github.io) for the [Persona Game Data](https://aqiu384.github.io/megaten-fusion-tool/home)
* Garrett Haines for the [Metaphor: Refantazio Game Data](https://docs.google.com/spreadsheets/d/1FDC6T6tr__-AU18tY--4-ZUSzkeaMM_Kg_Crqu6VrcM/edit?pli=1&gid=2052374500#gid=2052374500)

## Like this project?

If you're feeling generous, buy me a coffee! - https://buymeacoffee.com/momojo

