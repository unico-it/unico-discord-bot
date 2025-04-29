import dotenv from "dotenv"
dotenv.config()
import { Client, GatewayIntentBits, Events, Guild } from "discord.js";
import CommandRegister from './libs/registers/register-command';
import { Interaction } from 'discord.js';
import { join } from "node:path";

const token = process.env.DS_TOKEN;
const guildId = process.env.GUILD_ID;

if (!token) throw new Error("Token not found in environment variables.");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions
  ],
})

new CommandRegister(__dirname)

client.once("ready", (current_client) => {
  console.log(`✅ Ready! Logged in as ${current_client.user?.tag}`);                                     // The bot is ready!

  if (!guildId) throw new Error("Guild ID not found in environment variables.");                         // Checking if the .env file contains the guildId to check
  const guild: Guild | undefined = client.guilds.cache.get(guildId!);                                    // Getting the guild with the guildId
  if (!guild) throw new Error("Guild not found.");                                                       // Checking if the guild exist

  console.log(`✅ Guild found: ${guild.name}`);
  console.log(`✅ Commands added for ${guild.name}`);
})

client.on(Events.InteractionCreate, async (interaction: Interaction) => {

  if (!interaction.isChatInputCommand() || !interaction.isCommand()) return;
  const command = require(join(__dirname.toString(), 'libs/commands') + "/" + interaction.commandName.toString() + ".ts");
  if ('data' in command && 'execute' in command) {
    try {
      await command!.execute(interaction);                                                                // Execute the command
    } catch (error) {
      console.error(error);                                                                                // Log the error
      await interaction.reply({                                                                            // Reply to the user with an error message
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  } else {
    await interaction.reply({                                                                            // Reply to the user with an error message
      content: 'There was an error while executing this command!\n this command is not registered or does not exist!',
      ephemeral: true,
    });
  }
})

client.login(token).catch((err) => {
  console.error("❌ Error logging in:", err.message);
})
