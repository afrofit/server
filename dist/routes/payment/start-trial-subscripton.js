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
exports.startTrialSubscriptionRouter = void 0;
const express_1 = __importDefault(require("express"));
const Payment_1 = require("../../entity/Payment");
const Subscription_1 = require("../../entity/Subscription");
const User_1 = require("../../entity/User");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const calculators_1 = require("../../util/calculators");
const router = express_1.default.Router();
exports.startTrialSubscriptionRouter = router;
router.post("/api/subscription/start-trial-subscription", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(403).send("Access Forbidden.");
    let user = yield User_1.User.findOne({ email: req.currentUser.email });
    if (!user)
        return res.status(400).send("Sorry! Something went wrong.");
    try {
        let payment = new Payment_1.Payment();
        payment.user = user;
        payment.amountInGBP = (0, calculators_1.calculatePrices)("trial");
        const subscription = yield Subscription_1.Subscription.create({
            name: "trial",
            durationInDays: (0, calculators_1.calculateSubscriptionDuration)("trial"),
            user,
            payment,
            subscriberId: user.id,
        }).save();
        const subscriptionEndDate = subscription.calculateEndDate();
        subscription.endDate = subscriptionEndDate;
        yield subscription.save();
        console.log("Trial Subber", subscription);
        user.isTrial = true;
        user.isTrialUntil = subscriptionEndDate;
        yield user.save();
        if (!subscription) {
            return res
                .status(503)
                .send("Could not create a subscription. Try again.");
        }
        payment.subscription = subscription;
        yield payment.save();
        if (!payment)
            return res.status(401).send("Payment failed");
        // console.log("Subscription", subscription);
        // console.log("Payment", payment);
        const response = {
            paymentId: payment.id,
            isExpired: subscription.isExpired,
            id: subscription.id,
            userId: subscription.user.id,
            amountInGBP: subscription.payment.amountInGBP,
            name: subscription.name,
            durationInDays: subscription.durationInDays,
            startDate: subscription.createdAt,
            endDate: (0, calculators_1.calculateSubscriptionEndDate)(subscription.createdAt, subscription.durationInDays),
        };
        return res.status(200).send(Object.assign({}, response));
    }
    catch (error) {
        console.error(error);
    }
    return res.send({});
}));
