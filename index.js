import { Client } from "discord.js";
import {
	NoSubscriberBehavior,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	entersState,
	AudioPlayerStatus,
	VoiceConnectionStatus,
	joinVoiceChannel,
    PlayerSubscription,
} from '@discordjs/voice';

import dotenv from "dotenv";
dotenv.config();
import {isLink, isInChannel, isDuration} from "./validate.js";

import pkg from 'yt-stream';
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"] });
const songQuery = [];
var isConnected = false;

client.on('messageCreate', async (message) => {
    try{
    if (message.author.bot) return;
    const args = message.content.split(' ');
    if (args[0].toLowerCase() === '!play') {
        const channel = message.member.voice.channel;
		    if(!isLink(args[1])) {
			    message.reply('Вставь ссылку!');
                message.delete();
			    return;
		    }
            if (!isInChannel(channel)) {
                message.reply('Сначало зайди в один из каналов');
                message.delete();
                return;
            }
            if(!pkg.validateVideoURL(args[1])) {
                message.reply('Ссылка не является ютубной!');
                message.delete();
                return;
            }
		const songInfo = await pkg.getInfo(args[1])
            if(isDuration(songInfo.duration)){
                await message.reply('Слишком большая длительность!');
                message.delete();
                return;
            }
            songQuery.unshift(args[1]);
            if(isConnected){
                await message.reply(`Добавлено в очередь: ${songInfo.title}`);
                message.delete();
                return;
            }
            await message.reply(`Сейчас играет: ${songInfo.title}`);
		    message.delete();
            StartPlayer(message.member.voice.channel, message.guild.id, message.guild.voiceAdapterCreator);
    }
    if(args[0].toLowerCase() == "!query"){
        var tempSongsNames = [];
        if(songQuery.length == 0){
            await message.reply("Список пуст");
            message.delete();
            return;
        }
        for(var i = 0;i< songQuery.length;i++){
            const songInfo = await pkg.getInfo(songQuery[i])
            tempSongsNames.push(songInfo.title);
        }

        await message.reply("Список песен:\n" + tempSongsNames.reverse().join("\n"))
        message.delete();
    }
    }catch(err) {
        await message.reply("Ошибка: " + err);
        message.delete();
        return;
    }
});

async function StartPlayer(channelId, guildId, voiceAdapterCreator) {
    const connection = joinVoiceChannel({
        channelId: channelId.id,
        guildId: guildId,
        adapterCreator: voiceAdapterCreator,
    });

        const player = createAudioPlayer();
        Play(connection,player);
}
async function Play(connection,player) {
    if(isConnected == false){
        const songUrl = songQuery.pop();
        const stream = await pkg.stream(songUrl, {
            quality: 'high',
            type: 'audio',
            highWaterMark: 1048576 * 32,
            download: true
        })
        const resource = createAudioResource(stream.stream);
        player.play(resource);
        connection.subscribe(player);
        isConnected = true;
    }
    player.on(AudioPlayerStatus.Idle, async () => {
        if(songQuery.length > 0){
            const songUrl = songQuery.pop();
            const stream = await pkg.stream(songUrl, {
                quality: 'high',
                type: 'audio',
                highWaterMark: 1048576 * 32,
                download: true
            })
            const resource = createAudioResource(stream.stream);
            player.play(resource);
            connection.subscribe(player);
        }else{
            player.stop();
            connection.disconnect();
            isConnected = false;
        }
    });
}
client.on('ready', () => {
		console.log('Ready!');
}); 

client.login(process.env.DISCORD_TOKEN);
