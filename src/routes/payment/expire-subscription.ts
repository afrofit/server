import express, { Request, Response } from "express";
import { Subscription } from "../../entity/Subscription";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";

const router = express.Router();

router.delete(
	"/api/subscription/expire-subscription",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { subscriptionId } = req.body;
		// console.log("Sub ID", subscriptionId);
		if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		//Find a user from the header token here
		let user = await User.findOne({ email: req.currentUser.email });
		console.log("Did we find a User?", user!.id);
		if (!user) return res.status(400).send("That's an illegal action.");

		let currentSub = await Subscription.findOne({
			isExpired: false, //change this to true!
			subscriberId: user.id,
			id: subscriptionId,
		});

		console.log("Did we find a Current Subsciption Object?", currentSub);

		if (!currentSub)
			return res.status(400).send("Something wrong with this subscription!");

		// console.log(currentSub);
		try {
			currentSub.isExpired = true;
			await currentSub.save();

			user.isTrial = false;
			user.isPremium = false;
			user.isPremiumUntil = "";
			user.isTrialUntil = "";
			await user.save();
		} catch (error) {
			console.error(error);
		}

		const token = user.generateToken();

		return res
			.header(process.env.CUSTOM_TOKEN_HEADER!, token)
			.send({ token: token, response: currentSub });
	}
);

export { router as expireSubscriptionRouter };
