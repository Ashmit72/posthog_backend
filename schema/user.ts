import { pgTable, serial, varchar } from "drizzle-orm/pg-core"
export const UserTable=pgTable("users",{
    id:serial("id").primaryKey(),
    username:varchar("username",{length:20}).notNull().unique(),
    email:varchar("email",{length:50}).notNull().unique(),
    profilePicture:varchar("profilePicture",{length:200}).unique().notNull(),
    password:varchar("password",{length:500}).notNull()
})
