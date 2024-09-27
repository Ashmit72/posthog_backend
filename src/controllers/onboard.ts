import { Request, Response } from "express";
import db from "../../db/db";
import { OnboardTable } from "../../schema/onboard"
import { eq } from "drizzle-orm";
import { PostHog } from "posthog-node";

const client = new PostHog('phc_68dZt6F76WvG5j36CIC3esc7DJ4axdG7Y0VstmjFJtn', {
    host: 'https://us.i.posthog.com'
})
export async function getUserOnboards(req: Request, res: Response) {
    try {
        const paramId = req.params.userId
        const uid = parseInt(paramId)
        const Onboards = await db.select().from(OnboardTable).where(eq(OnboardTable.userId, uid))

        //Capture Onboarding Events to Posthog
        client.capture({
            distinctId: 'backend',
            event: 'get_onboardings',
            properties: {
                timestamp: Onboards
            }
        })

        if (!Onboards) {
            return res.status(400).json({
                msg: "There are no onboards for this user!"
            })
        }
        return res.status(200).json({
            Onboards
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}

export async function postUserOnboards(req: Request, res: Response) {
    try {
        const paramsId = req.params.userId
        const parsedId = parseInt(paramsId)
        const { food, hobby, nickname } = req.body
        // console.log(food,hobby,nickname);
        
        if (!food || !hobby || !nickname) {
            return res.status(400).json({
                msg: "All Feilds are required!"
            })
        }
        const newOnboard = {
            food,
            hobby,
            nickname,
            userId: parsedId
        }
        //Capture Onboarding Events to Posthog
        client.capture({
            distinctId: 'backend',
            event: 'create_onboardings',
            properties: {
                timestamp: newOnboard
            }
        })
        await db.insert(OnboardTable).values(newOnboard)
        res.status(200).json({
            msg: "Onboard Added Successfully",
            newOnboard
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}

export async function patchUserOnboards(req: Request, res: Response) {
    try {
        const paramsuserId = req.params.userId
        const parsedUserId = parseInt(paramsuserId);

        const { food, nickname, hobby } = req.body
        if (!food && !nickname && !hobby) {
            res.status(400).json({
                msg: "None of the feilds are updated!"
            })
        }
        const updatedData = {
            food,
            nickname,
            hobby,
            userId: parsedUserId
        }
        client.capture({
            distinctId: 'backend',
            event: 'update_onboardings',
            properties: {
                timestamp: updatedData
            }
        })
        await db.update(OnboardTable).set(updatedData).where(eq(OnboardTable.userId, parsedUserId))
        return res.status(200).json({
            msg: "Onboard Updated Sucessfully!",
            updatedData
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}

export async function deleteUserOnboards(req: Request, res: Response) {
    try {
        const paramsuserId = req.params.userId
        const parsedUserId = parseInt(paramsuserId);
        if (!parsedUserId) {
            return res.status(400).json({
                msg: "No such User Exists!"
            })
        }
        client.capture({
            distinctId: 'backend',
            event: 'delete_onboardings',
        })
        await db.delete(OnboardTable).where(eq(OnboardTable.userId, parsedUserId))
        return res.status(200).json({
            msg: "Onboard Deleted Sucessfully!"
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })
    }
}