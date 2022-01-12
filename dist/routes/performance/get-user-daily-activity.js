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
exports.getUserDailyActivityRouter = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const User_1 = require("../../entity/User");
const UserActivityToday_1 = require("../../entity/UserActivityToday");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const calculators_1 = require("../../util/calculators");
const router = express_1.default.Router();
exports.getUserDailyActivityRouter = router;
router.get("/api/performance/get-user-daily-activity", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(403).send("Access Forbidden.");
    const TODAY = (0, calculators_1.calculateDayStart)();
    // What's today?
    // Set time to 1 AM today -- that's your start time
    // Set time to 11:59 pm today -- that's your end time
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res.status(400).send("Sorry! Something went wrong.");
    try {
        const userActivityRepository = (0, typeorm_1.getRepository)(UserActivityToday_1.UserActivityToday);
        let userActivity = yield userActivityRepository.find({
            where: {
                userId: user.id,
                createdAt: (0, typeorm_1.LessThan)(USER_ACTIVITY_EXPIRY_DATE),
            },
        });
        if (!userActivity)
            return res.send(null);
        return res.status(200).send(userActivity);
    }
    catch (error) {
        console.error(error);
    }
}));
