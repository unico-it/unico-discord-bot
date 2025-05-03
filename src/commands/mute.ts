import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const mutedRole = process.env.MUTED_ROLE_ID;

if (!mutedRole) {
    throw new Error("MUTED_ROLE_ID is not defined in .env file");
}

const command = {
	name: "mute",
	data: new SlashCommandBuilder().setName("mute").setDescription("Mute a user!")
    .addUserOption(option =>
        option.setName("user")
            .setDescription("The user to mute")
            .setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {

        const interactiondata = {
                user: interaction.options.getUser("user")!,
                guild: interaction.guild!,
                options: interaction.options!,
                id: interaction.options.getUser("user")!.id!,
        }


        interactiondata!.guild?.members.fetch(interactiondata.id).then((member) => {
            const role = interactiondata!.guild?.roles.cache.get(mutedRole!);
            if (role) {
                member.roles.add(role).then(() => {
                    console.log(`Added role ${role.name} to user ${interactiondata.user.username}`);
                }).catch((error) => {
                    console.error(`Failed to add role ${role.name} to user ${interactiondata.user.username}:`, error);
                });
            }
        }
        ).catch((error) => {
            console.error(`Failed to fetch member ${interactiondata.user.username}:`, error);
        });

        await interaction.reply(interaction.user.username + " silenced " + interactiondata.user.username + "");

	},
};

export = command;
