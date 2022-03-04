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
exports.saveUserMarathonActivity = void 0;
const express_1 = __importDefault(require("express"));
const weekly_leaderboard_1 = require("../../controllers/weekly-leaderboard");
const User_1 = require("../../entity/User");
const UserMarathonScore_1 = require("../../entity/UserMarathonScore");
const status_codes_1 = require("../../util/status-codes");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.saveUserMarathonActivity = router;
router.post("/api/marathon/save-user-marathon-activity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { marathonData } = req.body;
    console.log("Content Played Data", req.body);
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateMarathonData)(marathonData);
    if (error)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.BAD_REQUEST)
            .send("Sorry! Something went wrong.");
    try {
        const activeLeaderboard = yield (0, weekly_leaderboard_1.getActiveLeaderboard)();
        if (!activeLeaderboard)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Error fetching leaderboard");
        const currentUserMarathonScore = yield UserMarathonScore_1.UserMarathonScore.findOne({
            userId: user.id,
            marathonId: activeLeaderboard.id,
        });
        if (!currentUserMarathonScore)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Sorry. Cannot find current user's marathon data.");
        currentUserMarathonScore.bodyMoves += marathonData.bodyMoves;
        yield currentUserMarathonScore.save();
    }
    catch (error) {
        console.error(error);
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("There was an internal error with this request.");
    }
}));
