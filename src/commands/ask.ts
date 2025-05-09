import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import UnicoClient from "unico-js";
import dotenv from "dotenv";

dotenv.config();

const command = {
	name: "ask",
	data: new SlashCommandBuilder()
		.setName("ask")
		.setDescription("Replies with the response to the query!")
		.addStringOption((option) =>
			option.setName("agent").setDescription("Name of the agent in your UNICO account.").setRequired(true)
		)
		.addStringOption((option) =>
			option.setName("query").setDescription("Query for the specified agent.").setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		const client = new UnicoClient(process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);

		try {
			const agent = interaction.options.getString("agent");
			const query = interaction.options.getString("query");

			if (!agent || !query) {
				interaction.editReply("Agent or query cannot be empty.");
				return;
			}

			const completion = await client.completions.create({
				agent,
				query,
			});

			interaction.editReply(`**${interaction.options.getString("agent")}**: ${completion.text}`);
		} catch (error: unknown) {
			console.error(error);

			if (error instanceof Error) {
				interaction.editReply(error.message);
				return;
			}

			interaction.editReply("An unknown error occurred. If the error persists, please contact UNICO support.");
		}
	},
};

export = command;
