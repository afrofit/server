"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWeekStart = exports.calculateDayStart = exports.calculateSubscriptionEndDate = exports.calculatePrices = exports.calculateSubscriptionDuration = void 0;
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
        return 0;
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
const calculateDayStart = () => {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return {
        month: date.getMonth(),
        day: date.getDay(),
        year: date.getFullYear(),
        fullDate: date.getDate(),
    };
};
exports.calculateDayStart = calculateDayStart;
const calculateWeekStart = (currentDate) => {
    // What's the month, year and day of currentDate?
    // The start of the week is always Sunday = 0;
    // So if today is not 0, then look for the day before that day that is of zero
    // locate that day by getting the real date
};
exports.calculateWeekStart = calculateWeekStart;
