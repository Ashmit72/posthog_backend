"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("../db/db"));
const user_1 = __importDefault(require("./routes/user"));
const task_1 = __importDefault(require("./routes/task"));
const onboard_1 = __importDefault(require("./routes/onboard"));
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use('/uploads/', express_1.default.static('uploads'));
app.use('/users', user_1.default);
app.use('/tasks', task_1.default);
app.use('/onboard', onboard_1.default);
app.get('/', (req, res) => {
    res.send('App is running and uploads should run!');
});
app.listen(port, async () => {
    try {
        await db_1.default.select();
        console.log(`Server is running on port ${port}`);
    }
    catch (error) {
        console.log(error);
    }
});
//# sourceMappingURL=app.js.map