import {pgTable, boolean, serial, varchar, integer } from "drizzle-orm/pg-core";
import { UserTable } from "./user";

export const Taskstable=pgTable("tasks",{
    id:serial("id").primaryKey(),
    title:varchar("title",{length:50}).notNull(),
    description:varchar("description",{length:200}).notNull(),
    completed:boolean("completed").notNull().default(false),
    userId:integer("user_id").references(()=>UserTable.id).notNull()
})