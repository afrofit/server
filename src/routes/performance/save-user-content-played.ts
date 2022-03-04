import express, { Request, Response } from "express";

import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import { User } from "../../entity/User";
import { validateContentPlayedData } from "../../util/validate-responses";

import performanceControllers from "./controllers";

const router = express.Router();

router.post(
	"/api/performance/save-user-content-played",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { contentPlayedData } = req.body;

		console.log("Content Played Data", req.body);

		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateContentPlayedData(contentPlayedData);

		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		const user = await User.findOne({ email: req.currentUser.email });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("Sorry! Something went wrong.");
		try {
			const playedStory = await performanceControllers.getPlayedStory(
				user,
				contentPlayedData.contentStoryId
			);

			if (!playedStory)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Sorry. Could not save your story activity.");

			console.log("Played Story", playedStory);
			if (contentPlayedData.completed) {
				playedStory.lastChapterCompleted = contentPlayedData.chapterOrderNumber;
			}

			playedStory.totalBodyMoves += contentPlayedData.bodyMoves;

			playedStory.totalUserTimeSpentInMillis +=
				contentPlayedData.totalTimeDancedInMilliseconds;
			playedStory.started = contentPlayedData.storyStarted;
			playedStory.completed = contentPlayedData.storyCompleted;

			await playedStory.save();

			const playedChapter = await performanceControllers.getPlayedChapter(
				user,
				contentPlayedData.contentStoryId,
				contentPlayedData.contentChapterId,
				playedStory.id
			);

			if (!playedChapter)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Sorry. Could not save your chapter activity.");

			console.log("Played Chapter", playedChapter);

			playedChapter.bodyMoves += contentPlayedData.bodyMoves;
			playedChapter.timeSpentInMillis +=
				contentPlayedData.totalTimeDancedInMilliseconds;
			playedChapter.completed = contentPlayedData.chapterCompleted;
			playedChapter.started = contentPlayedData.chapterStarted;

			await playedChapter.save();

			console.log("Played Content final", playedChapter, playedStory);

			return res.status(STATUS_CODE.OK).send({
				chapter: playedChapter,
				story: playedStory,
			});
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("There was an internal error.");
		}
	}
);

export { router as saveUserContentPlayedRouter };
