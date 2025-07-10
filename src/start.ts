import { Client, Events, GatewayIntentBits, Collection, ActivityType } from 'discord.js';
import CommandRegister from './registers/register-command';
import { readdirSync } from 'node:fs';
import { join as path_join } from 'node:path';
import dotenv from 'dotenv';
import path from 'path';
import rebuildCache from './utils/fetchAgents';

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessagePolls,
	],
});

declare module 'discord.js' {
	export interface Client {
		commands: Collection<string, any>;
	}
}

client.commands = new Collection();



async function main(): Promise<void> {
	const commandRegister = new CommandRegister(__dirname);

	const loaded_agents = await rebuildCache()
	console.log(loaded_agents)

	console.log(`Registered commands: ${commandRegister.getCommandList.join(', ')}`);

	const foldersPath = path_join(__dirname, 'commands');
	const commandFiles = readdirSync(foldersPath).filter(
		(file) => !file.endsWith('.d.ts') && (file.endsWith('.ts') || file.endsWith('.js'))
	);

	for (const file of commandFiles) {
		try {
			const filePath = path.resolve(foldersPath, file);
			const command = await import(filePath);

			if (!('data' in command && 'execute' in command)) {
				console.warn(`[WARNING] The command at ${filePath} is missing required properties.`);
				continue;
			}

			const commandName = command.name || command.data.name;
			client.commands.set(commandName, command);
			console.log(`Command '${commandName}' loaded into client collection`);
		} catch (error) {
			console.error(`[ERROR] Failed to load command ${file}:`, error);
		}
	}

	client.once(Events.ClientReady, (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			const reply = {
				content: 'There was an error executing this command!',
				ephemeral: true
			};

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(reply);
				return;
			}

			await interaction.reply(reply);
		}
	});

	await client.login(process.env.DISCORD_BOT_TOKEN);

	client?.user?.setPresence({
			activities: [{
					name: 'Using Unico',
					type: ActivityType.Custom,
					url: 'https://theunico.it/'
			}],
			status: 'online'
	});

}

main().catch((err) => {
	console.error('Failed to start bot:', err);
});
