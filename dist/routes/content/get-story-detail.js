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
exports.getStoryDetailsContentRouter = void 0;
const express_1 = __importDefault(require("express"));
const sanity_client_1 = __importDefault(require("../../util/sanity-client"));
const queries_1 = __importDefault(require("./queries"));
const mappers_1 = require("./mappers");
const Played_Chapter_1 = require("../../entity/Played_Chapter");
const Played_Story_1 = require("../../entity/Played_Story");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const status_codes_1 = require("../../util/status-codes");
const User_1 = require("../../entity/User");
const router = express_1.default.Router();
exports.getStoryDetailsContentRouter = router;
router.get("/api/content/get-story-detail/:storyId", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.BAD_REQUEST)
            .send("Sorry! Something went wrong.");
    const { storyId } = req.params;
    try {
        let storyPlayed;
        const fetchedStory = yield sanity_client_1.default.fetch(queries_1.default.FETCH_STORY_QUERY(storyId));
        storyPlayed = yield Played_Story_1.PlayedStory.findOne({
            where: {
                userId: user.id,
                contentStoryId: storyId,
            },
        });
        if (!storyPlayed) {
            storyPlayed = yield Played_Story_1.PlayedStory.create({
                userId: user.id,
                contentStoryId: storyId,
            }).save();
        }
        const storyDetail = (0, mappers_1.mapStoryResponse)(fetchedStory[0], storyPlayed);
        const fetchedChapters = yield sanity_client_1.default.fetch(queries_1.default.FETCH_STORY_CHAPTERS_QUERY(fetchedStory[0].storyOrderNumber));
        if (!fetchedChapters)
            return res.send([]);
        if (user && storyPlayed && fetchedChapters && fetchedChapters.length) {
            const newArray = [];
            yield Promise.all(fetchedChapters.map((chapter) => __awaiter(void 0, void 0, void 0, function* () {
                let playerData;
                playerData = yield Played_Chapter_1.PlayedChapter.findOne({
                    userId: user.id,
                    contentChapterId: chapter._id,
                    contentStoryId: storyDetail.contentStoryId,
                });
                if (!playerData) {
                    playerData = yield Played_Chapter_1.PlayedChapter.create({
                        contentStoryId: storyDetail.contentStoryId,
                        contentChapterId: chapter._id,
                        playedStoryId: storyPlayed.id,
                        userId: user.id,
                    }).save();
                }
                newArray.push((0, mappers_1.mapChapterResponse)(chapter, playerData));
            })));
            return res
                .status(status_codes_1.STATUS_CODE.OK)
                .send({ story: storyDetail, chapters: newArray });
        }
    }
    catch (error) {
        console.error(error);
        res.status(status_codes_1.STATUS_CODE.INTERNAL_ERROR).send(null);
    }
}));
//
