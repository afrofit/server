import express, { Request, Response } from "express";
import _ from "lodash";

import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { validateActivityData } from "../../util/validate-responses";
import { UserPerformance } from "../../entity/UserPerformance";
import { STATUS_CODE } from "../../util/status-codes";
import performanceControllers from "./controllers";

const router = express.Router();

router.post(
	"/api/performance/save-user-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { activityData } = req.body;

		/**
		 * Activity Data needs to have
		 * contentStoryId
		 * contentChapterId
		 */

		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateActivityData(req.body);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		let user = await User.findOne({ email: req.currentUser.email });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("Sorry! Something went wrong.");

		try {
			let userDailyActivity, userPerformanceData;
			userDailyActivity = await performanceControllers.getUserDailyActivity(
				user
			);

			if (!userDailyActivity) {
				userDailyActivity = await UserActivityToday.create({
					userId: user.id,
				}).save();
			} else {
				userDailyActivity.bodyMoves += activityData.bodyMoves;
				userDailyActivity.caloriesBurned += activityData.caloriesBurned;
				await userDailyActivity.save();
			}

			const userActiveDays = await performanceControllers.getActiveDays(user);

			userPerformanceData = await performanceControllers.getUserPerformanceData(
				user
			);

			if (!userPerformanceData) {
				userPerformanceData = await UserPerformance.create({
					userId: user.id,
				}).save();
			} else {
				userPerformanceData.totalBodyMoves += activityData.bodyMoves;
				userPerformanceData.totalCaloriesBurned += activityData.caloriesBurned;
				userPerformanceData.totalTimeDancedInMilliseconds +=
					activityData.totalTimeDancedInMilliseconds;
				userPerformanceData.totalDaysActive = userActiveDays;

				await userPerformanceData.save();
			}

			return res
				.status(STATUS_CODE.OK)
				.send({ perfomance: userPerformanceData, daily: userDailyActivity });
		} catch (error) {
			console.error(error);
			return res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as saveUserActivityRouter };
