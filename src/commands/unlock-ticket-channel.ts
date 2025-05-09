import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel, PermissionsBitField } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const command = {
	name: "unlock-ticket-channel",
	data: new SlashCommandBuilder().setName("unlock-ticket-channel").setDescription("Unlock ticket channel."),
	async execute(interaction: ChatInputCommandInteraction) {
		let permission = (await interaction.guild?.members.fetch(interaction.user.id))!.permissions.has(
			PermissionsBitField.Flags.Administrator || PermissionsBitField.Flags.ManageChannels
		);

		if (!permission) {
			interaction.reply("You do not have the needed permission to use this command!");
			return;
		}

		const staffTicketChannel = process.env.DISCORD_STAFF_TICKET_CHANNEL;

		if (!staffTicketChannel) {
			throw Error("You have not set the staff channel.");
		}

		const channel: TextChannel = interaction.guild!.channels.cache.get(staffTicketChannel) as TextChannel;
		if (channel.topic == "Channel Opened") {
			await interaction.reply("🔴 The channel is already Open.");
			return;
		}

		channel.setTopic("Channel Opened");
		interaction.reply("Ticket channel open");
	},
};

export = command;
