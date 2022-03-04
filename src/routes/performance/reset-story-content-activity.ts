import express, { Request, Response } from "express";

import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import { User } from "../../entity/User";
import { validateResetContentData } from "../../util/validate-responses";

import performanceControllers from "./controllers";
import { PlayedChapter } from "../../entity/Played_Chapter";

const router = express.Router();

router.post(
	"/api/performance/reset-story-content-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { resetContentData } = req.body;

		console.log("Content Played Data", req.body);

		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateResetContentData(resetContentData);

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
				resetContentData.contentStoryId
			);

			if (!playedStory)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Sorry. Could not save your story activity.");

			playedStory.totalBodyMoves = 0;
			playedStory.totalUserTimeSpentInMillis = 0;
			playedStory.started = false;
			playedStory.completed = false;

			await playedStory.save();

			const storyChapters = await PlayedChapter.find({
				userId: user.id,
				contentStoryId: resetContentData.contentStoryId,
			});

			if (!storyChapters || !storyChapters.length)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Sorry could not retrieve chapters.");

			if (user && storyChapters && storyChapters.length) {
				const resetChapters: PlayedChapter[] = [];

				await Promise.all(
					storyChapters.map(async (chapter: any) => {
						chapter.bodyMoves = 0;
						chapter.caloriesBurned = 0;
						chapter.timeSpentInMillis = 0;
						chapter.completed = false;
						chapter.started = false;
						await chapter.save();

						resetChapters.push(chapter);
					})
				);

				console.log({
					chapters: resetChapters,
					story: playedStory,
				});

				return res.status(STATUS_CODE.OK).send({
					chapters: resetChapters,
					story: playedStory,
				});
			}
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("There was an internal error.");
		}
	}
);

export { router as resetStoryContentActivityRouter };
