import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
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
      option.setName('query').setDescription('Query for the specified agent.').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('unico-api-key').setDescription('Your UNICO API key. You can specify it to access to your agents.').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('agent').setDescription('Id of the agent in your UNICO account.').setRequired(true).setAutocomplete(true)
		),
	async autocomplete(interaction:AutocompleteInteraction):Promise<void> {
    const focusedOption = interaction.options.getFocused(true);
    const unicoApiKey = interaction.options.getString('unico-api-key'); // Get the API key the user typed
    const searchTerm = focusedOption.value.toLowerCase(); // What the user has typed so far

    if (!unicoApiKey) {
        await interaction.respond([{ name: 'Please provide a UNICO API key first.', value: 'no-api-key' }]);
        return;
    }

    try {
        const unicoClient = new UnicoClient(unicoApiKey, process.env.UNICO_BASE_URL);
        const agents = await unicoClient.agents.retrieve();

        const filteredChoices = agents
            .filter(agent => agent.name.toLowerCase().includes(searchTerm))
            .map(agent => ({
                name: agent.name,
                value: agent.id,
            }))
            .slice(0, 25); // Discord autocomplete limits to 25 choices

        await interaction.respond(filteredChoices);
    } catch (error) {
        console.error('Error during autocomplete for agents:', error);
        await interaction.respond([{ name: 'Error fetching agents.', value: 'error' }]);
    }

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

			if (isNaN(Number(agentId))) {
				interaction.editReply('Agent ID must be a number.');
				return;
			}

			const client = new UnicoClient(unicoApiKey ?? process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);
			const completion = await client.agent(Number(agentId)).completions.create(query);

			interaction.editReply(`**Agent ${agentId}**: ${completion.text}`);
		} catch (error: unknown) {
			console.error(error);

			if (error instanceof Error) {
				interaction.editReply(error.message);
				return;
			}

			interaction.editReply('An unknown error occurred. If the error persists, please contact UNICO support.');
		}
	}
};

export = command;
