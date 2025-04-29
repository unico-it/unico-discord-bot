import { SlashCommandBuilder } from 'discord.js';
import { UnicoChatClient } from '../Unico/unico';
import dotenv from "dotenv"
dotenv.config()
module.exports = {
	name: "ask",
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('Replies with the response to the query!')
		.addStringOption(option => option
			.setName("agent")
			.setDescription("Name of the agent in your unico account.")
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName("question")
			.setDescription("Question for the specified agent.")
			.setRequired(true)
		),
	async execute(interaction: any) {
		await interaction.deferReply();
		const ask_unico = new UnicoChatClient();
		const res = await ask_unico.askCompletion(interaction.options.getString("agent"), interaction.options.getString("question") as string)
		interaction?.editReply('Question Response (' + interaction?.user?.username + '):' + '\n' + res);

	},
};
