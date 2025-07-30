import type { ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const command = {
	name: 'help',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Print the documentation relative to the bot commands'),
	execute(interaction: ChatInputCommandInteraction): void {
		const helpEmbed = new EmbedBuilder()
			.setColor(0x2031f)
			.setTitle('UNICO Discord bot - Help')
			.setURL('https://github.com/unico-it/unico-discord-bot')
			.setAuthor({ name: 'UNICO', url: 'https://theunico.it' })
			.setDescription('Here a list of the commands avaiable:')
			.setThumbnail('https://raw.githubusercontent.com/unico-it/unico-discord-bot/refs/heads/main/logo.png')
			.addFields(
				{
					name: '/ask',
					value:
            'ID of the agent to use. Autocomplete shows server agents, enter ID manually if using your API key\n\n \
            - **agent**: ID of the agent to use\n\n \
            - **query**: The question for the agent\n\n \
            - **unico-api-key** (optional): Your UNICO api key',
				},
				{
					name: '/open-ticket',
					value:
            '- **message**: Content of the ticket\n\n \
            - **useunicoagent**: Use a unico agent to respond to the ticket',
				},
				{ name: '/summarize', value: '- **channel**: Channel to summarize using UNICO', inline: true },
				{
					name: '/clear',
					value: '- **channel**: Channel to clear (N.B. only admins can use this command)',
					inline: true,
				},
				{ name: '/ping', value: 'A simple ping command', inline: true },
				{ name: '/help', value: 'Show this help message', inline: true }
			)
			.setTimestamp()
			.setFooter({
				text: 'UNICO Discord Bot',
				iconURL: 'https://raw.githubusercontent.com/unico-it/unico-discord-bot/refs/heads/main/logo.png',
			});
		interaction.reply({ embeds: [helpEmbed] });
	},
};

export = command;
