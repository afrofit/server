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
exports.createSubscriptionRouter = void 0;
const express_1 = __importDefault(require("express"));
const Payment_1 = require("../../entity/Payment");
const Subscription_1 = require("../../entity/Subscription");
const User_1 = require("../../entity/User");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const calculators_1 = require("../../util/calculators");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.createSubscriptionRouter = router;
router.post("/api/subscription/create-subscription", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriptionData } = req.body;
    if (!req.currentUser)
        return res.status(403).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateSubscriptionData)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = yield User_1.User.findOne({ email: req.currentUser.email });
    if (!user)
        return res.status(400).send("Sorry! Something went wrong.");
    // Let's check if user has already used a trial in the past
    if (subscriptionData === "trial" && !user.hasTrial)
        return res.status(400).send("Sorry! This user has already used a trial");
    try {
        let payment = new Payment_1.Payment();
        payment.user = user;
        payment.amountInGBP = (0, calculators_1.calculatePrices)(subscriptionData);
        const subscription = yield Subscription_1.Subscription.create({
            name: subscriptionData,
            durationInDays: (0, calculators_1.calculateSubscriptionDuration)(subscriptionData),
            user,
            payment,
            subscriberId: user.id,
        }).save();
        const subscriptionEndDate = subscription.calculateEndDate();
        subscription.endDate = subscriptionEndDate;
        yield subscription.save();
        if (subscriptionData !== "trial") {
            user.isPremium = true;
            user.isPremiumUntil = subscriptionEndDate;
            user.isTrial = false;
            user.isTrialUntil = "";
            yield user.save();
        }
        else {
            user.isTrial = true;
            user.hasTrial = false;
            user.isTrialUntil = subscriptionEndDate;
            user.isPremium = false;
            user.isPremiumUntil = "";
            yield user.save();
        }
        console.log("Regular Subber", Object.assign(Object.assign({}, subscription), { amountInGBP: subscription.payment.amountInGBP, user: subscription.user.id }));
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
        const token = user.generateToken();
        return res
            .header(process.env.CUSTOM_TOKEN_HEADER, token)
            .send({ token: token, response: response });
    }
    catch (error) {
        console.error(error);
    }
    return res.send({});
}));
