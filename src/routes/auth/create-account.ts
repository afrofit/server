import express, { Request, Response } from "express";
import _ from "lodash";
import {
	Subscription,
	SubscriptionDuration,
	SubscriptionName,
} from "../../entity/Subscription";
import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { UserPerformance } from "../../entity/UserPerformance";
import { generateCode } from "../../util/generate-code";
import { validateCreateAccount } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/users/create-account",
	async (req: Request, res: Response) => {
		const { error } = validateCreateAccount(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await User.findOne({ email: req.body.email });
		if (user) return res.status(400).send("Sorry! Email Already Registered.");

		let userWithUsername = await User.findOne({ username: req.body.username });
		if (userWithUsername)
			return res.status(400).send("Sorry! Username Already Taken.");

		//Generate Verification Code
		const verificationCode = generateCode();

		try {
			user = await User.create({
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
				isPremium: false,
				isRegistered: true,
				code: verificationCode,
				rankId: 1,
			}).save();

			const performance = await UserPerformance.create({
				totalBodyMoves: 0,
				totalDaysActive: 0,
				totalHoursDanced: 0,
				totalCaloriesBurned: 0,
				user,
			}).save();

			const activity = await UserActivityToday.create({
				caloriesBurned: 0,
				bodyMoves: 0,
				user,
			}).save();

			if (!performance || !activity)
				console.error("Could not create a subscription!");

			console.log("Create Account Code: ", user.code);

			//Send verification email at this point

			const token = user.generateToken();

			return res.header(process.env.CUSTOM_TOKEN_HEADER!, token).send(token);
		} catch (error) {
			console.error(error);
		}

		return res.send({});
	}
);

export { router as createAccountRouter };
