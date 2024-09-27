"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Taskstable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
exports.Taskstable = (0, pg_core_1.pgTable)("tasks", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.varchar)("title", { length: 50 }).notNull(),
    description: (0, pg_core_1.varchar)("description", { length: 200 }).notNull(),
    completed: (0, pg_core_1.boolean)("completed").notNull().default(false),
    userId: (0, pg_core_1.integer)("user_id").references(() => user_1.UserTable.id).notNull()
});
//# sourceMappingURL=task.js.map