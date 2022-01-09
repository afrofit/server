import express, { Request, Response, Router } from "express";
import { Subscription } from "../../entity/Subscription";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { calculateSubscriptionEndDate } from "../../util/calculators";

const router = express.Router();

router.get(
	"/api/subscription/get-subscription",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user) return res.status(400).send("Sorry! Something went wrong.");

		let currentSub = await Subscription.findOne({
			subscriberId: req.currentUser.id,
			isExpired: false,
		});

		if (!currentSub) return res.send(null);

		// Check to see if the endDate is elapsed --
		// if true, set isExpired to true return null.

		try {
			const today = new Date();
			const endDate = calculateSubscriptionEndDate(
				currentSub.createdAt,
				currentSub.durationInDays
			);
			if (today > endDate) {
				currentSub.isExpired = true;
				//You can trigger an email here
				//check logic for three days to expiration and
				//one week to so as to remind client to renew
			}
			return res.status(200).send(currentSub);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as getSubscriptionRouter };
