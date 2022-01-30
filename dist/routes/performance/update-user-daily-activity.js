"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDailyActivityRouter = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const User_1 = require("../../entity/User");
const UserActivityToday_1 = require("../../entity/UserActivityToday");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.updateUserDailyActivityRouter = router;
router.post("/api/performance/update-user-daily-activity", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(403).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateUserActivityToday)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const { bodyMoves, caloriesBurned } = req.body;
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res.status(400).send("Sorry! Something went wrong.");
    const NOW = new Date();
    let userActivityToday;
    try {
        userActivityToday = yield UserActivityToday_1.UserActivityToday.findOne({
            where: {
                userId: user.id,
                dayEndTime: (0, typeorm_1.MoreThan)(NOW),
                dayStartTime: (0, typeorm_1.LessThan)(NOW),
            },
        });
        if (!userActivityToday) {
            userActivityToday = yield UserActivityToday_1.UserActivityToday.create({}).save();
        }
        userActivityToday.bodyMoves + bodyMoves;
        userActivityToday.caloriesBurned + caloriesBurned;
        yield userActivityToday.save();
        return res.status(201).send(userActivityToday);
    }
    catch (error) {
        console.error(error);
    }
}));
