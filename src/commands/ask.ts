import type { ChatInputCommandInteraction } from 'discord.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import UnicoClient from 'unico-js';
import dotenv from 'dotenv';

dotenv.config();

const command = {
	name: 'ask',
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('Replies with the response to the query!')
		.addStringOption((option) =>
			option.setName('agent').setDescription('Id of the agent in your UNICO account.').setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('query').setDescription('Query for the specified agent.').setRequired(true)
		)
		.addStringOption((option) =>
			option.setName('unico-api-key').setDescription('Your UNICO API key. You can specify it to access to your agents.').setRequired(false)
		),
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});

		try {
			const agentId = interaction.options.getString('agent');
			const query = interaction.options.getString('query');
			const unicoApiKey = interaction.options.getString('unico-api-key');

			if (!agentId || !query) {
				interaction.editReply('agent and query cannot be empty.');
				return;
			}

			if (isNaN(Number(agentId))) {
				interaction.editReply('Agent ID must be a number.');
				return;
			}

			const client = new UnicoClient(unicoApiKey ?? process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);
			const completion = await client.agents.completions.create(Number(agentId), query);

			interaction.editReply(`**Agent ${agentId}**: ${completion.text}`);
		} catch (error: unknown) {
			console.error(error);

			if (error instanceof Error) {
				interaction.editReply(error.message);
				return;
			}

			interaction.editReply('An unknown error occurred. If the error persists, please contact UNICO support.');
		}
	},
};

export = command;
