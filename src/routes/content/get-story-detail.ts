import express, { Request, Response, Router } from "express";
import { PlayedChapter } from "../../entity/Played_Chapter";
import { PlayedStory } from "../../entity/Played_Story";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import client from "../../util/sanity-client";
import { STATUS_CODE } from "../../util/status-codes";
import { mapChapterResponse, mapStoryResponse } from "./mappers";
import queries from "./queries";

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
			let storyPlayed;

			const fetchedStory = await client.fetch(
				queries.FETCH_STORY_QUERY(storyId)
			);
			console.log("Fetched Story", fetchedStory[0]);
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
			console.log("Fetched StoryDetail", storyDetail);

			return res.status(STATUS_CODE.OK).send(storyDetail);
		} catch (error) {
			console.error(error);
			res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as getStoryDetailsContentRouter };

//