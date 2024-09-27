import express from "express"
import { deleteSingleTask, getTask, getUserSingleTask, getUserTask, deleteTasks, createTask, updateTask } from "../controllers/task"
import authMiddleware from "../middleware/auth"

const router=express.Router()
router.route('/').get(getTask)
router.route('/:userId').get(authMiddleware,getUserTask).delete(authMiddleware,deleteTasks).post(authMiddleware,createTask)
router.route('/:userId/:taskId').get(authMiddleware,getUserSingleTask).delete(authMiddleware,deleteSingleTask).patch(authMiddleware,updateTask)

export default router

