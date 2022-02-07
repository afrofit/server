import express, { Request, Response } from "express";
import _ from "lodash";
import { LessThan, MoreThan } from "typeorm";
import { endOfToday, startOfToday } from "date-fns";

import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { validateActivityData } from "../../util/validate-responses";
import { UserPerformance } from "../../entity/UserPerformance";
import { ActiveDay } from "../../entity/ActiveDay";
import { STATUS_CODE } from "../../util/status-codes";

const router = express.Router();

router.post(
	"/api/performance/save-user-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { activityData } = req.body;

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
			const userDailyActivity = await UserActivityToday.findOne({
				where: {
					userId: user.id,
					dayEndTime: LessThan(endOfToday),
					dayStartTime: MoreThan(startOfToday),
				},
			});

			if (!userDailyActivity)
				return res
					.status(STATUS_CODE.NO_CONTENT)
					.send("An unexpected error occured");

			userDailyActivity.bodyMoves += activityData.bodyMoves;
			userDailyActivity.caloriesBurned += activityData.caloriesBurned;

			await userDailyActivity.save();

			const userPerformanceData = await UserPerformance.findOne({
				where: {
					userId: user.id,
				},
			});

			if (!userPerformanceData)
				return res
					.status(STATUS_CODE.NO_CONTENT)
					.send("An unexpected error occured");

			userPerformanceData.totalBodyMoves += activityData.bodyMoves;
			userPerformanceData.totalCaloriesBurned += activityData.caloriesBurned;
			userPerformanceData.totalTimeDancedInMilliseconds +=
				activityData.totalTimeDancedInMilliseconds;

			let activeDay = await ActiveDay.findOne({
				where: {
					userId: user.id,
					dayEndTime: LessThan(endOfToday),
					dayStartTime: MoreThan(startOfToday),
				},
			});

			if (!activeDay) {
				const activeDay = await ActiveDay.create({
					userId: user.id,
				});
				userPerformanceData.totalDaysActive += 1;
				await activeDay.save();
			} else if (activeDay) {
				userPerformanceData.totalDaysActive += 0;
			}
			await userPerformanceData.save();

			return res.status(STATUS_CODE.OK).send({ success: true });
		} catch (error) {
			console.error(error);
		}
		return res.send({});
	}
);

export { router as saveUserActivityRouter };
