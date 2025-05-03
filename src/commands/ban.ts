import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const mutedRole = process.env.MUTED_ROLE_ID;

if (!mutedRole) {
    throw new Error("MUTED_ROLE_ID is not defined in .env file");
}

const command = {
	name: "ban",
	data: new SlashCommandBuilder().setName("ban").setDescription("Ban a user!")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("The user to ban")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("reason")
            .setDescription("The reason for the ban")
            .setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {

        const interactiondata = {
                user: interaction.options.getUser("user")!,
                guild: interaction.guild!,
                options: interaction.options!,
                id: interaction.options.getUser("user")!.id!,
        }


        interactiondata!.guild?.members.fetch(interactiondata.id).then((member) => {
            member.ban({ reason: interaction.options.getString("reason")! }).then(() => {
                console.log(`Banned user ${interactiondata.user.username}`);
            }).catch((error) => {
                console.error(`Failed to ban user ${interactiondata.user.username}:`, error);
            });
        }
        ).catch((error) => {
            console.error(`Failed to fetch member ${interactiondata.user.username}:`, error);
        });

        await interaction.reply(interaction.user.username + " banished " + interactiondata.user.username + "");

	},
};

export = command;
