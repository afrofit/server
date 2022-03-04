import express, { Request, Response } from "express";

import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import { User } from "../../entity/User";
import { validateUserPerformanceData } from "../../util/validate-responses";

import performanceControllers from "./controllers";

const router = express.Router();

router.post(
	"/api/performance/save-user-performance-data",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { performanceData } = req.body;

		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateUserPerformanceData(performanceData);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		const user = await User.findOne({ email: req.currentUser.email });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("Sorry! Something went wrong.");
		try {
			const userActiveDays = await performanceControllers.getActiveDays(user);

			const userPerformanceData =
				await performanceControllers.getUserPerformanceData(user);

			if (!userPerformanceData) {
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Cannot save your performance data!");
			} else {
				userPerformanceData.totalBodyMoves += performanceData.bodyMoves;
				userPerformanceData.totalCaloriesBurned +=
					performanceData.caloriesBurned;
				userPerformanceData.totalTimeDancedInMilliseconds +=
					performanceData.totalTimeDancedInMilliseconds;
				userPerformanceData.totalDaysActive = userActiveDays;

				await userPerformanceData.save();
			}

			return res.status(STATUS_CODE.OK).send({
				performance: userPerformanceData,
			});
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("There was an internal error.");
		}
	}
);

export { router as saveUserPerformanceDataRouter };
