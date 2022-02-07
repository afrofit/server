import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import helmet from "helmet";
import logger from "morgan";
import compression from "compression";
import { createAccountRouter } from "./routes/auth/create-account";
import { sendResetCodeRouter } from "./routes/auth/send-reset-code";
import { verifyPasswordResetCodeRouter } from "./routes/auth/verify-reset-code";
import { setNewPasswordRouter } from "./routes/auth/set-new-password";
import { loginRouter } from "./routes/auth/login";
import { verifySignupCodeRouter } from "./routes/auth/verify-signup-code";
import { resendResetPasswordVerifyCode } from "./routes/auth/resend-reset-password-verify-code";
import { resendVerifyCode } from "./routes/auth/resend-verify-code";
import { changePasswordRouter } from "./routes/auth/change-username";
import { createSubscriptionRouter } from "./routes/payment/create-subscription";
import { expireSubscriptionRouter } from "./routes/payment/expire-subscription";
import { getSubscriptionRouter } from "./routes/payment/get-subscription";
import { createLeaderboardRouter } from "./routes/marathon/create-leaderboard";
import { getUserDailyActivityRouter } from "./routes/performance/get-user-daily-activity";
import { updateUserDailyActivityRouter } from "./routes/performance/update-user-daily-activity";
import { getUserPerformanceDataRouter } from "./routes/performance/get-user-performance-data";
import { saveUserActivityRouter } from "./routes/performance/save-user-activity";
import { getStoriesContentRouter } from "./routes/content/get-stories-content";

const app = express();
app.set("trust proxy", true);
app.use(express.static("uploads"));
app.use(json());
app.use(compression());
app.use(logger("dev"));
app.use(helmet());

//Auth Routes
app.use(createAccountRouter);
app.use(sendResetCodeRouter);
app.use(verifyPasswordResetCodeRouter);
app.use(setNewPasswordRouter);
app.use(loginRouter);
app.use(verifySignupCodeRouter);
app.use(resendVerifyCode);
app.use(resendResetPasswordVerifyCode);
app.use(changePasswordRouter);

//Subscription Routes
app.use(createSubscriptionRouter);
app.use(expireSubscriptionRouter);
app.use(getSubscriptionRouter);

//Marathon Routes
app.use(createLeaderboardRouter);

//User Activity Routes
app.use(getUserDailyActivityRouter);
app.use(updateUserDailyActivityRouter);
app.use(getUserPerformanceDataRouter);
app.use(saveUserActivityRouter);

//Content Routes
app.use(getStoriesContentRouter);

app.get("/", (req: Request, res: Response) => {
	return res.send("Welcome to the Afrofit API.");
});

app.all("*", async (req, res) => {
	return res.send("Nothing here!").redirect("/");
});

export { app };
