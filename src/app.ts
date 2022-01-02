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

app.get("/", (req: Request, res: Response) => {
	return res.send("Welcome to the Afrofit API.");
});

app.all("*", async (req, res) => {
	return res.send("Nothing here!").redirect("/");
});

export { app };
