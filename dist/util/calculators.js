"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrices = exports.calculateSubscriptionDuration = void 0;
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
    return 0;
};
exports.calculatePrices = calculatePrices;
