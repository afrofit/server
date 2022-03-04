import express, { Request, Response } from "express";

import client from "../../util/sanity-client";
import queries from "./queries";

import { ChapterResponse } from "./types";
import { mapChapterResponse, mapStoryResponse } from "./mappers";
import { PlayedChapter } from "../../entity/Played_Chapter";
import { PlayedStory } from "../../entity/Played_Story";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import { User } from "../../entity/User";

const router = express.Router();

router.get(
	"/api/content/get-story-detail/:storyId",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.BAD_REQUEST)
				.send("Sorry! Something went wrong.");

		const { storyId } = req.params;

		try {
			let storyPlayed: PlayedStory | undefined;

			const fetchedStory = await client.fetch(
				queries.FETCH_STORY_QUERY(storyId)
			);

			storyPlayed = await PlayedStory.findOne({
				where: {
					userId: user.id,
					contentStoryId: storyId,
				},
			});

			if (!storyPlayed) {
				storyPlayed = await PlayedStory.create({
					userId: user.id,
					contentStoryId: storyId,
				}).save();
			}

			const storyDetail = mapStoryResponse(fetchedStory[0], storyPlayed);

			const fetchedChapters = await client.fetch(
				queries.FETCH_STORY_CHAPTERS_QUERY(fetchedStory[0].storyOrderNumber)
			);

			if (!fetchedChapters) return res.send([]);

			if (user && storyPlayed && fetchedChapters && fetchedChapters.length) {
				const newArray: ChapterResponse[] = [];

				await Promise.all(
					fetchedChapters.map(async (chapter: any) => {
						let playerData;

						playerData = await PlayedChapter.findOne({
							userId: user!.id,
							contentChapterId: chapter._id,
							contentStoryId: storyDetail.contentStoryId,
						});

						if (!playerData) {
							playerData = await PlayedChapter.create({
								contentStoryId: storyDetail.contentStoryId,
								contentChapterId: chapter._id,
								playedStoryId: storyPlayed!.id,
								userId: user!.id,
							}).save();
						}

						newArray.push(mapChapterResponse(chapter, playerData));
					})
				);

				return res
					.status(STATUS_CODE.OK)
					.send({ story: storyDetail, chapters: newArray });
			}
		} catch (error) {
			console.error(error);
			res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as getStoryDetailsContentRouter };

//
