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
exports.resetStoryContentActivityRouter = void 0;
const express_1 = __importDefault(require("express"));
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const status_codes_1 = require("../../util/status-codes");
const User_1 = require("../../entity/User");
const validate_responses_1 = require("../../util/validate-responses");
const controllers_1 = __importDefault(require("./controllers"));
const Played_Chapter_1 = require("../../entity/Played_Chapter");
const router = express_1.default.Router();
exports.resetStoryContentActivityRouter = router;
router.post("/api/performance/reset-story-content-activity", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetContentData } = req.body;
    console.log("Content Played Data", req.body);
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateResetContentData)(resetContentData);
    if (error)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    const user = yield User_1.User.findOne({ email: req.currentUser.email });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.UNAUTHORIZED)
            .send("Sorry! Something went wrong.");
    try {
        const playedStory = yield controllers_1.default.getPlayedStory(user, resetContentData.contentStoryId);
        if (!playedStory)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Sorry. Could not save your story activity.");
        playedStory.totalBodyMoves = 0;
        playedStory.totalUserTimeSpentInMillis = 0;
        playedStory.started = false;
        playedStory.completed = false;
        yield playedStory.save();
        const storyChapters = yield Played_Chapter_1.PlayedChapter.find({
            userId: user.id,
            contentStoryId: resetContentData.contentStoryId,
        });
        if (!storyChapters || !storyChapters.length)
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("Sorry could not retrieve chapters.");
        if (user && storyChapters && storyChapters.length) {
            const resetChapters = [];
            yield Promise.all(storyChapters.map((chapter) => __awaiter(void 0, void 0, void 0, function* () {
                chapter.bodyMoves = 0;
                chapter.caloriesBurned = 0;
                chapter.timeSpentInMillis = 0;
                chapter.completed = false;
                chapter.started = false;
                yield chapter.save();
                resetChapters.push(chapter);
            })));
            console.log({
                chapters: resetChapters,
                story: playedStory,
            });
            return res.status(status_codes_1.STATUS_CODE.OK).send({
                chapters: resetChapters,
                story: playedStory,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("There was an internal error.");
    }
}));
