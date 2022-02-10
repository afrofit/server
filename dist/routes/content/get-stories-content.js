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
exports.getStoriesContentRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../entity/User");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const sanity_client_1 = __importDefault(require("../../util/sanity-client"));
const status_codes_1 = require("../../util/status-codes");
const router = express_1.default.Router();
exports.getStoriesContentRouter = router;
router.get("/api/content/get-stories-content", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.BAD_REQUEST)
            .send("Sorry! Something went wrong.");
    let fetchedStories;
    try {
        fetchedStories = yield sanity_client_1.default.fetch(`*[_type=="story"]{_id, title, storyOrderNumber, "thumb": thumbnail.asset->url} | order(storyOrderNumber asc)`);
        /**
         * Here we must also fetch array of StoryPlayed
         * Map an Array that returns objects containing both content and user performance
         * Then return that array to FE
         * Since array size is guaranteed to always be < 100,
         * This shouldn't be too expensive
         */
        return res.status(status_codes_1.STATUS_CODE.OK).send(fetchedStories) || null;
    }
    catch (error) {
        console.error(error);
    }
    return res.send([]);
}));
//
