import express, { Request, Response } from "express";
import { LessThan, MoreThan } from "typeorm";
import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { UserPerformance } from "../../entity/UserPerformance";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";

const router = express.Router();

router.get(
	"/api/performance/get-user-performance-data",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.BAD_REQUEST)
				.send("Sorry! Something went wrong.");

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
					userId: user.id,
				}).save();
			}

			return res.status(STATUS_CODE.OK).send(userPerformanceData);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as getUserPerformanceDataRouter };
