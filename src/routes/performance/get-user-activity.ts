import express, { Request, Response } from "express";

import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import performanceControllers from "./controllers";

const router = express.Router();

router.get(
	"/api/performance/get-user-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("Sorry! Something went wrong.");

		try {
			const derivedUserActivityToday =
				await performanceControllers.getUserDailyActivity(user);
			const derivedUserPerformanceData =
				await performanceControllers.getUserPerformanceData(user);
			return res.status(STATUS_CODE.OK).send({
				performance: derivedUserPerformanceData,
				daily: derivedUserActivityToday,
			});
		} catch (error) {
			console.error(error);
			return res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as getUserActivityRouter };
