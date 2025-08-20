import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import UnicoClient from 'unico-js';
import type { Agent, Completion } from 'unico-js';
import dotenv from 'dotenv';

dotenv.config();

let serverAgents: Agent[] = [];

async function preloadAgents(): Promise<void> {
	try {
		const client = new UnicoClient(process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);
		serverAgents = await client.agents.retrieve();
		console.log(`Preloaded ${serverAgents.length} agents`);
	} catch (error) {
		console.error('Failed to preload agents:', error);
		serverAgents = [];
	}
}

preloadAgents();

const command = {
	name: 'ask',
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('Replies with the response to the query!')
		.addStringOption((option) =>
			option
				.setName('agent')
				.setDescription(
					'Agent ID in UNICO. Autocomplete shows server agents, \
			enter ID manually if using your API key.'
				)
				.setRequired(true)
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option.setName('query').setDescription('Query for the specified agent.').setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('unico-api-key')
				.setDescription('Your UNICO API key. You can specify it to access to your agents.')
				.setRequired(false)
		),
	async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
		const focusedValue = interaction.options.getFocused();

		const filtered = serverAgents.filter(
			(agent) =>
				agent.name.toLowerCase().includes(focusedValue.toLowerCase()) || String(agent.id).includes(focusedValue)
		);

		await interaction.respond(
			filtered.slice(0, 25).map((agent) => ({
				name: `${agent.name} (${agent.id})`,
				value: String(agent.id),
			}))
		);
	},
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

			const client: UnicoClient = new UnicoClient(
				unicoApiKey ?? process.env.UNICO_API_KEY!,
				process.env.UNICO_BASE_URL
			);
			const completion: Completion = await client.agents.completions.create(agentId, query);

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
