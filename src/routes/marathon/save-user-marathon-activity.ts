import express, { Request, Response } from "express";
import { getActiveLeaderboard } from "../../controllers/weekly-leaderboard";

import { User } from "../../entity/User";
import { UserMarathonScore } from "../../entity/UserMarathonScore";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import { validateMarathonData } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/marathon/save-user-marathon-activity",
	[isAuth, isCurrentUser],
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
			const currentUserMarathonScore = await UserMarathonScore.findOne({
				userId: user.id,
				id: marathonData.userMarathonScoreId,
			});

			if (!currentUserMarathonScore) {
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("There was an error retrieving user's marathon data.");
			}

			currentUserMarathonScore.bodyMoves += marathonData.bodyMoves;
			await currentUserMarathonScore.save();

			return res.status(STATUS_CODE.OK).send(currentUserMarathonScore);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("There was an internal error with this request.");
		}
	}
);

export { router as saveUserMarathonActivity };
