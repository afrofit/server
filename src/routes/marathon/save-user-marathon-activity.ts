import express, { Request, Response } from "express";
import { getActiveLeaderboard } from "../../controllers/weekly-leaderboard";

import { User } from "../../entity/User";
import { UserMarathonScore } from "../../entity/UserMarathonScore";
import { STATUS_CODE } from "../../util/status-codes";
import { validateMarathonData } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/marathon/save-user-marathon-activity",
	async (req: Request, res: Response) => {
		const { marathonData } = req.body;

		console.log("Content Played Data", req.body);

		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateMarathonData(marathonData);

		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

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

			const currentUserMarathonScore = await UserMarathonScore.findOne({
				userId: user.id,
				marathonId: activeLeaderboard.id,
			});

			if (!currentUserMarathonScore)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Sorry. Cannot find current user's marathon data.");

			currentUserMarathonScore.bodyMoves += marathonData.bodyMoves;
			await currentUserMarathonScore.save();
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("There was an internal error with this request.");
		}
	}
);

export { router as saveUserMarathonActivity };
