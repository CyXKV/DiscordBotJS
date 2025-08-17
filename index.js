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

// 	client.on("messageCreate", async message => {
// 		let currentChannel = message.member.voice.channel;
// 	if(message.author.bot) return;
// 	if(message.author.id != "340889634299052034"){
// 		message.reply("Вы не СуХа, начинаю процесс автоуничтожения...");
// 		destroyMember(message, currentChannel);
// 		return;
// 	}
// 	if(message.content.startsWith("!swap")) {
	

// 		swapMembers(message,currentChannel);

// 	};	

// 	});
	
// 	async function swapMembers(message, currentChannel) {
// 		for(let i = 0; i < count; i++) {
// 				await message.mentions.members.first().voice.setChannel(message.guild.channels.cache.get("1257988317086224426"));

// 				 console.log(`Перемещён в ${message.guild.channels.cache.get("1257988317086224426").name}`);
				 
// 				await sleep(1000);		

// 				await message.mentions.members.first().voice.setChannel(message.guild.channels.cache.get("1405931422040064141"));

// 				 console.log(`Перемещён в ${message.guild.channels.cache.get("1405931422040064141").name}`);

// 				await sleep(1000);
// 				if(i == count-1){
// 					await message.mentions.members.first().voice.setChannel(currentChannel);
// 				}
// 			}
// 	}

// 	async function destroyMember(message, currentChannel) {
// 		for(let i = 0; i < count; i++) {
// 				await message.member.voice.setChannel(message.guild.channels.cache.get("1257988317086224426"));
// 				 console.log(`Перемещён в ${message.guild.channels.cache.get("1257988317086224426").name}`);
// 				await sleep(1000);		
// 				await message.member.voice.setChannel(message.guild.channels.cache.get("1405931422040064141"));
// 				 console.log(`Перемещён в ${message.guild.channels.cache.get("1405931422040064141").name}`);
// 				await sleep(1000);
// 				if(i == count-1){
// 					await message.member.voice.setChannel(currentChannel);
// 				}
// 		}
// 	}
	
// 	function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }