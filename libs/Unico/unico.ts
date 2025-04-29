import UnicoClient from "unico-js";
import dotenv from 'dotenv';
dotenv.config();

export class UnicoChatClient extends UnicoClient {
  constructor() {
    super(process.env.UNICO_API_KEY!, process.env.UNICO_BASE_URL!);
  }
  private async getAgents() {
    return await this.agents.retrieve();
  }
  public async askCompletion(agent_name: string, question: string) {
    const completions = await this.completions.create({
      agent: agent_name,
      query: question,
    });
    return completions?.text;
  }
}
