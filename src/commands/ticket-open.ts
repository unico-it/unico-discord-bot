import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel,PermissionsBitField } from "discord.js";
import dotenv from "dotenv"
dotenv.config()

const staffTicketChannel = process.env.DISCORD_STAFF_TICKET_CHANNEL

if(!staffTicketChannel){
  throw Error("You have not set the staff channel.")
}

const command = {
	name: "ticketopen",
	data: new SlashCommandBuilder().setName("ticketopen").setDescription("Open a ticket with the moderation team!")
    .addStringOption(option =>
        option.setName("message")
            .setDescription("message to the staff")
            .setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
    const channel: TextChannel = interaction.guild!.channels.cache.get(staffTicketChannel) as TextChannel;

    if (channel.topic == "Channel Closed"){
      await interaction.reply("🔴 Your ticket could not be open. please try again when we start taking ticket again.")
      return
    }

    await channel.send("**User:** "+interaction.user.displayName+"\n**Timestamp:** "+new Date(interaction.createdTimestamp).toDateString()+"\n**Message:** \n"+ interaction.options.getString("message")!);
    await interaction.reply("Your ticket has ben open. We will try to contact you as fast as we can!")
	},
};

export = command;
