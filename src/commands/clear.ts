import type { ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { ChannelType, MessageFlags, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const command = {
  name: 'clear',
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Cleans up the last 100 messages to make the channel more readable for everyone.')
    .addChannelOption((input) => input.setName('channel').addChannelTypes(ChannelType.GuildText).setDescription('Name of the channel to clear').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });
    const channelId = interaction.options.data[0]?.channel?.id;
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const channel = interaction.guild?.channels.cache.get(channelId!) as TextChannel;
    const hasModRole = member?.roles.cache.has(process.env.DISCORD_MOD_ROLE_ID!);

    if (!hasModRole) {
      await interaction.editReply({
        content: '❌ You do not have permission to use this command.',
      });
      return;
    }

    const messages = (await channel.messages.fetch({ limit: 100 })).filter(m => !m.pinned);
    await channel.bulkDelete(messages, true);

    await interaction.editReply({
      content: `🧹 Done! Messages deleted from #${channel.name}.`,
    });
  }
};

export = command;
