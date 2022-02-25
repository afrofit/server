"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDailyActivityRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.getUserDailyActivityRouter = router;
router.get("/api/marathon/get-marathon-data", (req, res) => { });
