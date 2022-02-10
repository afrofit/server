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
exports.getUserActivityRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../entity/User");
const UserActivityToday_1 = require("../../entity/UserActivityToday");
const UserPerformance_1 = require("../../entity/UserPerformance");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const status_codes_1 = require("../../util/status-codes");
const router = express_1.default.Router();
exports.getUserActivityRouter = router;
router.get("/api/performance/get-user-activity", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.UNAUTHORIZED)
            .send("Sorry! Something went wrong.");
    const NOW = new Date();
    const getUserDailyActivity = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const userActivityList = yield UserActivityToday_1.UserActivityToday.find({
            userId: user.id,
        });
        if (!userActivityList || !userActivityList.length) {
            return null;
        }
        const userActivityToday = userActivityList[0];
        if (userActivityToday.dayEndTime > NOW &&
            userActivityToday.dayStartTime < NOW) {
            return userActivityToday;
        }
        else {
            return null;
        }
    });
    const getUserPerformanceData = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const userPerformanceData = yield UserPerformance_1.UserPerformance.findOne({
            where: {
                userId: user.id,
            },
        });
        if (!userPerformanceData) {
            return null;
        }
    });
    try {
        const derivedUserActivityToday = yield getUserDailyActivity(user);
        const derivedUserPerformanceData = yield getUserPerformanceData(user);
        return res.status(status_codes_1.STATUS_CODE.OK).send({
            performance: derivedUserPerformanceData,
            daily: derivedUserActivityToday,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(status_codes_1.STATUS_CODE.INTERNAL_ERROR).send(null);
    }
    // 	let userActivityToday;
    // 	try {
    // 		userActivityToday = await UserActivityToday.findOne({
    // 			where: {
    // 				userId: user.id,
    // 				dayEndTime: MoreThan(NOW),
    // 				dayStartTime: LessThan(NOW),
    // 			},
    // 		});
    // 		if (!userActivityToday) {
    // 			userActivityToday = await UserActivityToday.create({
    // 				userId: user.id,
    // 			}).save();
    // 		}
    // 		return res.status(STATUS_CODE.OK).send(userActivityToday);
    // 	} catch (error) {
    // 		console.error(error);
    // 	}
}));
