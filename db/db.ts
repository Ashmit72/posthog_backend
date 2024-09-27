import { drizzle } from "drizzle-orm/node-postgres";
import {Client} from "pg"
import { configDotenv } from "dotenv";

configDotenv()

const client=new Client({
connectionString:process.env.DATABASE_URL,
})

async function connectToDatabase() {
    try {
      await client.connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection error:', error);
    }
  }
  
  connectToDatabase();
  
  // Create a Drizzle instance
  const db = drizzle(client);
  
  export default db;