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
const status_codes_1 = require("../../util/status-codes");
const router = express_1.default.Router();
exports.getCurrentMarathonDataRouter = router;
router.get("/api/marathon/get-current-marathon-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.BAD_REQUEST)
            .send("Sorry! Something went wrong.");
    let currentUserMarathonScoreIndex;
    const LOWER_LIMIT = 200;
    try {
        const activeLeaderboard = yield (0, weekly_leaderboard_1.getActiveLeaderboard)();
        if (!activeLeaderboard)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Error fetching leaderboard");
        const userMarathonScoresArray = yield UserMarathonScore_1.UserMarathonScore.find({
            marathonId: activeLeaderboard.id,
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
            // Create marathon object here.
            currentUserMarathonScore = yield UserMarathonScore_1.UserMarathonScore.create({
                userId: user.id,
                marathonId: activeLeaderboard.id,
            }).save();
        }
        for (const [index, score] of userMarathonScoresArray.entries()) {
            if (score.id === currentUserMarathonScore.id) {
                currentUserMarathonScoreIndex = index;
                break;
            }
        }
        if (!currentUserMarathonScoreIndex)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Could not find user's place on rankings table");
        return res.status(status_codes_1.STATUS_CODE.OK).send({
            index: currentUserMarathonScoreIndex,
            listings: userMarathonScoresArray.slice(0, LOWER_LIMIT),
        });
        /**
         * Fetch a marathon leaderboard that's active
         * Fetch an array of userMarathon Objects with the Marathon Leaderboard ID
         * Find the index of the usermarathon object for this user in the array, return that
         * Return the first 30 records (distributed on FE as ranks)
         * */
    }
    catch (error) {
        console.error(error);
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("There was an internal error with this request.");
    }
}));
