import express, { Request, Response, Router } from "express";
import { PlayedStory } from "../../entity/Played_Story";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import client from "../../util/sanity-client";
import { STATUS_CODE } from "../../util/status-codes";
import { mapStoryResponse } from "./mappers";
import queries from "./queries";
import { StoryType } from "./types";

const router = express.Router();

router.get(
	"/api/content/get-stories",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		try {
			let user = await User.findOne({ id: req.currentUser.id });
			if (!user) {
				return res
					.status(STATUS_CODE.BAD_REQUEST)
					.send("Sorry! Something went wrong.");
			}

			const fetchedStories = await client.fetch(queries.FETCH_STORIES_QUERY());

			if (!fetchedStories) return res.send([]);

			if (user && fetchedStories && fetchedStories.length) {
				const newArray: any[] = [];

				await Promise.all(
					fetchedStories.map(async (story: any) => {
						const playerData = await PlayedStory.create({
							contentStoryId: story._id,
							userId: user!.id,
						}).save();
						newArray.push(mapStoryResponse(story, playerData));
					})
				);

				// console.log("New Array", newArray);
				return res.status(STATUS_CODE.OK).send(newArray);
			}

			/**
			 * Here we must also fetch array of StoryPlayed
			 * Map an Array that returns objects containing both content and user performance
			 * Then return that array to FE
			 * Since array size is guaranteed to always be < 100,
			 * This shouldn't be too expensive
			 */
		} catch (error) {
			console.error(error);
		}
		return res.send([]);
	}
);

export { router as getStoriesRouter };

//
