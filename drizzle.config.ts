import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
// import {readFileSync} from 'fs'
config({ path: '.env' });

export default defineConfig({
  schema: ["./schema/user.ts","./schema/task.ts","./schema/onboard.ts"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl:{
      rejectUnauthorized: false,
      // ca: readFileSync('./certs/ap-south-1-bundle.pem').toString()
    }
  },
});