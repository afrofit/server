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
exports.saveUserActivityRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../entity/User");
const UserActivityToday_1 = require("../../entity/UserActivityToday");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const validate_responses_1 = require("../../util/validate-responses");
const UserPerformance_1 = require("../../entity/UserPerformance");
const status_codes_1 = require("../../util/status-codes");
const controllers_1 = __importDefault(require("./controllers"));
const router = express_1.default.Router();
exports.saveUserActivityRouter = router;
router.post("/api/performance/save-user-activity", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityData } = req.body;
    /**
     * Activity Data needs to have
     * contentStoryId
     * contentChapterId
     */
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateActivityData)(req.body);
    if (error)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    let user = yield User_1.User.findOne({ email: req.currentUser.email });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.UNAUTHORIZED)
            .send("Sorry! Something went wrong.");
    try {
        let userDailyActivity, userPerformanceData;
        userDailyActivity = yield controllers_1.default.getUserDailyActivity(user);
        if (!userDailyActivity) {
            userDailyActivity = yield UserActivityToday_1.UserActivityToday.create({
                userId: user.id,
            }).save();
        }
        else {
            userDailyActivity.bodyMoves += activityData.bodyMoves;
            userDailyActivity.caloriesBurned += activityData.caloriesBurned;
            yield userDailyActivity.save();
        }
        const userActiveDays = yield controllers_1.default.getActiveDays(user);
        userPerformanceData = yield controllers_1.default.getUserPerformanceData(user);
        if (!userPerformanceData) {
            userPerformanceData = yield UserPerformance_1.UserPerformance.create({
                userId: user.id,
            }).save();
        }
        else {
            userPerformanceData.totalBodyMoves += activityData.bodyMoves;
            userPerformanceData.totalCaloriesBurned += activityData.caloriesBurned;
            userPerformanceData.totalTimeDancedInMilliseconds +=
                activityData.totalTimeDancedInMilliseconds;
            userPerformanceData.totalDaysActive = userActiveDays;
            yield userPerformanceData.save();
        }
        return res
            .status(status_codes_1.STATUS_CODE.OK)
            .send({ perfomance: userPerformanceData, daily: userDailyActivity });
    }
    catch (error) {
        console.error(error);
        return res.status(status_codes_1.STATUS_CODE.INTERNAL_ERROR).send(null);
    }
}));
