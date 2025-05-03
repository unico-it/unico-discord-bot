import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const mutedRole = process.env.MUTED_ROLE_ID;

if (!mutedRole) {
    throw new Error("MUTED_ROLE_ID is not defined in .env file");
}

const command = {
	name: "kick",
	data: new SlashCommandBuilder().setName("kick").setDescription("Kick a user!")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("The user to kick")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("reason")
            .setDescription("The reason for the kick")
            .setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {

        const interactiondata = {
                user: interaction.options.getUser("user")!,
                guild: interaction.guild!,
                options: interaction.options!,
                id: interaction.options.getUser("user")!.id!,
        }


        interactiondata!.guild?.members.fetch(interactiondata.id).then((member) => {
            member.kick(interaction.options.getString("reason")!).then(() => {
                console.log(`Kicked user ${interactiondata.user.username}`);
            }).catch((error) => {
                console.error(`Failed to ban user ${interactiondata.user.username}:`, error);
            });
        }
        ).catch((error) => {
            console.error(`Failed to fetch member ${interactiondata.user.username}:`, error);
        });

        await interaction.reply(interaction.user.username + " exiled " + interactiondata.user.username + "");

	},
};

export = command;
