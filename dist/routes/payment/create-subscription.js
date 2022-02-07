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
const create_subscription_1 = require("../../controllers/create-subscription");
const Payment_1 = require("../../entity/Payment");
const Subscription_1 = require("../../entity/Subscription");
const SubscriptionPayment_1 = require("../../entity/SubscriptionPayment");
const User_1 = require("../../entity/User");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const calculators_1 = require("../../util/calculators");
const status_codes_1 = require("../../util/status-codes");
const validate_responses_1 = require("../../util/validate-responses");
const router = express_1.default.Router();
exports.createSubscriptionRouter = router;
router.post("/api/subscription/create-subscription", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriptionData } = req.body;
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    const { error } = (0, validate_responses_1.validateSubscriptionData)(req.body);
    if (error)
        return res.status(status_codes_1.STATUS_CODE.BAD_REQUEST).send(error.details[0].message);
    let user = yield User_1.User.findOne({ email: req.currentUser.email });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("Sorry! Something went wrong.");
    const TODAY = new Date();
    const durationInDays = (0, calculators_1.calculateSubscriptionDuration)(subscriptionData);
    try {
        // 1. Is there an existing subscription?
        let existingSubscription;
        const existingSubscriptionList = yield Subscription_1.Subscription.find({
            where: { userId: user.id },
            order: { createdAt: "DESC" },
        });
        existingSubscription = existingSubscriptionList[0];
        if (existingSubscription &&
            !existingSubscription.isExpired &&
            new Date(existingSubscription.endDate) < TODAY) {
            // 2. If YES, is it PAST due? THEN set it as expired and GO TO STEP 4
            existingSubscription.isExpired = true;
            yield existingSubscription.save();
            const existingSubPayJoinTable = yield SubscriptionPayment_1.SubscriptionPayment.findOne({
                where: { userId: user.id, subscriptionId: existingSubscription.id },
            });
            if (existingSubPayJoinTable) {
                const existingPayment = yield Payment_1.Payment.findOne({
                    where: { userId: user.id, id: existingSubPayJoinTable.paymentId },
                });
                if (existingPayment) {
                    existingPayment.isActive = false;
                    yield existingPayment.save();
                }
            }
            const response = yield (0, create_subscription_1.createSubscription)(subscriptionData, durationInDays, user.id);
            return res.status(status_codes_1.STATUS_CODE.CREATED).send(response);
        }
        else if (existingSubscription &&
            !existingSubscription.isExpired &&
            new Date(existingSubscription.endDate) > TODAY) {
            // 3. If NO, meaning its still valid, return it with extra freshSubscription field
            const response = {
                isExpired: existingSubscription.isExpired,
                id: existingSubscription.id,
                userId: user.id,
                name: existingSubscription.name,
                durationInDays: existingSubscription.durationInDays,
                startDate: existingSubscription.createdAt,
                endDate: existingSubscription.endDate,
                freshSubscription: false,
            };
            return res.status(status_codes_1.STATUS_CODE.OK).send(response);
        }
        else if (existingSubscription && existingSubscription.isExpired) {
            // 3. If NO, meaning its still valid, return it with extra freshSubscription field
            const response = yield (0, create_subscription_1.createSubscription)(subscriptionData, durationInDays, user.id);
            return res.status(status_codes_1.STATUS_CODE.OK).send(response);
        }
        else if (!existingSubscription) {
            // 4. If there's no existing subscription, then create a new one and send it
            const response = yield (0, create_subscription_1.createSubscription)(subscriptionData, durationInDays, user.id);
            return res.status(status_codes_1.STATUS_CODE.CREATED).send(response);
        }
    }
    catch (error) {
        console.error(error);
        return res.status(status_codes_1.STATUS_CODE.INTERNAL_ERROR).send({});
    }
}));
