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
const SubscriptionPayment_1 = require("../../entity/SubscriptionPayment");
const Payment_1 = require("../../entity/Payment");
const status_codes_1 = require("../../util/status-codes");
const router = express_1.default.Router();
exports.getSubscriptionRouter = router;
router.get("/api/subscription/get-subscription", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    let user = yield User_1.User.findOne({ id: req.currentUser.id });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.NOT_ALLOWED)
            .send("Sorry! Something went wrong.");
    const TODAY = new Date();
    try {
        let subscriptionsArray = yield Subscription_1.Subscription.find({
            where: { userId: req.currentUser.id },
            order: { createdAt: "DESC" },
        });
        if (!subscriptionsArray || !subscriptionsArray.length)
            return res.status(status_codes_1.STATUS_CODE.NO_CONTENT).send(null);
        const latestSubscription = subscriptionsArray[0];
        if (new Date(latestSubscription.endDate) < TODAY) {
            latestSubscription.isExpired = true;
            yield latestSubscription.save();
            // Find payment and jointable here and mark payment as expired too
            const paymentSubscriptionJoinTable = yield SubscriptionPayment_1.SubscriptionPayment.findOne({
                where: { userId: user.id, subscriptionId: latestSubscription.id },
            });
            if (!paymentSubscriptionJoinTable)
                return res
                    .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                    .send("This subscription doesn't exist or is expired!");
            const currentPayment = yield Payment_1.Payment.findOne({
                isActive: true,
                userId: user.id,
                id: paymentSubscriptionJoinTable.paymentId,
            });
            if (!currentPayment)
                return res
                    .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
                    .send("This payment doesn't exist or is expired!");
            latestSubscription.isExpired = true;
            currentPayment.isActive = false;
            yield currentPayment.save();
            return res.status(status_codes_1.STATUS_CODE.NO_CONTENT).send(null);
        }
        else if (new Date(latestSubscription.endDate) > TODAY) {
            return res.status(status_codes_1.STATUS_CODE.OK).send(latestSubscription);
        }
        /**
         * You can constantly check here if subscription is about to end to
         * Then trigger an email to users alerting them of this
         */
    }
    catch (error) {
        console.error(error);
    }
}));
