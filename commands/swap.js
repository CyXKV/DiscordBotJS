import { SlashCommandBuilder, PermissionFlagsBits, Client, GatewayIntentBits, ChannelType } from 'discord.js'
import { swapMembers } from '../interactions/swapinteraction.js';
import dotenv from "dotenv";
	dotenv.config();

	const client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
	});

	client.login(process.env.TOKEN);

export const data = new SlashCommandBuilder()
        .setName('swap')
        .setDescription('Перемещает пользователя до пробуждения')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Кого переместить')
                .setRequired(true))
										.addIntegerOption(option =>
											option.setName('count')
												.setDescription('Сколько раз переместить')
												.setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers);

    export async function execute(interaction) {
				let count = interaction.options.getInteger('count');
        const member = interaction.options.getMember('user');
				const channel = member.voice.channel;
				if(count > 10){
					return interaction.reply({ content: 'Максимум 10 раз!', ephemeral: true });
				}
				if(member.voice.channel == null){
					return interaction.reply({ content: 'Пользователь не в голосовом канале!', ephemeral: true });
				}
				await interaction.reply({ content: 'Начинаю перемещение...', ephemeral: true });
				swapMembers(member, channel, count);
    }