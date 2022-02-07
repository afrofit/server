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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const create_account_1 = require("./routes/auth/create-account");
const send_reset_code_1 = require("./routes/auth/send-reset-code");
const verify_reset_code_1 = require("./routes/auth/verify-reset-code");
const set_new_password_1 = require("./routes/auth/set-new-password");
const login_1 = require("./routes/auth/login");
const verify_signup_code_1 = require("./routes/auth/verify-signup-code");
const resend_reset_password_verify_code_1 = require("./routes/auth/resend-reset-password-verify-code");
const resend_verify_code_1 = require("./routes/auth/resend-verify-code");
const change_username_1 = require("./routes/auth/change-username");
const create_subscription_1 = require("./routes/payment/create-subscription");
const expire_subscription_1 = require("./routes/payment/expire-subscription");
const get_subscription_1 = require("./routes/payment/get-subscription");
const create_leaderboard_1 = require("./routes/marathon/create-leaderboard");
const get_user_daily_activity_1 = require("./routes/performance/get-user-daily-activity");
const update_user_daily_activity_1 = require("./routes/performance/update-user-daily-activity");
const get_user_performance_data_1 = require("./routes/performance/get-user-performance-data");
const save_user_activity_1 = require("./routes/performance/save-user-activity");
const get_stories_content_1 = require("./routes/content/get-stories-content");
const app = (0, express_1.default)();
exports.app = app;
app.set("trust proxy", true);
app.use(express_1.default.static("uploads"));
app.use((0, body_parser_1.json)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
//Auth Routes
app.use(create_account_1.createAccountRouter);
app.use(send_reset_code_1.sendResetCodeRouter);
app.use(verify_reset_code_1.verifyPasswordResetCodeRouter);
app.use(set_new_password_1.setNewPasswordRouter);
app.use(login_1.loginRouter);
app.use(verify_signup_code_1.verifySignupCodeRouter);
app.use(resend_verify_code_1.resendVerifyCode);
app.use(resend_reset_password_verify_code_1.resendResetPasswordVerifyCode);
app.use(change_username_1.changePasswordRouter);
//Subscription Routes
app.use(create_subscription_1.createSubscriptionRouter);
app.use(expire_subscription_1.expireSubscriptionRouter);
app.use(get_subscription_1.getSubscriptionRouter);
//Marathon Routes
app.use(create_leaderboard_1.createLeaderboardRouter);
//User Activity Routes
app.use(get_user_daily_activity_1.getUserDailyActivityRouter);
app.use(update_user_daily_activity_1.updateUserDailyActivityRouter);
app.use(get_user_performance_data_1.getUserPerformanceDataRouter);
app.use(save_user_activity_1.saveUserActivityRouter);
//Content Routes
app.use(get_stories_content_1.getStoriesContentRouter);
app.get("/", (req, res) => {
    return res.send("Welcome to the Afrofit API.");
});
app.all("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send("Nothing here!").redirect("/");
}));
