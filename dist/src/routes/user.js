"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const multerConfig_1 = require("../../multerConfig");
const router = express_1.default.Router();
router.route('/').get(user_1.getUser).post(multerConfig_1.upload.single('file'), user_1.createUser);
router.route('/login').post(user_1.loginUser);
router.route('/:id').delete(user_1.deleteUser).get(user_1.getSingleUser);
exports.default = router;
//# sourceMappingURL=user.js.map