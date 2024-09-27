import express from "express";
import { createUser, deleteUser, getUser, loginUser, getSingleUser } from "../controllers/user";
import { upload } from "../../multerConfig";
const router = express.Router();
router.route('/').get(getUser).post(upload.single('file'), createUser);
router.route('/login').post(loginUser);
router.route('/:id').delete(deleteUser).get(getSingleUser);
export default router;
//# sourceMappingURL=user.js.map