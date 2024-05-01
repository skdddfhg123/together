import { Injectable } from "@nestjs/common";
import { Client } from "discord.js";

@Injectable()
export class DiscordBotService {
    private client: Client;

    constructor() {
        this.client = new Client({ intents: ["Guilds", "GuildMessages"] });
        this.client.login(process.env.DISCORD_BOT_TOKEN)
    }

    getClient(): Client {
        return this.client;
    }
}
