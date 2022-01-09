"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSubscriptionEndDate = exports.calculatePrices = exports.calculateSubscriptionDuration = void 0;
const calculateSubscriptionDuration = (name) => {
    if (name === "trial")
        return 7;
    else if (name === "monthly")
        return 35;
    else if (name === "half-yearly")
        return 185;
    else if (name === "yearly")
        return 365;
    return 0;
};
exports.calculateSubscriptionDuration = calculateSubscriptionDuration;
const calculatePrices = (name) => {
    if (name === "trial")
        return 90;
    else if (name === "monthly")
        return 180;
    else if (name === "half-yearly")
        return 360;
    else if (name === "yearly")
        return 2000;
    else if (name == "unsubscribed")
        return 0;
    return 0;
};
exports.calculatePrices = calculatePrices;
const calculateSubscriptionEndDate = (startDate, duration) => {
    const date = new Date(startDate);
    const result = date.setDate(date.getDate() + duration);
    return new Date(result);
};
exports.calculateSubscriptionEndDate = calculateSubscriptionEndDate;
