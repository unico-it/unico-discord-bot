import type { ChatInputCommandInteraction} from 'discord.js';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();


const command = {
  name:'help',
  data: new SlashCommandBuilder()
		.setName('help')
    .setDescription('Print the documentation relative to the bot commands'),
  execute(interaction:ChatInputCommandInteraction) : void {
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x2031F)
      .setTitle('UNICO Discord bot - Help')
      .setURL('https://github.com/unico-it/unico-discord-bot')
      .setAuthor({ name: 'Unico Discord Bot', url: 'https://github.com/unico-it/unico-discord-bot' })
      .setDescription('Here a list of the commands avaiable:')
      .setThumbnail('https://raw.githubusercontent.com/unico-it/unico-discord-bot/refs/heads/main/logo.png')
      .addFields(
        {
          name: '/ask',
          value: '**agent:** Autocomplete shows server agents, enter ID manually if using your API key (NOTE: the reply is visible only to the sender',
          inline: true
        },
        {
          name: '/open-ticket',
          value: '**message:** content of the ticket\n **useunicoagent:** Use a unico agent to respond to the ticket',
          inline: true
        },
        {
          name: '/summarize',
          value: '**channel:** Channel to summarize with UNICO agents',
          inline: true
        },
        {
          name: '/clear',
          value: 'clears all chat commands',
          inline: true
        },
        {
          name: '/ping',
          value: 'a simple ping command',
          inline: true
        },
      )
      .setTimestamp()
      .setFooter({ text: 'UNICO Discord Bot', iconURL: 'https://raw.githubusercontent.com/unico-it/unico-discord-bot/refs/heads/main/logo.png' });
      interaction.reply({ embeds: [exampleEmbed] });
  }
};

export = command
