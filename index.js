import fs from 'fs';
import { Collection, Client, GatewayIntentBits } from 'discord.js'
import dotenv from "dotenv";
import { watcher } from "./actions/channelwatcher.js";

dotenv.config();

const client = new Client({
			intents: [GatewayIntentBits.Guilds]
	});
client.commands = new Collection();
client.login(process.env.TOKEN);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles){
  const command = await import (`./commands/${file}`);
  client.commands.set(command.data.name, {  data: command.data, execute: command.execute });
}


client.once('ready', async () => {
    for (const command of client.commands.values()) {
        try {
            await client.application.commands.create(command.data.toJSON(), process.env.GUILD_ID);
            console.log(`Команда /${command.data.name} зарегистрирована!`);
        } catch (err) {
            console.error(`Ошибка при регистрации /${command.data.name}:`, err);
        }
    }
    console.log(`${client.user.tag} запущен!`);
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = await client.commands.get(interaction.commandName);

  if (!command) return;

  try{
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

watcher()