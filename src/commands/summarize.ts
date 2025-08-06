import type { ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { ChannelType, MessageFlags, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import UnicoClient from 'unico-js';
import type { Completion } from 'unico-js';

dotenv.config();

const command = {
	name: 'summarize',
	data: new SlashCommandBuilder()
		.setName('summarize')
		.setDescription('Summarizes the last 10 messages to make the channel more readable for everyone.')
		.addChannelOption((input) =>
			input
				.setName('channel')
				.addChannelTypes(ChannelType.GuildText)
				.setDescription('Name of the channel to summarize')
				.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		try {
			await interaction.deferReply({
				flags: MessageFlags.Ephemeral,
			});

			const channelId = interaction.options.data[0]?.channel?.id;
			const channel = interaction.guild?.channels.cache.get(channelId!) as TextChannel;

			const messages = (await channel.messages.fetch({ limit: 10 })).filter((m) => !m.pinned);
			const query =
        `Summarize the following messages from #${channel.name}:\n\n` +
        messages.map((message) => `${message.author.username}: ${message.content}`).join('\n');

			const client = new UnicoClient(process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);
			const completion: Completion = await client.agents.completions.create(Number(process.env.UNICO_SUMMARIZER_AGENT_ID!), query);

			interaction.editReply(`${completion.text}`);
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
