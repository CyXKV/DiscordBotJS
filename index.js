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
} from '@discordjs/voice';

import pkg from 'yt-stream';
const client = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"] });

client.on('messageCreate', async (message) => {
    try{
    if (message.author.bot) return;
    const args = message.content.split(' ');
    if (args[0].toLowerCase() === '!play') {
        const channel = message.member.voice.channel;
				if(args[1] === undefined) {
					message.reply('Вставь ссылку!');
					return;
				}
        if (!channel) {
            message.reply('Сначало зайди в один из каналов');
            return;
        }
        if(!pkg.validateVideoURL(args[1])) {
                    message.reply('Ссылка не является ютубной!');
                    return;
        }
        const stream = await pkg.stream(args[1], {
            quality: 'high',
            type: 'audio',
            highWaterMark: 1048576 * 32,
            download: true
        })
				const songInfo = await pkg.getInfo(args[1])
                if(songInfo.duration / 1000 > 600){
                    await message.reply('Слишком большая длительность!');
                    message.delete();
                    return;
                }
				await message.reply(`Сейчас играет: ${songInfo.title}`);
				message.delete();
        const connection = await joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(stream.stream);

        player.play(resource);

        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            connection.disconnect();
        });
    }


    if (args[0].toLowerCase() === '!search') {
        const channel = message.member.voice.channel;
				if(args[1] === undefined) {
					message.reply('Вставь ссылку!');
					return;
				}
        if (!channel) {
            message.reply('Сначало зайди в один из каналов');
            return;
        }
        const results = await pkg.search(args.join());
        const stream = await pkg.stream(results[0].url, {
            quality: 'high',
            type: 'audio',
            highWaterMark: 1048576 * 32,
            download: true
        });
				const songInfo = await pkg.getInfo(results[0].url)
				await message.reply(`Сейчас играет: ${songInfo.title}`);
				message.delete();

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(stream.stream);

        player.play(resource);

        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            connection.disconnect();
        });
    }
    if(args[0].toLowerCase() == "!help"){
        message.reply("Список команд: !play - ссылку, !search - просто поиск");
        message.delete();
    }
}catch(err) {
    await message.reply("Ошибка: " + err);
    message.delete();
    return;
}
});

client.on('ready', () => {
		console.log('Ready!');
}); 

client.login("Enter token here");
