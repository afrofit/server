import express, { Request, Response } from "express";
import { getRepository, LessThan, MoreThan } from "typeorm";
import { Leaderboard } from "../../entity/Leaderboard";
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
	"/api/marathon/create-leaderboard",
	// [isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		// if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		// let user = await User.findOne({ id: req.currentUser.id });
		// if (!user) return res.status(400).send("Sorry! Something went wrong.");
		const TODAY = new Date();
		try {
			const existingLeaderboard = await Leaderboard.findOne({
				where: {
					endDate: MoreThan(TODAY),
					startDate: LessThan(TODAY),
				},
			});

			console.log("Existing Leaderboard", existingLeaderboard);
			if (existingLeaderboard) return res.status(200).send(existingLeaderboard);

			const leaderboard = await Leaderboard.create().save();
			if (!leaderboard) {
				return res.status(400).send("Could not create a leaderboard!");
			}

			console.log("Leaderboard", leaderboard);
			return res.status(200).send(leaderboard);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as createLeaderboardRouter };
