import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel,PermissionsBitField } from "discord.js";
import dotenv from "dotenv"
import UnicoClient from "unico-js";

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
            .setRequired(true))
    .addBooleanOption(option =>
      option.setName("aisupport")
        .setDescription("Do you want to use our agent to resolve your problem? (it will be possible to contact a moderator, if the problem is not solved).")
        .setRequired(true)
    ),
	async execute(interaction: ChatInputCommandInteraction) {
    const channel: TextChannel = interaction.guild!.channels.cache.get(staffTicketChannel) as TextChannel;

    if (channel.topic == "Channel Closed"){
      await interaction.reply("🔴 Your ticket could not be open. please try again when we start taking ticket again.")
      return
    }

    await interaction.deferReply();
		const client = new UnicoClient(process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);

		try {
			const completion = await client.completions.create({
				agent: process.env.UNICO_TICKET_AGENT_NAME!,
				query: interaction.options.getString("message")!,
			});

			const user = interaction?.user?.username;
      const dmchannel = (await interaction.guild?.members.fetch(user))!.createDM();
      if(interaction.options.getBoolean("aisupport")){
  			(await dmchannel).send("Hi "+interaction.user.username+"We recived your ticket, here a possible solution to your problem:\n"+completion.text+"\n"+completion.engine)
  			await channel.send("**User:** "+interaction.user.displayName+"\n**Timestamp:** "+new Date(interaction.createdTimestamp).toDateString()+"\n**Message:** \n"+ interaction.options.getString("message")+"**Unico agent response:**"+ completion.text!);
        await interaction.reply("Your ticket has been open. You will be contacted by the Unico bot via DM with a possibile fix to your problem!")
      }else{
       	await channel.send("**User:** "+interaction.user.displayName+"\n**Timestamp:** "+new Date(interaction.createdTimestamp).toDateString()+"\n**Message:** \n"+ interaction.options.getString("message")+"**Unico agent response:**"+ completion.text!);
        await interaction.reply("Your ticket has been open. You will be contacted by UNICO support via DM as soon as possible!")
      }
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
