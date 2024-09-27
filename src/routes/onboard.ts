import express from "express"
import { getUserOnboards,postUserOnboards,patchUserOnboards,deleteUserOnboards } from "../controllers/onboard"
const router=express.Router()

router.route('/:userId').get(getUserOnboards).post(postUserOnboards).patch(patchUserOnboards).delete(deleteUserOnboards)

export default router