"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOnboards = getUserOnboards;
exports.postUserOnboards = postUserOnboards;
exports.patchUserOnboards = patchUserOnboards;
exports.deleteUserOnboards = deleteUserOnboards;
const db_1 = __importDefault(require("../../db/db"));
const onboard_1 = require("../../schema/onboard");
const drizzle_orm_1 = require("drizzle-orm");
const posthog_node_1 = require("posthog-node");
const client = new posthog_node_1.PostHog('phc_68dZt6F76WvG5j36CIC3esc7DJ4axdG7Y0VstmjFJtn', {
    host: 'https://us.i.posthog.com'
});
async function getUserOnboards(req, res) {
    try {
        const paramId = req.params.userId;
        const uid = parseInt(paramId);
        const Onboards = await db_1.default.select().from(onboard_1.OnboardTable).where((0, drizzle_orm_1.eq)(onboard_1.OnboardTable.userId, uid));
        //Capture Onboarding Events to Posthog
        client.capture({
            distinctId: 'backend',
            event: 'get_onboardings',
            properties: {
                timestamp: Onboards
            }
        });
        if (!Onboards) {
            return res.status(400).json({
                msg: "There are no onboards for this user!"
            });
        }
        return res.status(200).json({
            Onboards
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
}
async function postUserOnboards(req, res) {
    try {
        const paramsId = req.params.userId;
        const parsedId = parseInt(paramsId);
        const { food, hobby, nickname } = req.body;
        // console.log(food,hobby,nickname);
        if (!food || !hobby || !nickname) {
            return res.status(400).json({
                msg: "All Feilds are required!"
            });
        }
        const newOnboard = {
            food,
            hobby,
            nickname,
            userId: parsedId
        };
        //Capture Onboarding Events to Posthog
        client.capture({
            distinctId: 'backend',
            event: 'create_onboardings',
            properties: {
                timestamp: newOnboard
            }
        });
        await db_1.default.insert(onboard_1.OnboardTable).values(newOnboard);
        res.status(200).json({
            msg: "Onboard Added Successfully",
            newOnboard
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
}
async function patchUserOnboards(req, res) {
    try {
        const paramsuserId = req.params.userId;
        const parsedUserId = parseInt(paramsuserId);
        const { food, nickname, hobby } = req.body;
        if (!food && !nickname && !hobby) {
            res.status(400).json({
                msg: "None of the feilds are updated!"
            });
        }
        const updatedData = {
            food,
            nickname,
            hobby,
            userId: parsedUserId
        };
        client.capture({
            distinctId: 'backend',
            event: 'update_onboardings',
            properties: {
                timestamp: updatedData
            }
        });
        await db_1.default.update(onboard_1.OnboardTable).set(updatedData).where((0, drizzle_orm_1.eq)(onboard_1.OnboardTable.userId, parsedUserId));
        return res.status(200).json({
            msg: "Onboard Updated Sucessfully!",
            updatedData
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
}
async function deleteUserOnboards(req, res) {
    try {
        const paramsuserId = req.params.userId;
        const parsedUserId = parseInt(paramsuserId);
        if (!parsedUserId) {
            return res.status(400).json({
                msg: "No such User Exists!"
            });
        }
        client.capture({
            distinctId: 'backend',
            event: 'delete_onboardings',
        });
        await db_1.default.delete(onboard_1.OnboardTable).where((0, drizzle_orm_1.eq)(onboard_1.OnboardTable.userId, parsedUserId));
        return res.status(200).json({
            msg: "Onboard Deleted Sucessfully!"
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
}
//# sourceMappingURL=onboard.js.map