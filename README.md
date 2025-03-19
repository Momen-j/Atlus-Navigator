# Atlus-Discord-Bot Project

## A TypeScript-Powered Discord bot for discovering enemy weaknesses in Atlus Games

The Atlus Games Discord Bot is designed to help players quickly identify the weaknesses of enemies in popular Atlus RPGs, including Persona 3 Reload (including Episode Aigis), Persona 4 Golden, Persona 5 Royal, and Metaphor: ReFantazio. Instead of searching through multiple tabs or wikis to find enemy weaknesses, simply tell the bot the game and enemy you're facing, and it will provide a detailed weakness chart. Plan your strategy in advance or uncover unexpected vulnerabilities mid-battle, all without leaving Discord!

## Watch the video to get a feeling of how the Atlus Games Discord bot works!

Has this ever happened to you? -> (Last time before save: 2 hours maybe) Video will be a party from metaphor/persona walking up to an enemy they haven't seen before and completely getting deflected by a move killing the protag. 

NOW INTRODUCING The Atlus Games discord bot where you simply type in the name of the game and the enemy and you'll never run into a situation like that again. Show a seal of approval then the logo of the bot (link in description)

## How to add the Atlus Games bot to your Discord Server

Click this link and you should get directed to Discord with the app asking for permission to add the bot to a server of your choosing.<br>
Be sure to rate the bot on these sites [discordbotlist.com](https://discordbotlist.com/) & [Top.gg](https://top.gg/) (add the bot to these sites)

## How to run this project for your own uses (or to potentially help me 👀)

1. Clone the project repository.
2. Install the version of Node the project was built on (v. 20.15.0). You can use nvm (Node Version Manager) to install and switch to the recommended version of Node.
3. Run npm install to install the necessary dependencies.
```
npm install
```
4. Create a ```.env``` file in the project's root directory and add the required values into the file (TOKEN being the discord bot token). 
```
TOKEN = XXX
DATABASE_URL = XXX
```
5. Adjust the ```docker-compose.yml``` file to use your database credentials.
6. Run the below docker command in order to start the bot. If you don't have docker installed, download it using the [official guide](https://docs.docker.com/engine/install/).   
```
docker compose up -d --build
``` 

## Find a bug?

You can report a bug by either using ```/feedback``` in Discord or submitting an issue on GitHub with a detailed description of the problem.

## Credits

* GitHub user [aqiu384](https://github.com/aqiu384/aqiu384.github.io) for the [Persona Game Data](https://aqiu384.github.io/megaten-fusion-tool/home)
* Garrett Haines for the [Metaphor: Refantazio Game Data](https://docs.google.com/spreadsheets/d/1FDC6T6tr__-AU18tY--4-ZUSzkeaMM_Kg_Crqu6VrcM/edit?pli=1&gid=2052374500#gid=2052374500)

## Like this project?

If you're feeling generous, buy me a coffee! - https://buymeacoffee.com/momojo

