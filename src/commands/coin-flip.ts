
import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import dotenv from "dotenv"
dotenv.config()

const staffTicketChannel = process.env.DISCORD_STAFF_TICKET_CHANNEL

if(!staffTicketChannel){
  throw Error("You have not set the staff channel.")
}

const command = {
	name: "coinflip",
	data: new SlashCommandBuilder().setName("coinflip").setDescription("Coin flip, challenge your luck!"),
	async execute(interaction: ChatInputCommandInteraction) {
	  let result:string = ""
    let x = (Math.floor(Math.random() * 2) == 0);
    if(x){
        result = "heads";
    }else{
        result = "tails";
    }

    await interaction.reply("The coin said " + result)
	},
};

export = command;
