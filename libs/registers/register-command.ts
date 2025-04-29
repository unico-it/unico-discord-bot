import { REST, Routes } from 'discord.js'
import { readdirSync } from "node:fs"
import { join as path_join } from 'node:path'
import dotenv from "dotenv"
dotenv.config()
export default class CommandRegister {
	private Commands: string[]
	private CommandsNames: string[]
	private token = process.env.DS_TOKEN;
	private guildid = process.env.GUILD_ID;
	private clientid = process.env.CLIENT_ID;
	private main_path: String

	public constructor(basePath: String) {

		if (!this.token) throw new Error('Token is required');
		if (!this.guildid) throw new Error('Guild ID is required');
		if (!this.clientid) throw new Error('Client ID is required');
		this.main_path = basePath
		this.Commands = []
		this.CommandsNames = []
		this.register()
	}

	public addCommand(command_name: string) {
		if (!command_name.endsWith(".ts")) command_name += ".ts"
		this.Commands?.push(command_name)
		this.register()
	}

	public get getCommandList(): string[] {
		return this.CommandsNames
	}

	private register() {
		const foldersPath = path_join(this.main_path.toString(), 'libs/commands');
		const commandFiles = readdirSync(foldersPath).filter(file => file.toString().endsWith('.ts'));

		for (const file of commandFiles) {
			const command = require(foldersPath + "/" + file.toString());
			if ('data' in command && 'execute' in command) {
				this.Commands?.push(command.data.toJSON());
				this.CommandsNames?.push(command?.name.toString());
			} else {
				console.log(`[WARNING] The command at ${file.toString()} is missing a required "data" or "execute" property.`);
			}
		}

		const rest = new REST({ version: '10' }).setToken(this.token!);

		(async () => {
			try {
				console.log("Registering commands...");
				await rest.put(
					Routes.applicationGuildCommands(this.clientid!, this.guildid!),
					{ body: this.Commands })
			} catch (error: any) {
				console.error(`Error: ${error?.message || "Unknown error"}`);
			}
		})();
	}

}


