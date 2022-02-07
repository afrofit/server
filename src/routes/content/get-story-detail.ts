import express, { Request, Response, Router } from "express";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import client from "../../util/sanity-client";
import { STATUS_CODE } from "../../util/status-codes";

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

		let fetchedStory;
		try {
			fetchedStory = await client.fetch(
				`*[_type=="story" && _id==${storyId}]{...}`
			);

			return res.status(STATUS_CODE.OK).send(fetchedStory || null);
		} catch (error) {
			console.error(error);
		}
		return res.send([]);
	}
);

export { router as getStoriesContentRouter };

//
