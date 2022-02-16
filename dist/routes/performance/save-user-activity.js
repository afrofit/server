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
    console.log("ActivityData", activityData);
    console.log("ActivityData ReqBody", req.body);
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateActivityData)(req.body.activityData);
    if (error)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    let user = yield User_1.User.findOne({ email: req.currentUser.email });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.UNAUTHORIZED)
            .send("Sorry! Something went wrong.");
    console.log("We got here!");
    try {
        let userDailyActivity, userPerformanceData, playedStory, playedChapter;
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
        playedStory = yield controllers_1.default.getPlayedStory(user, activityData.contentStoryId);
        if (!playedStory)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Sorry. Could not save your story activity.");
        playedStory.totalBodyMoves += activityData.bodyMoves;
        playedStory.totalUserTimeSpentInMillis +=
            activityData.totalTimeDancedInMilliseconds;
        yield playedStory.save();
        playedChapter = yield controllers_1.default.getPlayedChapter(user, activityData.contentStoryId, activityData.contentChapterId, playedStory.id);
        if (!playedChapter)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Sorry. Could not save your chapter activity.");
        playedChapter.bodyMoves += activityData.bodyMoves;
        playedChapter.timeSpentInMillis +=
            activityData.totalTimeDancedInMilliseconds;
        playedChapter.completed = activityData.chapterCompleted;
        playedChapter.started = activityData.chapterStarted;
        yield playedStory.save();
        console.log("Played", playedChapter, playedStory, userPerformanceData, userDailyActivity);
        /**
         * Look a Played_Story for this user and contentStoryId
         * Look for a Played_Chapter for this user and contentChapterId
         * Update them accordingly
         * They would have been created when user fetches stories/chapters in the first place
         */
        return res.status(status_codes_1.STATUS_CODE.OK).send({
            perfomance: userPerformanceData,
            daily: userDailyActivity,
            chapter: playedChapter,
            story: playedStory,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(status_codes_1.STATUS_CODE.INTERNAL_ERROR).send(null);
    }
}));
