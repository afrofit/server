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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = void 0;
const Subscription_1 = require("../entity/Subscription");
const date_fns_1 = require("date-fns");
const SubscriptionPayment_1 = require("../entity/SubscriptionPayment");
const Payment_1 = require("../entity/Payment");
const calculators_1 = require("../util/calculators");
const createSubscription = (subscriptionData, durationInDays, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const NOW = new Date();
    const END_DATE = (0, date_fns_1.formatISO)((0, date_fns_1.addDays)(NOW, durationInDays));
    try {
        const newPayment = yield Payment_1.Payment.create({
            userId,
            amountInGBP: (0, calculators_1.calculatePrices)(subscriptionData),
        }).save();
        const newSubscription = yield Subscription_1.Subscription.create({
            userId,
            durationInDays: (0, calculators_1.calculateSubscriptionDuration)(subscriptionData),
            endDate: END_DATE,
            name: subscriptionData,
        }).save();
        yield SubscriptionPayment_1.SubscriptionPayment.create({
            userId,
            paymentId: newPayment.id,
            subscriptionId: newSubscription.id,
        }).save();
        const response = {
            isExpired: newSubscription.isExpired,
            id: newSubscription.id,
            userId,
            amountInGBP: newPayment.amountInGBP,
            name: newSubscription.name,
            durationInDays: newSubscription.durationInDays,
            startDate: newSubscription.createdAt,
            endDate: newSubscription.endDate,
            freshSubscription: true,
        };
        console.log("Payment from Create Sub Controller", newPayment, newSubscription);
        return response;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.createSubscription = createSubscription;
