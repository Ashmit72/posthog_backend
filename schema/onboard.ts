import {pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { UserTable } from "./user";

export const OnboardTable=pgTable("onboard",{
    id:serial("id").primaryKey(),
    food:varchar("food",{length:50}).notNull(),
    hobby:varchar("hobby",{length:50}).notNull(),
    nickname:varchar("nickname",{length:50}).notNull(),
    userId:integer("user_id").references(()=>UserTable.id).notNull().unique()
})