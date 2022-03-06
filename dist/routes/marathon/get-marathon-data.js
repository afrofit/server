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
exports.getCurrentMarathonDataRouter = void 0;
const express_1 = __importDefault(require("express"));
const weekly_leaderboard_1 = require("../../controllers/weekly-leaderboard");
const User_1 = require("../../entity/User");
const UserMarathonScore_1 = require("../../entity/UserMarathonScore");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const status_codes_1 = require("../../util/status-codes");
const router = express_1.default.Router();
exports.getCurrentMarathonDataRouter = router;
router.get("/api/marathon/get-current-marathon-data", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    const user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.BAD_REQUEST)
            .send("Sorry! Something went wrong.");
    const LOWER_LIMIT = 195;
    try {
        const activeLeaderboard = yield (0, weekly_leaderboard_1.createWeeklyLeaderboard)();
        if (!activeLeaderboard)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Error fetching leaderboard");
        const userMarathonScoresArray = yield UserMarathonScore_1.UserMarathonScore.find({
            where: { marathonId: activeLeaderboard.id },
            order: { bodyMoves: "DESC" },
            skip: 0,
            take: LOWER_LIMIT,
        });
        if (!userMarathonScoresArray || !userMarathonScoresArray.length)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Sorry. Cannot find marathon data.");
        let currentUserMarathonScore = yield UserMarathonScore_1.UserMarathonScore.findOne({
            userId: user.id,
            marathonId: activeLeaderboard.id,
        });
        if (!currentUserMarathonScore) {
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("There was an error getting marathon data for user.");
        }
        console.log("x ---- x ---- x $ X $ x ----- x ---- x");
        console.log("Datarrr", currentUserMarathonScore, userMarathonScoresArray);
        return res.status(status_codes_1.STATUS_CODE.OK).send({
            score: currentUserMarathonScore,
            listings: userMarathonScoresArray,
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("There was an internal error with this request.");
    }
}));
