import type { GuildMember, TextChannel } from 'discord.js';
import { Client, Events, GatewayIntentBits, Collection, ActivityType } from 'discord.js';
import CommandRegister from './registers/register-command';
import { readdirSync } from 'node:fs';
import { join as path_join } from 'node:path';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
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
		if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);
			if (!command || !command.autocomplete) return;

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error('Autocomplete error:', error);

				if (!interaction.responded) {
					try {
						await interaction.respond([]);
					} catch (responseError) {
						console.error('Error sending empty autocomplete response:', responseError);
					}
				}
			}
			return;
		}
	});

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isCommand()){
			return;
		}

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

	client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
		const WELCOME_MESSAGE: string[] = [`🎉 Hello ${member.user.globalName}! Welcome to the UNICO server. Discover #rules and commands now with /help.`,
			`👋 Hey ${member.user.globalName}, the UNICO community welcomes you! Read #rules to get started or view commands with /help.`,
			`✨ Hi ${member.user.globalName}, glad to have you here! Get started with #rules and /help`,
			`💡 Hey there ${member.user.globalName}! Learn the commands with /help now and read #rules.`];

		let selected_msg = WELCOME_MESSAGE[Math.floor(Math.random() * (WELCOME_MESSAGE.length - 1 + 1)) + 1]!;

		if(selected_msg === undefined){
			console.error('Failed to get welcome message using first in list');
			selected_msg = WELCOME_MESSAGE[0]!;
		}

		(client.channels!.cache.get(`${process.env.WELCOME_CHANNEL_ID}`)! as TextChannel).send(selected_msg);

		if(!member.guild.roles.cache.find(role => role.id === process.env.BASE_USER_ROLE_ID)){
			console.error('Error finding the Specified base roleID:', process.env.BASE_USER_ROLE_ID);
			return;
		}

		await member.roles.add(process.env.BASE_USER_ROLE_ID!);
	});

	await client.login(process.env.DISCORD_BOT_TOKEN);
	client!.user!.setPresence({
		activities: [{
			name: 'UNICO',
			type: ActivityType.Playing,
			url: 'https://theunico.it/'
		}],
		status: 'online'
	});
}

main().catch((err) => {
	console.error('Failed to start bot:', err);
});
