import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits, Events, Guild } from "discord.js";
import CommandRegister from "./libs/registers/register-command";
import { Interaction } from "discord.js";
import { join } from "node:path";

const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordServerId = process.env.DISCORD_SERVER_ID;

if (!discordBotToken) throw new Error("Token not found in environment variables.");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessageReactions,
	],
});

new CommandRegister(__dirname);

client.once("ready", (current_client) => {
	console.log(`✅ Ready! Logged in as ${current_client.user!.tag}`);

	if (!discordServerId) {
		throw new Error("Guild ID not found in environment variables.");
	}
	const guild: Guild | undefined = client.guilds.cache.get(discordServerId!);

	if (!guild) {
		throw new Error("Guild not found.");
	}

	console.log(`✅ Guild found: ${guild.name}`);
	console.log(`✅ Commands added for ${guild.name}`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand() || !interaction.isCommand()) {
		return;
	}

	const command = require(join(__dirname.toString(), "libs/commands") +
		"/" +
		interaction.commandName.toString() +
		".ts");
	if ("data" in command && "execute" in command) {
		try {
			await command!.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
		return;
	}

	await interaction.reply({
		content: "There was an error while executing this command!\n this command is not registered or does not exist!",
		ephemeral: true,
	});
});

client.login(discordBotToken).catch((err) => {
	console.error("❌ Error logging in:", err.message);
});
