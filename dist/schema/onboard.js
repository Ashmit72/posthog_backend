"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_1 = require("./user");
exports.OnboardTable = (0, pg_core_1.pgTable)("onboard", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    food: (0, pg_core_1.varchar)("food", { length: 50 }).notNull(),
    hobby: (0, pg_core_1.varchar)("hobby", { length: 50 }).notNull(),
    nickname: (0, pg_core_1.varchar)("nickname", { length: 50 }).notNull(),
    userId: (0, pg_core_1.integer)("user_id").references(() => user_1.UserTable.id).notNull().unique()
});
//# sourceMappingURL=onboard.js.map