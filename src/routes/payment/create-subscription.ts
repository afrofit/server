import express, { Request, Response } from "express";
import _ from "lodash";
import { Payment } from "../../entity/Payment";
import {
	Subscription,
	SubscriptionDuration,
	SubscriptionName,
} from "../../entity/Subscription";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import {
	calculatePrices,
	calculateSubscriptionDuration,
} from "../../util/calculators";
import { validateSubscriptionType } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/subscription/create-subscription",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { subscriptionData } = req.body;
		if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		const { error } = validateSubscriptionType(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		//Find a user from the header token
		let user = await User.findOne({ email: req.currentUser.email });
		if (!user) return res.status(400).send("Sorry! Something went wrong.");

		try {
			//First we must create a payment and then when that is successful we can create a subscription
			let payment = new Payment();
			payment.user = user;
			payment.amountInGBP = calculatePrices(subscriptionData);

			// First we need to find a current subscription.
			// If there is one, we can advise the user that a current one exists
			// and they should cancel that one instead

			const subscription = await Subscription.create({
				name: subscriptionData,
				durationInDays: calculateSubscriptionDuration(subscriptionData),
				user,
				payment,
			}).save();

			if (!subscription) {
				return res
					.status(503)
					.send("Could not create a subscription. Try again.");
			}

			payment.subscription = subscription;
			await payment.save();
			if (!payment) return res.status(401).send("Payment failed");

			console.log("Subscription", subscription);
			const subscriptionReponse = _.pick(subscription, [
				"name",
				"durationInDays",
				"createdAt",
				"isExpired",
			]);
			const paymentResponse = _.pick(payment, ["amountInGBP"]);
			const cumulativeResponse = { ...subscriptionReponse, ...paymentResponse };
			// console.log("Created Cumulative (Clientxx) Response", cumulativeResponse);
			return res.status(200).send({ ...cumulativeResponse });
		} catch (error) {
			console.error(error);
		}
		return res.send({});
	}
);

export { router as createSubscriptionRouter };

/*
I wanna return

name,
durationInDays,
payment.id,
createdAt as "Subscription StartDate"
subscription.id

*/
