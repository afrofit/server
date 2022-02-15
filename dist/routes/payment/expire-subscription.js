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
const Payment_1 = require("../../entity/Payment");
const Subscription_1 = require("../../entity/Subscription");
const SubscriptionPayment_1 = require("../../entity/SubscriptionPayment");
const User_1 = require("../../entity/User");
const isAuth_1 = require("../../middleware/isAuth");
const isCurrentUser_1 = require("../../middleware/isCurrentUser");
const status_codes_1 = require("../../util/status-codes");
const router = express_1.default.Router();
exports.expireSubscriptionRouter = router;
router.post("/api/subscription/expire-subscription/", [isAuth_1.isAuth, isCurrentUser_1.isCurrentUser], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriptionId } = req.body;
    if (!req.currentUser)
        return res.status(status_codes_1.STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
    //Find a user from the header token here
    let user = yield User_1.User.findOne({ email: req.currentUser.email });
    if (!user)
        return res
            .status(status_codes_1.STATUS_CODE.NOT_ALLOWED)
            .send("That's an illegal action.");
    const currentSub = yield Subscription_1.Subscription.findOne({
        userId: user.id,
        id: subscriptionId,
    });
    if (!currentSub)
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("This subscription doesn't exist or is expired!");
    const paymentSubscriptionJoinTable = yield SubscriptionPayment_1.SubscriptionPayment.findOne({
        where: { userId: user.id, subscriptionId: currentSub.id },
    });
    if (!paymentSubscriptionJoinTable)
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("This subscription doesn't exist or is expired!");
    const currentPayment = yield Payment_1.Payment.findOne({
        userId: user.id,
        id: paymentSubscriptionJoinTable.paymentId,
    });
    if (!currentPayment)
        return res
            .status(status_codes_1.STATUS_CODE.INTERNAL_ERROR)
            .send("This payment doesn't exist or is expired!");
    try {
        currentSub.isExpired = true;
        currentPayment.isActive = false;
        yield currentSub.save();
        yield currentPayment.save();
    }
    catch (error) {
        console.error(error);
    }
    return res.status(status_codes_1.STATUS_CODE.OK).send(currentSub);
}));
