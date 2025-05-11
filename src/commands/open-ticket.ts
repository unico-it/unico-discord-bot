import type { ChatInputCommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import UnicoClient from 'unico-js';

dotenv.config();

const staffTicketChannel = process.env.DISCORD_STAFF_TICKET_CHANNEL;

if (!staffTicketChannel) {
	throw Error('You have not set the staff channel.');
}

const command = {
	name: 'open-ticket',
	data: new SlashCommandBuilder()
		.setName('open-ticket')
		.setDescription('Open a ticket with the moderation team!')
		.addStringOption((option) => option.setName('message').setDescription('message to the staff').setRequired(true))
		.addBooleanOption((option) =>
			option
				.setName('useunicoagent')
				.setDescription(
					'Do you want to use our agent to resolve your problem? it will be possible to contact a moderator.'
				)
				.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const channel: TextChannel = interaction.guild!.channels.cache.get(staffTicketChannel) as TextChannel;

		if (channel.topic === 'Channel Closed') {
			await interaction.editReply('🔴 Your ticket could not be open. please try again when we start taking ticket again.');
			return;
		}

		await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});
		const client: UnicoClient = new UnicoClient(process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);
		const user: GuildMember = await interaction.guild!.members.fetch(interaction.user.id);
		const username: string = interaction.user.displayName;
		const useUnico: boolean | null = interaction.options.getBoolean('useunicoagent');

		try {
			const dmchannel = await user.createDM();
			if (interaction.options.getString('message') === null) {
				await interaction.editReply('The message text is missing.');
				throw Error('The message sent by the user was invalid!');
			}

			const completion = await client
				.agent(Number(process.env.UNICO_TICKET_AGENT_ID!))
				.completions.create(`Reply to this ticket by ${username}: ${interaction.options.getString('message')}`);

			if (useUnico) {
				await interaction.editReply(
					'Your support ticket has been opened. You will be contacted by a UNICO Agent with a possible fix for your problem!'
				);
				dmchannel.send(completion.text);
			}

			if (!useUnico) {
				await interaction.editReply(
					'Your support ticket has been opened. You will be contacted by a moderator via DM with a possible fix for your problem!'
				);
			}

			await channel.send({
				content:
					'>>> ## New Ticket Opened\n' +
					`**User:** ${username}\n` +
					`**Timestamp:** ${new Date(interaction.createdTimestamp).toDateString()}\n` +
					`**Message:** ${interaction.options.getString('message')}\n` +
					`**User has used UNICO?** ${useUnico ? 'Yes' : 'No'}\n` +
					`## UNICO Support Agent Response\n ${completion.text}`,
				allowedMentions: { parse: [] },
			});
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
