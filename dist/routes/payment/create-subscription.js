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
const lodash_1 = __importDefault(require("lodash"));
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
    const { error } = (0, validate_responses_1.validateSubscriptionType)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    //Find a user from the header token
    let user = yield User_1.User.findOne({ email: req.currentUser.email });
    if (!user)
        return res.status(400).send("Sorry! Something went wrong.");
    try {
        //First we must create a payment and then when that is successful we can create a subscription
        let payment = new Payment_1.Payment();
        payment.user = user;
        payment.amountInGBP = (0, calculators_1.calculatePrices)(subscriptionData);
        // First we need to find a current subscription.
        // If there is one, we can advise the user that a current one exists
        // and they should cancel that one instead
        const subscription = yield Subscription_1.Subscription.create({
            name: subscriptionData,
            durationInDays: (0, calculators_1.calculateSubscriptionDuration)(subscriptionData),
            user,
            payment,
        }).save();
        if (!subscription) {
            return res
                .status(503)
                .send("Could not create a subscription. Try again.");
        }
        payment.subscription = subscription;
        yield payment.save();
        if (!payment)
            return res.status(401).send("Payment failed");
        console.log("Subscription", subscription);
        const subscriptionReponse = lodash_1.default.pick(subscription, [
            "name",
            "durationInDays",
            "createdAt",
            "isExpired",
        ]);
        const paymentResponse = lodash_1.default.pick(payment, ["amountInGBP"]);
        const cumulativeResponse = Object.assign(Object.assign({}, subscriptionReponse), paymentResponse);
        // console.log("Created Cumulative (Clientxx) Response", cumulativeResponse);
        return res.status(200).send(Object.assign({}, cumulativeResponse));
    }
    catch (error) {
        console.error(error);
    }
    return res.send({});
}));
/*
I wanna return

name,
durationInDays,
payment.id,
createdAt as "Subscription StartDate"
subscription.id

*/
