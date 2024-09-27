"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
});
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
}
connectToDatabase();
// Create a Drizzle instance
const db = (0, node_postgres_1.drizzle)(client);
exports.default = db;
//# sourceMappingURL=db.js.map