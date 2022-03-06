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
const User_1 = require("../../entity/User");
const UserMarathonScore_1 = require("../../entity/UserMarathonScore");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const status_codes_1 = require("../../util/status-codes");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.saveUserMarathonActivity = router;
router.post("/api/marathon/save-user-marathon-activity", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const currentUserMarathonScore = yield UserMarathonScore_1.UserMarathonScore.findOne({
            userId: user.id,
            id: marathonData.userMarathonScoreId,
        });
        if (!currentUserMarathonScore) {
            return res
                .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                .send("There was an error retrieving user's marathon data.");
        }
        currentUserMarathonScore.bodyMoves += marathonData.bodyMoves;
        yield currentUserMarathonScore.save();
        return res.status(status_codes_1.STATUS_CODE.OK).send(currentUserMarathonScore);
    }
    catch (error) {
        console.error(error);
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("There was an internal error with this request.");
    }
}));
