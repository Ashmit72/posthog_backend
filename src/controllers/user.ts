import { Request, Response } from "express";
import { UserTable } from "../../schema/user"
import db from "../../db/db";
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt"
import { PostHog } from "posthog-node";

configDotenv()
const JWT_SECRET = process.env.JWT_SECRET

const client = new PostHog('phc_68dZt6F76WvG5j36CIC3esc7DJ4axdG7Y0VstmjFJtn', {
    host: 'https://us.i.posthog.com'
})

export async function getUser(req: Request, res: Response) {
    try {
        const allUsers = await db.select().from(UserTable)
        if (allUsers.length === 0) {
            return res.json({ message: 'There are no users', allUsers })
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

        return res.json({ users: allUsers })

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const newUser = await req.body
        const profilePicture=req.file ? req.file.path : null;
        if (!profilePicture) {
            return res.status(400).json({msg:'Profile Picture is Required!'})
        }
        if (!newUser.username || !newUser.email || !newUser.password) {
            return res.status(400).json({ msg: "All fields are required!" })
        }
        const hashedPassword = await bcrypt.hash(newUser.password, 5)
       const [insertedUser]= await db.insert(UserTable).values({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword,
           profilePicture:`http://13.233.168.114:8080/${profilePicture}`
        }).returning({insertedId:UserTable.id})

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
        return res.status(200).json({ msg: "User added Sucessfully!", users: insertedUser })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const idString = req.params.id
        const id = parseInt(idString)
        if (!id) {
            return res.status(400).json({ message: "No User exist with that id!" })
        }
        await db.delete(UserTable).where(eq(UserTable.id, id))

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
        return res.status(200).json({ message: `User deleted with id:${id}` })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Check if the email or password is missing
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        // Fetch user with the given email
        const users = await db.select().from(UserTable).where(eq(UserTable.email, email));

        // Check if a user exists with the given email
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const user = users[0];  // Assuming email is unique, we'll get one user

        // Compare the password with the stored password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        // Generate JWT token for the user
        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET!,
            { expiresIn: "1d" }
        );

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

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getSingleUser(req:Request,res:Response){
    try {
        const paramsId=req.params.id;
        const parsedId=parseInt(paramsId)
        const singleUser=await db.select().from(UserTable).where(eq(UserTable.id,parsedId))
        if (!singleUser) {
            return res.status(400).json({
                msg:'No user Found',
            })
        }
        return res.status(200).json({
            msg:'User Fetched Sucessfully',
            user:singleUser
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}