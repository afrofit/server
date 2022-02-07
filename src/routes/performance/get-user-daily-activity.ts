import express, { Request, Response } from "express";
import { LessThan, MoreThan } from "typeorm";
import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";

const router = express.Router();

router.get(
	"/api/performance/get-user-daily-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("Sorry! Something went wrong.");

		const NOW = new Date();

		let userActivityToday;

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

			return res.status(STATUS_CODE.OK).send(userActivityToday);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as getUserDailyActivityRouter };
