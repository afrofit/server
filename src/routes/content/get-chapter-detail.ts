import express, { Request, Response, Router } from "express";
import { PlayedChapter } from "../../entity/Played_Chapter";
import { PlayedStory } from "../../entity/Played_Story";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import client from "../../util/sanity-client";
import { STATUS_CODE } from "../../util/status-codes";
import { mapChapterResponse } from "./mappers";
import queries from "./queries";

const router = express.Router();

router.get(
	"/api/content/get-chapter-detail/:storyId/:chapterId",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.BAD_REQUEST)
				.send("Sorry! Something went wrong.");

		const { chapterId, storyId } = req.params;

		try {
			let chapterPlayed;

			const fetchedChapter = await client.fetch(
				queries.FETCH_CHAPTER_QUERY(chapterId)
			);
			// console.log("Fetched Story", fetchedChapter);
			chapterPlayed = await PlayedChapter.findOne({
				where: {
					userId: user.id,
				},
			});

			// Look for playedStory
			const playedStory = await PlayedStory.findOne({
				userId: user.id,
				contentStoryId: storyId,
			});

			if (!playedStory)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("There was an internal error");

			if (!chapterPlayed) {
				chapterPlayed = await PlayedChapter.create({
					userId: user.id,
					contentStoryId: storyId,
					contentChapterId: fetchedChapter[0]._id,
					playedStoryId: playedStory.id,
				}).save();
			}

			const storyDetail = mapChapterResponse(fetchedChapter[0], chapterPlayed);
			/**
			 * Here we must also fetch array of StoryPlayed
			 * Map an Array that returns objects containing both content and user performance
			 * Then return that array to FE
			 * Since array size is guaranteed to always be < 100,
			 * This shouldn't be too expensive
			 */

			return res.status(STATUS_CODE.OK).send(storyDetail);
		} catch (error) {
			console.error(error);
			res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as getChapterDetailsContentRouter };

//
