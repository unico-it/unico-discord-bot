import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();


const command = {
  name:'help',
  data: new SlashCommandBuilder()
		.setName('help')
    .setDescription('Print the documentation relative to the bot commands'),
  execute(interaction:ChatInputCommandInteraction) {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x2031F)
      .setTitle('UNICO Discord bot - Help')
      .setURL('https://theunico.it/')
      .setAuthor({ name: 'Unico Discord Bot', url: 'https://theunico.it' })
      .setDescription('Here a list of the commands avaiable:')
      .setThumbnail('https://i.imgur.com/AfFp7pu.png')
      .addFields(
        { name: '/ask', value: '**agent:** ID of the agent to use\n **query:** The question for the agent\n **unico-api-key:** Your UNICO api key (NOTE: the reply is visible only to the sender', inline: true },
        { name: '/open-ticket', value: '**message:** content of the ticket\n **useunicoagent:** Use a unico agent to respond to the ticket', inline: true },
        { name: '/summarize', value: '**channel:** Channel to summarize with UNICO agents', inline: true },
        { name: '/clear', value: 'clears all chat commands', inline: true },
        { name: '/ping', value: 'a simple ping command', inline: true },
      )
      .setTimestamp()
      .setFooter({ text: 'UNICO Discord Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
      interaction.reply({ embeds: [exampleEmbed] })
  }
};

export = command
