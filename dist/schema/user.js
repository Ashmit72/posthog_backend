"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.UserTable = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.varchar)("username", { length: 20 }).notNull().unique(),
    email: (0, pg_core_1.varchar)("email", { length: 50 }).notNull().unique(),
    profilePicture: (0, pg_core_1.varchar)("profilePicture", { length: 200 }).unique().notNull(),
    password: (0, pg_core_1.varchar)("password", { length: 500 }).notNull()
});
//# sourceMappingURL=user.js.map