import express, { Request, Response } from "express";
import { LessThan, MoreThan } from "typeorm";
import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { UserPerformance } from "../../entity/UserPerformance";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";

const router = express.Router();

router.get(
	"/api/performance/get-user-performance-data",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user) return res.status(400).send("Sorry! Something went wrong.");

		const NOW = new Date();

		let userPerformanceData;

		try {
			userPerformanceData = await UserPerformance.findOne({
				where: {
					userId: user.id,
				},
			});

			if (!userPerformanceData) {
				userPerformanceData = await UserPerformance.create({
					user,
					// userId: user.id,
				}).save();
			}

			return res.status(200).send(userPerformanceData);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as getUserPerformanceDataRouter };
