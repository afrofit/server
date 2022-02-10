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
const Played_Chapter_1 = require("../../entity/Played_Chapter");
const Played_Story_1 = require("../../entity/Played_Story");
const getStoriesPlayed = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const storiesPlayed = yield Played_Story_1.PlayedStory.find({
        userId: user.id,
    });
    if (!storiesPlayed || !storiesPlayed.length) {
        return null;
    }
    return storiesPlayed;
});
const getChaptersplayed = (user, storyId) => __awaiter(void 0, void 0, void 0, function* () {
    const chaptersPlayed = yield Played_Chapter_1.PlayedChapter.find({
        userId: user.id,
        playedStoryId: storyId,
    });
    if (!chaptersPlayed || !chaptersPlayed.length) {
        return null;
    }
    return chaptersPlayed;
});
exports.default = { getChaptersplayed, getStoriesPlayed };
