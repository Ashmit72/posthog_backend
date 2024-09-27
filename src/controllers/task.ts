import { Request, Response } from "express";
import db from "../../db/db";
import {Taskstable} from "../../schema/task"
import { eq } from "drizzle-orm";
import { PostHog } from "posthog-node";

const client=new PostHog('phc_68dZt6F76WvG5j36CIC3esc7DJ4axdG7Y0VstmjFJtn',{
    host:'https://us.i.posthog.com'
})

export async function getTask(req:Request,res:Response){
    try {
        const getTasks=await db.select().from(Taskstable)

        //CAPTURE EVENT TO POSTHOG
        client.capture({
            distinctId:'backend',
            event:'get_tasks',
            properties:{
                taskCount:getTasks.length,
                timestamp:getTasks
            }
        })
        if (getTasks.length===0) {
            return res.status(201).json({
                msg:'There are no tasks',
                tasks:getTasks
            })
        }
        return res.status(200).json(getTasks)
        
    } catch (error) {
       return res.status(500).json({msg:error.message})
    }
}

export async function getUserTask(req:Request,res:Response){
    try {
        const paramId=req.params.userId
        const id=parseInt(paramId)
        const userTasks=await db.select().from(Taskstable).where(eq(Taskstable.userId,id))
        if (userTasks.length===0) {
           return res.status(400).json({
                msg:"User has no Tasks",
                tasks:userTasks
            })
        }
        return res.status(200).json({
            tasks:userTasks
        })
    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
}

export async function getUserSingleTask(req: Request, res: Response) {
    try {
        const { userId, taskId } = req.params;
        const parsedUserId = parseInt(userId);
        const parsedTaskId = parseInt(taskId);

        if (isNaN(parsedUserId) || isNaN(parsedTaskId)) {
            return res.status(400).json({ msg: "Invalid user ID or task ID" });
        }

        const userTask = await db.select().from(Taskstable).where(eq(Taskstable.id, parsedTaskId))

        if (!userTask) {
            return res.status(404).json({ msg: "Task not found for this user" });
        }

        return res.status(200).json({
            userId:parsedUserId,
            task:userTask
        });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export async function deleteTasks(req:Request,res:Response){
    try {
        const {userId}=req.params
        const parsedUserId=parseInt(userId)
        await db.delete(Taskstable).where(eq(Taskstable.userId,parsedUserId ))
        
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
            msg:"All Tasks Deleted!"
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}


export async function deleteSingleTask(req:Request,res:Response){
    try {
        const { userId, taskId } = req.params;
        const parsedUserId = parseInt(userId);
        const parsedTaskId = parseInt(taskId);
        
        if (isNaN(parsedUserId) || isNaN(parsedTaskId)) {
            return res.status(400).json({ msg: "Invalid user ID or task ID" });
        }
        await db.delete(Taskstable).where(eq(Taskstable.id, parsedTaskId))
        return res.status(200).json({
            msg:"Task Deleted Sucessfully"
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export async function createTask(req: Request, res: Response) {
    try {
        const { userId } = req.params;
        const parsedUserId = parseInt(userId);
        const { title, description } = req.body;

        if (!title || !description === undefined) {
            return res.status(400).json({
                msg: "All fields are required!"
            });
        }
        const taskData={
            title,
            description,
            userId:parsedUserId
        }
        await db.insert(Taskstable).values(taskData)

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
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export async function updateTask(req: Request, res: Response){
    try {
        const {userId,taskId}=req.params
        const {title,description,completed}=req.body
        const parsedUserId = parseInt(userId);
        const parsedTaskId = parseInt(taskId);
        if (isNaN(parsedUserId) || isNaN(parsedTaskId)) {
            return res.status(400).json({ msg: "Invalid user ID or task ID" });
        }
        const updatedData={
            title,
            description,
            completed
        }
        await db.update(Taskstable).set(updatedData).where(eq(Taskstable.id,parsedTaskId))
        return res.status(200).json({
            "msg":"Data Updated Successfully!",
            "task":updatedData
        })
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

