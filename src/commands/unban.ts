import { ChatInputCommandInteraction, SlashCommandBuilder, UserResolvable } from "discord.js";

const command = {
	name: "unban",
	data: new SlashCommandBuilder().setName("unban").setDescription("unban a user. ([WARNING] untested command!)")
    .addStringOption(option =>
        option.setName("id")
            .setDescription("id of the user to unban")
            .setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		interaction.guild?.members.unban(interaction.options.getString("id")! as UserResolvable)
    await interaction.reply(interaction.user.username + " readmited a user");

	},
};

export = command;
