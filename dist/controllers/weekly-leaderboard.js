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
exports.getActiveLeaderboard = exports.createWeeklyLeaderboard = void 0;
const typeorm_1 = require("typeorm");
const Leaderboard_1 = require("../entity/Leaderboard");
const TODAY = new Date();
const createWeeklyLeaderboard = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingLeaderboard = yield Leaderboard_1.Leaderboard.findOne({
            where: {
                endDate: (0, typeorm_1.MoreThan)(TODAY),
                startDate: (0, typeorm_1.LessThan)(TODAY),
            },
        });
        console.log("Existing Leaderboard", existingLeaderboard);
        if (existingLeaderboard)
            return existingLeaderboard;
        const leaderboard = yield Leaderboard_1.Leaderboard.create().save();
        if (!leaderboard) {
            throw new Error("Could not create a leaderboard!");
        }
        console.log("Leaderboard", leaderboard);
        return leaderboard;
    }
    catch (error) {
        console.error(error);
    }
});
exports.createWeeklyLeaderboard = createWeeklyLeaderboard;
const getActiveLeaderboard = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const weeklyLeaderboard = yield Leaderboard_1.Leaderboard.findOne({
            where: {
                endDate: (0, typeorm_1.MoreThan)(TODAY),
                startDate: (0, typeorm_1.LessThan)(TODAY),
            },
        });
        if (!weeklyLeaderboard) {
            throw new Error("Could not get this week's leaderboard!");
        }
        return weeklyLeaderboard;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getActiveLeaderboard = getActiveLeaderboard;
