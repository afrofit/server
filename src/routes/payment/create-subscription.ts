import express, { Request, Response } from "express";
import _ from "lodash";
import { Payment } from "../../entity/Payment";
import { Subscription } from "../../entity/Subscription";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import {
	calculatePrices,
	calculateSubscriptionDuration,
	calculateSubscriptionEndDate,
} from "../../util/calculators";
import { validateSubscriptionData } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/subscription/create-subscription",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { subscriptionData } = req.body;

		if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		const { error } = validateSubscriptionData(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await User.findOne({ email: req.currentUser.email });
		if (!user) return res.status(400).send("Sorry! Something went wrong.");

		try {
			let payment = new Payment();
			payment.user = user;
			payment.amountInGBP = calculatePrices(subscriptionData);

			const subscription = await Subscription.create({
				name: subscriptionData,
				durationInDays: calculateSubscriptionDuration(subscriptionData),
				user,
				payment,
				subscriberId: user.id,
			}).save();

			const subscriptionEndDate = subscription.calculateEndDate();
			subscription.endDate = subscriptionEndDate;
			await subscription.save();

			if (subscriptionData !== "trial") {
				user.isPremium = true;
				user.isPremiumUntil = subscriptionEndDate;
				user.isTrial = false;
				user.isTrialUntil = "";
				await user.save();
			} else {
				user.isTrial = true;
				user.isTrialUntil = subscriptionEndDate;
				user.isPremium = false;
				user.isPremiumUntil = "";
				await user.save();
			}

			console.log("Regular Subber", {
				...subscription,
				amountInGBP: subscription.payment.amountInGBP,
				user: subscription.user.id,
			});

			if (!subscription) {
				return res
					.status(503)
					.send("Could not create a subscription. Try again.");
			}

			payment.subscription = subscription;
			await payment.save();
			if (!payment) return res.status(401).send("Payment failed");

			// console.log("Subscription", subscription);
			// console.log("Payment", payment);

			const response = {
				paymentId: payment.id,
				isExpired: subscription.isExpired,
				id: subscription.id,
				userId: subscription.user.id,
				amountInGBP: subscription.payment.amountInGBP,
				name: subscription.name,
				durationInDays: subscription.durationInDays,
				startDate: subscription.createdAt,
				endDate: calculateSubscriptionEndDate(
					subscription.createdAt,
					subscription.durationInDays
				),
			};

			const token = user.generateToken();

			return res
				.header(process.env.CUSTOM_TOKEN_HEADER!, token)
				.send({ token: token, response: response });
		} catch (error) {
			console.error(error);
		}
		return res.send({});
	}
);

export { router as createSubscriptionRouter };
