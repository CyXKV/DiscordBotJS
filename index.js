import { Collection, Client, GatewayIntentBits } from 'discord.js'
import { data, execute } from './commands/swap.js'
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
			intents: [GatewayIntentBits.Guilds]
	});
client.commands = new Collection();
client.commands.set(data.name, { data, execute });
client.login(process.env.TOKEN);

client.once('ready', async () => {
    console.log("once")
    for (const command of client.commands.values()) {
        console.log("for")
        try {
            console.log("try")
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

  if (interaction.commandName === 'swap') {
    await execute(interaction); // твоя функция
  }
});

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