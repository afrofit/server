import { formatISO, addDays } from "date-fns";
import express, { Request, response, Response } from "express";
import _ from "lodash";
import { createSubscription } from "../../controllers/create-subscription";
import { Payment } from "../../entity/Payment";
import { Subscription } from "../../entity/Subscription";
import { SubscriptionPayment } from "../../entity/SubscriptionPayment";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { calculateSubscriptionDuration } from "../../util/calculators";
import { STATUS_CODE } from "../../util/status-codes";
import { validateSubscriptionData } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/subscription/create-subscription",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { subscriptionData } = req.body;

		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateSubscriptionData(req.body);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		let user = await User.findOne({ email: req.currentUser.email });
		if (!user)
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("Sorry! Something went wrong.");

		const TODAY = new Date();
		const durationInDays = calculateSubscriptionDuration(subscriptionData);

		try {
			// 1. Is there an existing subscription?
			let existingSubscription;

			const existingSubscriptionList = await Subscription.find({
				where: { userId: user.id },
				order: { createdAt: "DESC" },
			});

			existingSubscription = existingSubscriptionList[0];

			if (
				existingSubscription &&
				!existingSubscription.isExpired &&
				new Date(existingSubscription.endDate) < TODAY
			) {
				// 2. If YES, is it PAST due? THEN set it as expired and GO TO STEP 4
				existingSubscription.isExpired = true;
				await existingSubscription.save();

				if (existingSubscription.name === "trial") {
					user.hasTrial = false;
					await user.save();
				}

				const existingSubPayJoinTable = await SubscriptionPayment.findOne({
					where: { userId: user.id, subscriptionId: existingSubscription.id },
				});

				if (existingSubPayJoinTable) {
					const existingPayment = await Payment.findOne({
						where: { userId: user.id, id: existingSubPayJoinTable.paymentId },
					});

					if (existingPayment) {
						existingPayment.isActive = false;
						await existingPayment.save();
					}
				}

				let newSubscription;

				if (subscriptionData !== "trial") {
					newSubscription = await createSubscription(
						subscriptionData,
						durationInDays,
						user.id
					);
				}

				console.log("One", newSubscription);

				return res.status(STATUS_CODE.CREATED).send(newSubscription);
			} else if (
				existingSubscription &&
				!existingSubscription.isExpired &&
				new Date(existingSubscription.endDate) > TODAY
			) {
				// 3. If NO, meaning its still valid, return it with extra freshSubscription field
				const response = {
					isExpired: existingSubscription.isExpired,
					id: existingSubscription.id,
					userId: user.id,
					name: existingSubscription.name,
					durationInDays: existingSubscription.durationInDays,
					startDate: existingSubscription.createdAt,
					endDate: existingSubscription.endDate,
					freshSubscription: false,
				};
				return res.status(STATUS_CODE.OK).send(response);
			} else if (
				(existingSubscription && existingSubscription.isExpired) ||
				!existingSubscription
			) {
				// 4. If there's no existing subscription, then create a new one and send it

				let newSubscription;

				if (!user.hasTrial && subscriptionData === "trial") {
					return res
						.status(STATUS_CODE.BAD_REQUEST)
						.send("You finished your trial already.");
				} else if (user.hasTrial) {
					newSubscription = await createSubscription(
						subscriptionData,
						durationInDays,
						user.id
					);
				}
				console.log("Two", newSubscription, "User", user);

				return res.status(STATUS_CODE.CREATED).send(newSubscription);
			}
		} catch (error) {
			console.error(error);
			return res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as createSubscriptionRouter };
