import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  TextChannel,
  PermissionsBitField,
  channelLink,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const staffTicketChannel = process.env.DISCORD_STAFF_TICKET_CHANNEL;

if (!staffTicketChannel) {
  throw Error("You have not set the staff channel.");
}

const command = {
  name: "lockticketchannel",
  data: new SlashCommandBuilder()
    .setName("lockticketchannel")
    .setDescription("Lock ticket channel."),
  async execute(interaction: ChatInputCommandInteraction) {
    let permission = (await interaction.guild?.members.fetch(
      interaction.user.id,
    ))!.permissions.has(
      PermissionsBitField.Flags.Administrator ||
        PermissionsBitField.Flags.ManageChannels,
    );
    if (!permission) {
      interaction.reply(
        "You do not have the needed permission to use this command!",
      );
      return;
    }

    const channel: TextChannel = interaction.guild!.channels.cache.get(
      staffTicketChannel,
    ) as TextChannel;
    if (channel.topic == "Channel Closed") {
      await interaction.reply("🔴 The channel is already closed.");
      return;
    }

    channel.setTopic("Channel Closed");
    interaction.reply("Ticket channel closed");
  },
};

export = command;
