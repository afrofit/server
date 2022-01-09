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
exports.expireSubscriptionRouter = void 0;
const express_1 = __importDefault(require("express"));
const Subscription_1 = require("../../entity/Subscription");
const User_1 = require("../../entity/User");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const router = express_1.default.Router();
exports.expireSubscriptionRouter = router;
router.post("/api/subscription/expire-subscription", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriptionId } = req.body;
    console.log("Expired Subscription Req Body", req.body);
    console.log("Expired Subscription Sub ID", subscriptionId);
    if (!req.currentUser)
        return res.status(403).send("Access Forbidden.");
    //Find a user from the header token here
    let user = yield User_1.User.findOne({ email: req.currentUser.email });
    console.log("Did we find a User?", user.id);
    if (!user)
        return res.status(400).send("That's an illegal action.");
    let currentSub = yield Subscription_1.Subscription.findOne({
        isExpired: false,
        subscriberId: user.id,
        id: subscriptionId,
    });
    console.log("Did we find a Current Subsciption Object?", currentSub);
    if (!currentSub)
        return res
            .status(400)
            .send("This subscription doesn't exist or is expired!");
    // console.log(currentSub);
    try {
        currentSub.isExpired = true;
        yield currentSub.save();
        user.isTrial = false;
        user.isPremium = false;
        user.isPremiumUntil = "";
        user.isTrialUntil = "";
        yield user.save();
    }
    catch (error) {
        console.error(error);
    }
    const token = user.generateToken();
    return res
        .header(process.env.CUSTOM_TOKEN_HEADER, token)
        .send({ token: token, response: currentSub });
}));
