"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTask = getTask;
exports.getUserTask = getUserTask;
exports.getUserSingleTask = getUserSingleTask;
exports.deleteTasks = deleteTasks;
exports.deleteSingleTask = deleteSingleTask;
exports.createTask = createTask;
exports.updateTask = updateTask;
const db_1 = __importDefault(require("../../db/db"));
const task_1 = require("../../schema/task");
const drizzle_orm_1 = require("drizzle-orm");
const posthog_node_1 = require("posthog-node");
const client = new posthog_node_1.PostHog('phc_68dZt6F76WvG5j36CIC3esc7DJ4axdG7Y0VstmjFJtn', {
    host: 'https://us.i.posthog.com'
});
async function getTask(req, res) {
    try {
        const getTasks = await db_1.default.select().from(task_1.Taskstable);
        //CAPTURE EVENT TO POSTHOG
        client.capture({
            distinctId: 'backend',
            event: 'get_tasks',
            properties: {
                taskCount: getTasks.length,
                timestamp: getTasks
            }
        });
        if (getTasks.length === 0) {
            return res.status(201).json({
                msg: 'There are no tasks',
                tasks: getTasks
            });
        }
        return res.status(200).json(getTasks);
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
async function getUserTask(req, res) {
    try {
        const paramId = req.params.userId;
        const id = parseInt(paramId);
        const userTasks = await db_1.default.select().from(task_1.Taskstable).where((0, drizzle_orm_1.eq)(task_1.Taskstable.userId, id));
        if (userTasks.length === 0) {
            return res.status(400).json({
                msg: "User has no Tasks",
                tasks: userTasks
            });
        }
        return res.status(200).json({
            tasks: userTasks
        });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
async function getUserSingleTask(req, res) {
    try {
        const { userId, taskId } = req.params;
        const parsedUserId = parseInt(userId);
        const parsedTaskId = parseInt(taskId);
        if (isNaN(parsedUserId) || isNaN(parsedTaskId)) {
            return res.status(400).json({ msg: "Invalid user ID or task ID" });
        }
        const userTask = await db_1.default.select().from(task_1.Taskstable).where((0, drizzle_orm_1.eq)(task_1.Taskstable.id, parsedTaskId));
        if (!userTask) {
            return res.status(404).json({ msg: "Task not found for this user" });
        }
        return res.status(200).json({
            userId: parsedUserId,
            task: userTask
        });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
async function deleteTasks(req, res) {
    try {
        const { userId } = req.params;
        const parsedUserId = parseInt(userId);
        await db_1.default.delete(task_1.Taskstable).where((0, drizzle_orm_1.eq)(task_1.Taskstable.userId, parsedUserId));
        // Capture event in PostHog when tasks are deleted
        client.capture({
            distinctId: String(parsedUserId),
            event: 'tasks_deleted',
            properties: {
                userId: parsedUserId,
                timestamp: new Date().toISOString()
            }
        });
        return res.status(200).json({
            msg: "All Tasks Deleted!"
        });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
async function deleteSingleTask(req, res) {
    try {
        const { userId, taskId } = req.params;
        const parsedUserId = parseInt(userId);
        const parsedTaskId = parseInt(taskId);
        if (isNaN(parsedUserId) || isNaN(parsedTaskId)) {
            return res.status(400).json({ msg: "Invalid user ID or task ID" });
        }
        await db_1.default.delete(task_1.Taskstable).where((0, drizzle_orm_1.eq)(task_1.Taskstable.id, parsedTaskId));
        return res.status(200).json({
            msg: "Task Deleted Sucessfully"
        });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
async function createTask(req, res) {
    try {
        const { userId } = req.params;
        const parsedUserId = parseInt(userId);
        const { title, description } = req.body;
        if (!title || !description === undefined) {
            return res.status(400).json({
                msg: "All fields are required!"
            });
        }
        const taskData = {
            title,
            description,
            userId: parsedUserId
        };
        await db_1.default.insert(task_1.Taskstable).values(taskData);
        // Capture event in PostHog when a task is created
        client.capture({
            distinctId: String(parsedUserId),
            event: 'task_created',
            properties: {
                userId: parsedUserId,
                title,
                description,
                timestamp: new Date().toISOString()
            }
        });
        return res.status(201).json({
            msg: "Task created successfully!"
        });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
async function updateTask(req, res) {
    try {
        const { userId, taskId } = req.params;
        const { title, description, completed } = req.body;
        const parsedUserId = parseInt(userId);
        const parsedTaskId = parseInt(taskId);
        if (isNaN(parsedUserId) || isNaN(parsedTaskId)) {
            return res.status(400).json({ msg: "Invalid user ID or task ID" });
        }
        const updatedData = {
            title,
            description,
            completed
        };
        await db_1.default.update(task_1.Taskstable).set(updatedData).where((0, drizzle_orm_1.eq)(task_1.Taskstable.id, parsedTaskId));
        return res.status(200).json({
            "msg": "Data Updated Successfully!",
            "task": updatedData
        });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
//# sourceMappingURL=task.js.map