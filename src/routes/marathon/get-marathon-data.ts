import express, { Request, Response } from "express";
import { getActiveLeaderboard } from "../../controllers/weekly-leaderboard";

import { User } from "../../entity/User";
import { UserMarathonScore } from "../../entity/UserMarathonScore";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";

const router = express.Router();

router.get(
	"/api/marathon/get-current-marathon-data",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.BAD_REQUEST)
				.send("Sorry! Something went wrong.");

		let currentUserMarathonScoreIndex;

		const LOWER_LIMIT = 88;

		try {
			const activeLeaderboard = await getActiveLeaderboard();

			if (!activeLeaderboard)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Error fetching leaderboard");

			const userMarathonScoresArray = await UserMarathonScore.find({
				where: { marathonId: activeLeaderboard.id },
				order: { bodyMoves: "DESC" },
				skip: 0,
				take: LOWER_LIMIT,
			});

			if (!userMarathonScoresArray || !userMarathonScoresArray.length)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Sorry. Cannot find marathon data.");

			let currentUserMarathonScore = await UserMarathonScore.findOne({
				userId: user.id,
				marathonId: activeLeaderboard.id,
			});

			if (!currentUserMarathonScore) {
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("There was an error getting marathon data for user.");
			}

			for (const [index, score] of userMarathonScoresArray.entries()) {
				if (score.id === currentUserMarathonScore.id) {
					currentUserMarathonScoreIndex = index;
					break;
				}
			}

			if (!currentUserMarathonScoreIndex)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Could not find user's place on rankings table");

			return res.status(STATUS_CODE.OK).send({
				index: currentUserMarathonScoreIndex,
				listings: userMarathonScoresArray,
			});
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("There was an internal error with this request.");
		}
	}
);

export { router as getCurrentMarathonDataRouter };
