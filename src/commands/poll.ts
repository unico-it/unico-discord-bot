import { APIEmbedField, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";


const command = {
  name: "poll",
  data: new SlashCommandBuilder().setName("poll").setDescription("Create a poll!")
    .addStringOption(option =>
      option.setName("question")
        .setDescription("The question for the poll")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("option1")
        .setDescription("The first option for the poll")
        .setMaxLength(50)
        .setRequired(true))
    .addStringOption(option =>
      option.setName("option2")
        .setDescription("The second option for the poll")
        .setMaxLength(50)
        .setRequired(true))
    .addStringOption(option =>
      option.setName("option3")
        .setDescription("The third option for the poll")
        .setMaxLength(50))
    .addStringOption(option =>
      option.setName("option4")
        .setDescription("The forth option for the poll")
        .setMaxLength(50))
    .addStringOption(option =>
      option.setName("option5")
        .setDescription("The fifth option for the poll")
        .setMaxLength(50)),
  async execute(interaction: ChatInputCommandInteraction) {

    interaction.reply("this command is not yet implemented, please try again later!")
    return

    const interactiondata = {
      guild: interaction.guild!,
      options: interaction.options!,
    };

    const emojis = [":one:", ":two:", ":three:", ":four:", ":five:"];

    let embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Poll")
      .setDescription(interactiondata.options.getString("question")!)
      .setTimestamp()
      .setFooter({ text: `Poll created by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

    const fields: APIEmbedField[] = new Array<APIEmbedField>();

    for (let option_idx = 1!; option_idx <= interactiondata.options.data.length-1; option_idx++) {
      console.log(interaction.options.getString("option" + option_idx)!);

      fields.push({name: emojis[option_idx - 1] + " " + interactiondata.options.getString("option" + option_idx)!, value: interactiondata.options.getString("option" + option_idx) as string, inline: true});
    }

    embed.addFields(fields);

    await interaction.reply({ embeds: [embed] });

  },
};

export = command;
