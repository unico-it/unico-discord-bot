import type { ChatInputCommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { SlashCommandBuilder, PermissionsBitField, MessageFlags } from 'discord.js';
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
		const user: GuildMember = await interaction.guild!.members.fetch(interaction.user.id);
		const permission: boolean = user.permissions.has(
			PermissionsBitField.Flags.Administrator || PermissionsBitField.Flags.ManageChannels
		);

		if (!permission) {
			interaction.reply({
				content: 'You do not have the needed permission to use this command!',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const channel: TextChannel = interaction.guild!.channels.cache.get(staffTicketChannel) as TextChannel;
		if (channel.topic === 'Channel Closed') {
			await interaction.reply({
				content: '🔴 The channel is already closed.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		channel.setTopic('Channel Closed');
		interaction.reply({
			content: 'Ticket channel closed',
			flags: MessageFlags.Ephemeral,
		});
	},
};

export = command;
