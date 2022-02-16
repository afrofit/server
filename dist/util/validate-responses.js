"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateActivityData = exports.validateUserActivityToday = exports.validateSubscriptionParams = exports.validateSubscriptionData = exports.validateUsername = exports.validateEmailResetCode = exports.validateVerifyEmail = exports.validatePassword = exports.validateLogin = exports.validateCreateAccount = void 0;
const joi_1 = __importDefault(require("joi"));
const validateCreateAccount = (user) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().min(6).max(255),
        username: joi_1.default.string().required().min(5).max(25),
    });
    return schema.validate(user);
};
exports.validateCreateAccount = validateCreateAccount;
const validateLogin = (user) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required().min(6).max(255),
    });
    return schema.validate(user);
};
exports.validateLogin = validateLogin;
const validatePassword = (user) => {
    const schema = joi_1.default.object({
        password: joi_1.default.string().required().min(7).max(255),
    });
    return schema.validate(user);
};
exports.validatePassword = validatePassword;
const validateVerifyEmail = (code) => {
    const schema = joi_1.default.object({
        code: joi_1.default.number().required().min(100000).max(999999),
    });
    return schema.validate(code);
};
exports.validateVerifyEmail = validateVerifyEmail;
const validateEmailResetCode = (email) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().required().email(),
    });
    return schema.validate(email);
};
exports.validateEmailResetCode = validateEmailResetCode;
const validateUsername = (username) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string().required().min(5).max(25),
    });
    return schema.validate(username);
};
exports.validateUsername = validateUsername;
const validateSubscriptionData = (subscriptionData) => {
    const schema = joi_1.default.object({
        subscriptionData: joi_1.default.string().required(),
    });
    return schema.validate(subscriptionData);
};
exports.validateSubscriptionData = validateSubscriptionData;
const validateSubscriptionParams = (subscriptionId) => {
    const schema = joi_1.default.object({
        subscriptionId: joi_1.default.string().required(),
    });
    return schema.validate(subscriptionId);
};
exports.validateSubscriptionParams = validateSubscriptionParams;
const validateUserActivityToday = (userActivityDailyData) => {
    const schema = joi_1.default.object({
        bodyMoves: joi_1.default.number().required(),
        caloriesBurned: joi_1.default.number().required(),
        timeDanced: joi_1.default.number().required(),
        totalDaysActive: joi_1.default.number().required(),
    });
    return schema.validate(userActivityDailyData);
};
exports.validateUserActivityToday = validateUserActivityToday;
const validateActivityData = (activityData) => {
    const schema = joi_1.default.object({
        caloriesBurned: joi_1.default.number().required(),
        bodyMoves: joi_1.default.number().required(),
        totalTimeDancedInMilliseconds: joi_1.default.number().required(),
        chapterStarted: joi_1.default.boolean().required(),
        chapterCompleted: joi_1.default.boolean().required(),
        contentStoryId: joi_1.default.string().required(),
        contentChapterId: joi_1.default.string().required(),
    });
    return schema.validate(activityData);
};
exports.validateActivityData = validateActivityData;
