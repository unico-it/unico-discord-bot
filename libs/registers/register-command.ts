import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";
import { join as path_join } from "node:path";
import dotenv from "dotenv";

dotenv.config();

export default class CommandRegister {
	private Commands: string[];
	private CommandsNames: string[];
	private discordBotToken = process.env.DISCORD_BOT_TOKEN;
	private discordServerId = process.env.DISCORD_SERVER_ID;
	private discordApplicationId = process.env.DISCORD_APPLICATION_ID;
	private basePath: String;

	public constructor(basePath: String) {
		if (!this.discordBotToken) {
			throw new Error("Token is required");
		}

		if (!this.discordServerId) {
			throw new Error("Guild ID is required");
		}

		if (!this.discordApplicationId) {
			throw new Error("Application ID is required");
		}

		this.basePath = basePath;
		this.Commands = [];
		this.CommandsNames = [];
		this.register();
	}

	public addCommand(command_name: string): void {
		if (!command_name.endsWith(".ts")) {
			command_name += ".ts";
		}

		this.Commands!.push(command_name);
		this.register();
	}

	public get getCommandList(): string[] {
		return this.CommandsNames;
	}

	private register(): void {
		const foldersPath = path_join(this.basePath.toString(), "libs/commands");
		const commandFiles = readdirSync(foldersPath).filter((file) => file.toString().endsWith(".ts"));

		for (const file of commandFiles) {
			const command = require(foldersPath + "/" + file.toString());

			if (!("data" in command && "execute" in command)) {
				console.warn(`[WARNING] The command at ${file.toString()} is missing a required "data" or "execute" property.`);
				continue;
			}

			this.Commands!.push(command.data.toJSON());
			this.CommandsNames!.push(command?.name.toString());
		}

		const rest = new REST({ version: "10" }).setToken(this.discordBotToken!);

		(async () => {
			try {
				console.log("Registering commands...");

				await rest.put(Routes.applicationGuildCommands(this.discordApplicationId!, this.discordServerId!), {
					body: this.Commands,
				});
			} catch (error: any) {
				console.error(`Error: ${error?.message || "Unknown error"}`);
			}
		})();
	}
}
