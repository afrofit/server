import express, { Request, Response } from "express";
import { getActiveLeaderboard } from "../../controllers/weekly-leaderboard";

import { User } from "../../entity/User";
import { UserMarathonScore } from "../../entity/UserMarathonScore";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";

const router = express.Router();

router.get(
	"/api/marathon/initialize-user-marathon-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.BAD_REQUEST)
				.send("Sorry! Something went wrong.");

		try {
			const activeLeaderboard = await getActiveLeaderboard();

			if (!activeLeaderboard)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Error fetching leaderboard");

			let currentUserMarathonScore = await UserMarathonScore.findOne({
				userId: user.id,
				marathonId: activeLeaderboard.id,
			});

			if (!currentUserMarathonScore) {
				currentUserMarathonScore = await UserMarathonScore.create({
					userId: user.id,
					marathonId: activeLeaderboard.id,
				}).save();
			}

			return res.status(STATUS_CODE.CREATED).send(currentUserMarathonScore);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("There was an internal error with this request.");
		}
	}
);

export { router as initializeUserMarathonActivity };
