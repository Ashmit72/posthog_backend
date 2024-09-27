"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const onboard_1 = require("../controllers/onboard");
const router = express_1.default.Router();
router.route('/:userId').get(onboard_1.getUserOnboards).post(onboard_1.postUserOnboards).patch(onboard_1.patchUserOnboards).delete(onboard_1.deleteUserOnboards);
exports.default = router;
//# sourceMappingURL=onboard.js.map