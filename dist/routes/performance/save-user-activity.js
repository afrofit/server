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
const typeorm_1 = require("typeorm");
const date_fns_1 = require("date-fns");
const User_1 = require("../../entity/User");
const UserActivityToday_1 = require("../../entity/UserActivityToday");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const validate_responses_1 = require("../../util/validate-responses");
const UserPerformance_1 = require("../../entity/UserPerformance");
const ActiveDay_1 = require("../../entity/ActiveDay");
const status_codes_1 = require("../../util/status-codes");
const router = express_1.default.Router();
exports.saveUserActivityRouter = router;
router.post("/api/performance/save-user-activity", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { activityData } = req.body;
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
        const userDailyActivity = yield UserActivityToday_1.UserActivityToday.findOne({
            where: {
                userId: user.id,
                dayEndTime: (0, typeorm_1.LessThan)(date_fns_1.endOfToday),
                dayStartTime: (0, typeorm_1.MoreThan)(date_fns_1.startOfToday),
            },
        });
        if (!userDailyActivity)
            return res
                .status(status_codes_1.STATUS_CODE.NO_CONTENT)
                .send("An unexpected error occured");
        userDailyActivity.bodyMoves += activityData.bodyMoves;
        userDailyActivity.caloriesBurned += activityData.caloriesBurned;
        yield userDailyActivity.save();
        const userPerformanceData = yield UserPerformance_1.UserPerformance.findOne({
            where: {
                userId: user.id,
            },
        });
        if (!userPerformanceData)
            return res
                .status(status_codes_1.STATUS_CODE.NO_CONTENT)
                .send("An unexpected error occured");
        userPerformanceData.totalBodyMoves += activityData.bodyMoves;
        userPerformanceData.totalCaloriesBurned += activityData.caloriesBurned;
        userPerformanceData.totalTimeDancedInMilliseconds +=
            activityData.totalTimeDancedInMilliseconds;
        let activeDay = yield ActiveDay_1.ActiveDay.findOne({
            where: {
                userId: user.id,
                dayEndTime: (0, typeorm_1.LessThan)(date_fns_1.endOfToday),
                dayStartTime: (0, typeorm_1.MoreThan)(date_fns_1.startOfToday),
            },
        });
        if (!activeDay) {
            const activeDay = yield ActiveDay_1.ActiveDay.create({
                userId: user.id,
            });
            userPerformanceData.totalDaysActive += 1;
            yield activeDay.save();
        }
        else if (activeDay) {
            userPerformanceData.totalDaysActive += 0;
        }
        yield userPerformanceData.save();
        return res.status(status_codes_1.STATUS_CODE.OK).send({ success: true });
    }
    catch (error) {
        console.error(error);
    }
    return res.send({});
}));
