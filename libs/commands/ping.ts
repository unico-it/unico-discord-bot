import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

const command = {
	name: "ping",
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply("Pong! (" + interaction.user.username + ")");
	},
};

export = command;
