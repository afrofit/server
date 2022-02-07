import express, { Request, Response, Router } from "express";
import { MoreThan, LessThan } from "typeorm";
import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { UserPerformance } from "../../entity/UserPerformance";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import { validateUserActivityToday } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/performance/update-user-daily-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
		const { error } = validateUserActivityToday(req.body);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		const { bodyMoves, caloriesBurned, totalDaysActive, timeDanced } = req.body;

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("Sorry! Something went wrong.");

		const NOW = new Date();

		let userActivityToday;
		let overallUserPerformance;

		try {
			userActivityToday = await UserActivityToday.findOne({
				where: {
					userId: user.id,
					dayEndTime: MoreThan(NOW),
					dayStartTime: LessThan(NOW),
				},
			});

			if (!userActivityToday) {
				userActivityToday = await UserActivityToday.create({
					userId: user.id,
				}).save();
			}

			userActivityToday.bodyMoves + bodyMoves;
			userActivityToday.caloriesBurned + caloriesBurned;

			await userActivityToday.save();

			// Update UserPerformance
			overallUserPerformance = await UserPerformance.findOne({
				where: {
					userId: user.id,
				},
			});

			// Need logic to calculate total days active

			if (!overallUserPerformance) {
				overallUserPerformance = await UserPerformance.create({
					userId: user.id,
				}).save();
			} else if (overallUserPerformance) {
				overallUserPerformance.totalBodyMoves += bodyMoves;
				overallUserPerformance.totalCaloriesBurned += caloriesBurned;
				overallUserPerformance.totalDaysActive += 1;
				overallUserPerformance.totalTimeDancedInMilliseconds += timeDanced;
			}

			return res.status(201).send(userActivityToday);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as updateUserDailyActivityRouter };
