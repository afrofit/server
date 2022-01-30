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
exports.createLeaderboardRouter = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const Leaderboard_1 = require("../../entity/Leaderboard");
const router = express_1.default.Router();
exports.createLeaderboardRouter = router;
router.get("/api/marathon/create-leaderboard", 
// [isAuth, isCurrentUser],
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (!req.currentUser) return res.status(403).send("Access Forbidden.");
    // let user = await User.findOne({ id: req.currentUser.id });
    // if (!user) return res.status(400).send("Sorry! Something went wrong.");
    const TODAY = new Date();
    try {
        const existingLeaderboard = yield Leaderboard_1.Leaderboard.findOne({
            where: {
                endDate: (0, typeorm_1.MoreThan)(TODAY),
                startDate: (0, typeorm_1.LessThan)(TODAY),
            },
        });
        console.log("Existing Leaderboard", existingLeaderboard);
        if (existingLeaderboard)
            return res.status(200).send(existingLeaderboard);
        const leaderboard = yield Leaderboard_1.Leaderboard.create().save();
        if (!leaderboard) {
            return res.status(400).send("Could not create a leaderboard!");
        }
        console.log("Leaderboard", leaderboard);
        return res.status(200).send(leaderboard);
    }
    catch (error) {
        console.error(error);
    }
}));
