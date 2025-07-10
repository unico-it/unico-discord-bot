import UnicoClient from "unico-js";
import dotenv from 'dotenv';
import * as fs from 'node:fs'

dotenv.config();

let cachedAgents: any[] | undefined = undefined;

export default async function rebuildCache() : Promise<Boolean> {

  //Checks if the cache is alredy been generated.
  let access = false;
  fs.access('./agent_cache.unico', err => err ? access=false : access=true)

  //If the cache exist will skip
  if(access) return true;

  //TODO: TO BE ADDED THE REGENERATION OF THE CACHE WITH TIME, IF THE TIMESTAMP IS TOO OLD IT WILL REGENERATE THE CACHE.
  //! FOR NOW IT WILL GENERATE THE CACHE ONLY ONCE.

  //If not it will regenerate the cache.
  try {
    const client = new UnicoClient(
      process.env.UNICO_API_KEY!,
      process.env.UNICO_BASE_URL
    );
    cachedAgents = await client.agents.retrieve();
    console.log("✅ Agents loaded:", cachedAgents.length);
  } catch (err) {
    console.error("❌ Failed to load agents:", err);
    return false;
  }

  let ret:any[] = []

  cachedAgents?.forEach((agent)=>{
    ret.push({name:agent.name, value: agent.id})
  })

  fs.writeFile('./agent_cache.unico', JSON.stringify(ret),err => {
    if(err) console.error(err);
  })

  return true;
}
