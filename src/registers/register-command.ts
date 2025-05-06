import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";
import { join as path_join } from "node:path";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default class CommandRegister {
  private Commands: any[];
  private CommandsNames: string[];
  private discordBotToken = process.env.DISCORD_BOT_TOKEN;
  private discordServerId = process.env.DISCORD_SERVER_ID;
  private discordApplicationId = process.env.DISCORD_APPLICATION_ID;
  private basePath: string;

  public constructor(basePath: string) {
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
    if (!command_name.endsWith(".ts") && !command_name.endsWith(".js")) {
      command_name += ".ts";
    }
    this.register();
  }

  public get getCommandList(): string[] {
    return this.CommandsNames;
  }

  private register(): void {
    this.Commands = [];
    this.CommandsNames = [];

    const foldersPath = path_join(this.basePath, "commands");
    const commandFiles = readdirSync(foldersPath).filter(
      (file) =>
        !file.endsWith(".d.ts") &&
        (file.endsWith(".ts") || file.endsWith(".js")),
    );

    for (const file of commandFiles) {
      try {
        const commandPath = path.resolve(foldersPath, file);

        delete require.cache[require.resolve(commandPath)];

        const command = require(commandPath);

        if (!command) {
          console.warn(`[WARNING] Could not load command at ${file}.`);
          continue;
        }

        if (!("data" in command && "execute" in command)) {
          console.warn(
            `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`,
          );
          continue;
        }

        this.Commands.push(command.data.toJSON());

        if ("name" in command) {
          this.CommandsNames.push(command.name);
        } else {
          this.CommandsNames.push(command.data.name);
        }
      } catch (error) {
        console.error(`[ERROR] Failed to load command ${file}:`, error);
      }
    }

    if (this.Commands.length === 0) {
      console.warn("[WARNING] No commands found to register.");
      return;
    }

    const rest = new REST({ version: "10" }).setToken(this.discordBotToken!);

    (async () => {
      try {
        console.log(`Registering ${this.Commands.length} commands...`);

        await rest.put(
          Routes.applicationGuildCommands(
            this.discordApplicationId!,
            this.discordServerId!,
          ),
          {
            body: this.Commands,
          },
        );

        console.log("Commands registered successfully!");
      } catch (error: any) {
        console.error(
          `Error registering commands: ${error?.message || "Unknown error"}`,
        );
        console.error(error);
      }
    })();
  }
}
