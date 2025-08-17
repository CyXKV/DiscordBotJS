import { Client, GatewayIntentBits, WebhookClient, EmbedBuilder  } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
	});
client.login(process.env.TOKEN);
const shortswebhook = new WebhookClient({ url: process.env.SHORTS_WEBHOOK });
const imagewebhook = new WebhookClient({ url: process.env.IMAGE_WEBHOOK });

export async function watcher(){
	client.on('messageCreate', async message => {
		if(message.author.bot) return;
		if(message.content.includes("www.youtube.com") || message.content.includes("youtu.be") || message.content.includes("vk.com")){
			if(message.channel.id == process.env.SHORTS_CHANNEL_ID) return;
			await shortswebhook.send({
				content: message.content,
				username: message.member.nickname,
				avatarURL: message.author.displayAvatarURL(),
				files: [...message.attachments.values()],
			});
			await message.delete();
		}
		if(message.attachments.size > 0){
			for (const attachment of message.attachments.values()){
				if(attachment.contentType.startsWith("image/")) {
					if(message.channel.id == process.env.IMAGE_CHANNEL_ID) return;
					await imagewebhook.send({
						content: message.content,
						username: message.member.nickname,
						displaycolor: message.member.displayColor,
						avatarURL: message.author.displayAvatarURL(),
						files: [...message.attachments.values()],
					})
					await message.delete();
				}
			}
		}


		})
}