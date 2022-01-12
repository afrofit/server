import express, { Request, Response } from "express";
import { getRepository, LessThan } from "typeorm";
import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import {
	calculateDayStart,
	calculateSubscriptionEndDate,
} from "../../util/calculators";

const router = express.Router();

router.get(
	"/api/performance/get-user-daily-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		const TODAY = calculateDayStart();

		// What's today?
		// Set time to 1 AM today -- that's your start time
		// Set time to 11:59 pm today -- that's your end time

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user) return res.status(400).send("Sorry! Something went wrong.");

		try {
			const userActivityRepository = getRepository(UserActivityToday);

			let userActivity = await userActivityRepository.find({
				where: {
					userId: user.id,
					createdAt: LessThan(USER_ACTIVITY_EXPIRY_DATE),
				},
			});

			if (!userActivity) return res.send(null);

			return res.status(200).send(userActivity);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as getUserDailyActivityRouter };
