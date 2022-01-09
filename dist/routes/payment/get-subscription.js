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
exports.getSubscriptionRouter = void 0;
const express_1 = __importDefault(require("express"));
const Subscription_1 = require("../../entity/Subscription");
const User_1 = require("../../entity/User");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const calculators_1 = require("../../util/calculators");
const router = express_1.default.Router();
exports.getSubscriptionRouter = router;
router.get("/api/subscription/get-subscription", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(403).send("Access Forbidden.");
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res.status(400).send("Sorry! Something went wrong.");
    let currentSub = yield Subscription_1.Subscription.findOne({
        subscriberId: req.currentUser.id,
        isExpired: false,
    });
    if (!currentSub)
        return res.send(null);
    // Check to see if the endDate is elapsed --
    // if true, set isExpired to true return null.
    try {
        const today = new Date();
        const endDate = (0, calculators_1.calculateSubscriptionEndDate)(currentSub.createdAt, currentSub.durationInDays);
        if (today > endDate) {
            currentSub.isExpired = true;
            //You can trigger an email here
            //check logic for three days to expiration and
            //one week to so as to remind client to renew
        }
        return res.status(200).send(currentSub);
    }
    catch (error) {
        console.error(error);
    }
}));
