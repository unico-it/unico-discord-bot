import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import UnicoClient from 'unico-js';
import dotenv from 'dotenv';

dotenv.config();

let cachedAgents: any[] = [];

async function preloadAgents(): Promise<void> {
  try {
    const client = new UnicoClient(process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);
    cachedAgents = await client.agents.retrieve();
    console.log(`Preloaded ${cachedAgents.length} agents`);
  } catch (error) {
    console.error('Failed to preload agents:', error);
    cachedAgents = [];
  }
}

preloadAgents();

const command = {
  name: 'ask',
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Replies with the response to the query!')
    .addStringOption((option) =>
      option.setName('query').setDescription('Query for the specified agent.').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('agent').setDescription('Id of the agent in your UNICO account.').setRequired(true).setAutocomplete(true)//.addChoices(cachedAgents!) //! DO NOT DELETE THIS COMMENT.
		)
		.addStringOption((option) =>
      option.setName('unico-api-key').setDescription('Your UNICO API key. You can specify it to access to your agents.').setRequired(false)
    ),
	async autocomplete(interaction: AutocompleteInteraction):Promise<void> {
    const focusedValue = interaction.options.getFocused();

    const filtered = cachedAgents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(focusedValue.toLowerCase()) ||
        String(agent.id).includes(focusedValue)
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

			if (isNaN(Number(agentId))) {
				interaction.editReply('Agent ID must be a number.');
				return;
			}


			const client = new UnicoClient(unicoApiKey ?? process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);
			const completion = await client.agents.completions.create(Number(agentId),query);

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
