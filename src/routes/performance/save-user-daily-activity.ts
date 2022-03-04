import express, { Request, Response } from "express";

import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import { User } from "../../entity/User";
import { validateDailyActivityData } from "../../util/validate-responses";

import performanceControllers from "./controllers";

const router = express.Router();

router.post(
	"/api/performance/save-user-daily-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { dailyActivityData } = req.body;

		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateDailyActivityData(dailyActivityData);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		const user = await User.findOne({ email: req.currentUser.email });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("Sorry! Something went wrong.");
		try {
			const userDailyActivity =
				await performanceControllers.getUserDailyActivity(user);

			if (!userDailyActivity) {
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Cannot save your daily activity!");
			} else {
				userDailyActivity.bodyMoves += dailyActivityData.bodyMoves;
				userDailyActivity.caloriesBurned += dailyActivityData.caloriesBurned;
				await userDailyActivity.save();
			}

			return res.status(STATUS_CODE.OK).send({
				daily: userDailyActivity,
			});
		} catch (error) {
			console.error(error);
			return res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as saveUserDailyActivityRouter };
