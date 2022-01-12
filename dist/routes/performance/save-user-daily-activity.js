"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserDailyActivityRouter = void 0;
const express_1 = __importDefault(require("express"));
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const router = express_1.default.Router();
exports.saveUserDailyActivityRouter = router;
router.post("/api/performance/save-user-daily-activity", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => { });
