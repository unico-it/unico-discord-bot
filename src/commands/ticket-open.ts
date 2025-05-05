import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
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
      option.setName("useunico")
        .setDescription("Do you want to use our agent to resolve your problem? it will be possible to contact a moderator.")
        .setRequired(true)
    ),
	async execute(interaction: ChatInputCommandInteraction) {
    const channel: TextChannel = interaction.guild!.channels.cache.get(staffTicketChannel) as TextChannel;

    if (channel.topic == "Channel Closed"){
      await interaction.reply("🔴 Your ticket could not be open. please try again when we start taking ticket again.")
      return
    }

    await interaction.deferReply()
		const client = new UnicoClient(process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL);
		const user = (await interaction.guild?.members.fetch(interaction.user.id))
		const username = interaction.user.displayName
		const interactChannel:TextChannel = interaction.channel! as TextChannel
		const useUnico = interaction.options.getBoolean("useunico")
    await interactChannel.send("Your ticket has been open. You will be contacted by the Unico bot or a moderator via DM with a possibile fix to your problem!")
		try {

      const dmchannel = user?.createDM()!
      if(useUnico!){

       	const completion = await client.completions.create({
     			agent: process.env.UNICO_TICKET_AGENT_NAME!,
     			query: interaction.options.getString("message")!,
    		});

  			(await dmchannel).send("Hi "+username+", We recived your ticket, here a possible solution to your problem:\n"+completion.text+"\n**Engine used:** "+completion.engine)
      }
     	await channel.send("**User:** "+username+"\n**Timestamp:** "+new Date(interaction.createdTimestamp).toDateString()+"\n**Message:** \n"+ interaction.options.getString("message"));

		} catch (error: unknown) {
			console.error(error);

			if (error instanceof Error) {
				interaction.editReply(error.message);
				return;
			}

			interaction.editReply("An unknown error occurred. If the error persists, please contact UNICO support.");
		}
		interaction.deleteReply()
	},
};

export = command;
