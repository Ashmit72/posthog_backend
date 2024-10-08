"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
exports.getSingleUser = getSingleUser;
const user_1 = require("../../schema/user");
const db_1 = __importDefault(require("../../db/db"));
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const bcrypt_1 = __importDefault(require("bcrypt"));
const posthog_node_1 = require("posthog-node");
(0, dotenv_1.configDotenv)();
const JWT_SECRET = process.env.JWT_SECRET;
const client = new posthog_node_1.PostHog('phc_68dZt6F76WvG5j36CIC3esc7DJ4axdG7Y0VstmjFJtn', {
    host: 'https://us.i.posthog.com'
});
async function getUser(req, res) {
    try {
        const allUsers = await db_1.default.select().from(user_1.UserTable);
        if (allUsers.length === 0) {
            return res.json({ message: 'There are no users', allUsers });
        }
        // Track the event for fetching users
        client.capture({
            distinctId: 'admin',
            event: 'get_users',
            properties: {
                method: req.method,
                path: req.originalUrl,
                timestamp: new Date().toISOString()
            }
        });
        return res.json({ users: allUsers });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}
async function createUser(req, res) {
    try {
        const newUser = await req.body;
        const profilePicture = req.file ? req.file.path : null;
        if (!profilePicture) {
            return res.status(400).json({ msg: 'Profile Picture is Required!' });
        }
        if (!newUser.username || !newUser.email || !newUser.password) {
            return res.status(400).json({ msg: "All fields are required!" });
        }
        const hashedPassword = await bcrypt_1.default.hash(newUser.password, 5);
        const [insertedUser] = await db_1.default.insert(user_1.UserTable).values({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword,
            profilePicture: `https://posthog-backend.onrender.com/${profilePicture}`
        }).returning({ insertedId: user_1.UserTable.id });
        // Track the event for user creation
        client.capture({
            distinctId: newUser.email,
            event: 'create_user',
            properties: {
                username: newUser.username,
                email: newUser.email,
                method: req.method,
                path: req.originalUrl,
                timestamp: new Date().toISOString()
            }
        });
        return res.status(200).json({ msg: "User added Sucessfully!", users: insertedUser });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}
async function deleteUser(req, res) {
    try {
        const idString = req.params.id;
        const id = parseInt(idString);
        if (!id) {
            return res.status(400).json({ message: "No User exist with that id!" });
        }
        await db_1.default.delete(user_1.UserTable).where((0, drizzle_orm_1.eq)(user_1.UserTable.id, id));
        // Track the event for user deletion
        client.capture({
            distinctId: idString,
            event: 'delete_user',
            properties: {
                userId: id,
                method: req.method,
                path: req.originalUrl,
                timestamp: new Date().toISOString()
            }
        });
        return res.status(200).json({ message: `User deleted with id:${id}` });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        // Check if the email or password is missing
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }
        // Fetch user with the given email
        const users = await db_1.default.select().from(user_1.UserTable).where((0, drizzle_orm_1.eq)(user_1.UserTable.email, email));
        // Check if a user exists with the given email
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }
        const user = users[0]; // Assuming email is unique, we'll get one user
        // Compare the password with the stored password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }
        // Generate JWT token for the user
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
        // Track the event for user login
        client.capture({
            distinctId: email,
            event: 'login_user',
            properties: {
                userId: user.id,
                email: email,
                method: req.method,
                path: req.originalUrl,
                timestamp: new Date().toISOString()
            }
        });
        // Return the token as a response
        return res.status(200).json({ token });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
async function getSingleUser(req, res) {
    try {
        const paramsId = req.params.id;
        const parsedId = parseInt(paramsId);
        const singleUser = await db_1.default.select().from(user_1.UserTable).where((0, drizzle_orm_1.eq)(user_1.UserTable.id, parsedId));
        if (!singleUser) {
            return res.status(400).json({
                msg: 'No user Found',
            });
        }
        return res.status(200).json({
            msg: 'User Fetched Sucessfully',
            user: singleUser
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=user.js.map