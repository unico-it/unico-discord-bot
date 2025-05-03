
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as https from 'https';

const command = {
	name: "urbandictionary",
	data: new SlashCommandBuilder().setName("urbandictionary").setDescription("Search a word on urbandictionary.")
       	.addStringOption(option =>
                option.setName("word")
                    .setDescription("word to search")
                    .setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
	  const response:Response = await fetch("https://api.urbandictionary.com/v0/define?term="+interaction.options.getString("word"));
    const data = await response.json();
    interaction.reply("**Requested word:** "+ interaction.options.getString("word") +"\n**Definition** (**NOTE: this is the first result from the search**): \n"+ data["list"][0]["definition"]+"\n**Source:**: "+ data["list"][0]["permalink"])
	},
};

export = command;
