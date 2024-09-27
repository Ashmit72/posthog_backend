"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = require("../controllers/task");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.route('/').get(task_1.getTask);
router.route('/:userId').get(auth_1.default, task_1.getUserTask).delete(auth_1.default, task_1.deleteTasks).post(auth_1.default, task_1.createTask);
router.route('/:userId/:taskId').get(auth_1.default, task_1.getUserSingleTask).delete(auth_1.default, task_1.deleteSingleTask).patch(auth_1.default, task_1.updateTask);
exports.default = router;
//# sourceMappingURL=task.js.map