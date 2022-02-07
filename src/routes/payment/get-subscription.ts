import express, { Request, Response, Router } from "express";
import { formatISO, compareAsc } from "date-fns";

import { Subscription } from "../../entity/Subscription";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { SubscriptionPayment } from "../../entity/SubscriptionPayment";
import { Payment } from "../../entity/Payment";
import { STATUS_CODE } from "../../util/status-codes";

const router = express.Router();

router.get(
	"/api/subscription/get-subscription",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		let user = await User.findOne({ id: req.currentUser.id });
		if (!user)
			return res
				.status(STATUS_CODE.NOT_ALLOWED)
				.send("Sorry! Something went wrong.");

		const TODAY = new Date();

		try {
			let subscriptionsArray = await Subscription.find({
				where: { userId: req.currentUser.id },
				order: { createdAt: "DESC" },
			});

			if (!subscriptionsArray || !subscriptionsArray.length)
				return res.status(STATUS_CODE.NO_CONTENT).send(null);

			const latestSubscription = subscriptionsArray[0];

			if (new Date(latestSubscription.endDate) < TODAY) {
				latestSubscription.isExpired = true;

				await latestSubscription.save();

				// Find payment and jointable here and mark payment as expired too
				const paymentSubscriptionJoinTable = await SubscriptionPayment.findOne({
					where: { userId: user.id, subscriptionId: latestSubscription.id },
				});

				if (!paymentSubscriptionJoinTable)
					return res
						.status(STATUS_CODE.INTERNAL_ERROR)
						.send("This subscription doesn't exist or is expired!");

				const currentPayment = await Payment.findOne({
					isActive: true,
					userId: user.id,
					id: paymentSubscriptionJoinTable.paymentId,
				});

				if (!currentPayment)
					return res
						.status(STATUS_CODE.INTERNAL_ERROR)
						.send("This payment doesn't exist or is expired!");

				latestSubscription.isExpired = true;
				currentPayment.isActive = false;
				await currentPayment.save();

				return res.status(STATUS_CODE.NO_CONTENT).send(null);
			} else if (new Date(latestSubscription.endDate) > TODAY) {
				return res.status(STATUS_CODE.OK).send(latestSubscription);
			}
			/**
			 * You can constantly check here if subscription is about to end to
			 * Then trigger an email to users alerting them of this
			 */
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as getSubscriptionRouter };
