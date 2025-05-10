import type { ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { SlashCommandBuilder, PermissionsBitField } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const staffTicketChannel = process.env.DISCORD_STAFF_TICKET_CHANNEL;

if (!staffTicketChannel) {
	throw Error('You have not set the staff channel.');
}

const command = {
	name: 'lock-ticket-channel',
	data: new SlashCommandBuilder().setName('lock-ticket-channel').setDescription('Lock ticket channel.'),
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const permission = (await interaction.guild?.members.fetch(interaction.user.id))!.permissions.has(
			PermissionsBitField.Flags.Administrator || PermissionsBitField.Flags.ManageChannels
		);
		if (!permission) {
			interaction.reply('You do not have the needed permission to use this command!');
			return;
		}

		const channel: TextChannel = interaction.guild!.channels.cache.get(staffTicketChannel) as TextChannel;
		if (channel.topic === 'Channel Closed') {
			await interaction.reply('🔴 The channel is already closed.');
			return;
		}

		channel.setTopic('Channel Closed');
		interaction.reply('Ticket channel closed');
	},
};

export = command;
