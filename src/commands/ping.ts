import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';

const command = {
	name: 'ping',
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const botLatency = Date.now() - interaction.createdTimestamp;
		await interaction.reply('Pong! The bot has found ' + botLatency + 'ms (' + interaction.user.username + ')');
	},
};

export = command;
