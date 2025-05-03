import { PollQuestionMedia, ChatInputCommandInteraction, SlashCommandBuilder, PollAnswerData } from "discord.js";

const command = {
  name: "poll",
  data: new SlashCommandBuilder().setName("poll").setDescription("Create a poll!")
    .addStringOption(option =>
      option.setName("question")
        .setDescription("The question for the poll")
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName("allowmultiselect")
        .setDescription("multiselect enabled?")
        .setRequired(true))
    .addNumberOption(option =>
      option.setName("duration")
        .setDescription("duration of the poll")
        .setMaxValue(768)
        .setMinValue(0)
        .setRequired(true)
    )
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
        .setMaxLength(50)),
  async execute(interaction: ChatInputCommandInteraction) {

    let question = {text:interaction.options.getString("question")}

    // Adding required options
    let answers = [
      {text:interaction.options.getString("option1") as string},
      {text:interaction.options.getString("option2") as string},
    ]

    // if other options exist will be added now.
    if(interaction.options.getString("option3") != null){
      answers.push({text:interaction.options.getString("option3") as string})
    }
    if(interaction.options.getString("option4") != null){
      answers.push({text:interaction.options.getString("option4") as string})
    }

    await interaction.reply({
      poll: {
        question: question as PollQuestionMedia,
        answers:answers as PollAnswerData[],
        duration:interaction.options.getNumber("duration", true) as number,
        allowMultiselect:interaction.options.getBoolean("allowmultiselect", true) as boolean
      }
    });

  },
};

export = command;
