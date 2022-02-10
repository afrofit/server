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
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const ActiveDay_1 = require("../../entity/ActiveDay");
const UserActivityToday_1 = require("../../entity/UserActivityToday");
const UserPerformance_1 = require("../../entity/UserPerformance");
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
    return userPerformanceData;
});
const getActiveDays = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const activeDayList = yield ActiveDay_1.ActiveDay.find({
        where: { userId: user.id },
        order: { createdAt: "DESC" },
    });
    if (!activeDayList || !activeDayList.length) {
        yield ActiveDay_1.ActiveDay.create({ userId: user.id }).save();
        return 1;
    }
    const latestActiveDay = activeDayList[0];
    if ((0, date_fns_1.isToday)(new Date(latestActiveDay.createdAt))) {
        return activeDayList.length;
    }
    else {
        yield ActiveDay_1.ActiveDay.create({ userId: user.id }).save();
        return activeDayList.length + 1;
    }
});
exports.default = { getUserDailyActivity, getUserPerformanceData, getActiveDays };
