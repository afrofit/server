import express, { Request, Response } from "express";
import { Payment } from "../../entity/Payment";
import { Subscription } from "../../entity/Subscription";
import { SubscriptionPayment } from "../../entity/SubscriptionPayment";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";

const router = express.Router();

router.post(
	"/api/subscription/expire-subscription/",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { subscriptionId } = req.body;
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		//Find a user from the header token here
		let user = await User.findOne({ email: req.currentUser.email });

		if (!user)
			return res
				.status(STATUS_CODE.NOT_ALLOWED)
				.send("That's an illegal action.");

		const currentSub = await Subscription.findOne({
			userId: user.id,
			id: subscriptionId,
		});

		if (!currentSub)
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("This subscription doesn't exist or is expired!");

		const paymentSubscriptionJoinTable = await SubscriptionPayment.findOne({
			where: { userId: user.id, subscriptionId: currentSub.id },
		});

		if (!paymentSubscriptionJoinTable)
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("This subscription doesn't exist or is expired!");

		const currentPayment = await Payment.findOne({
			userId: user.id,
			id: paymentSubscriptionJoinTable.paymentId,
		});

		if (!currentPayment)
			return res
				.status(STATUS_CODE.INTERNAL_ERROR)
				.send("This payment doesn't exist or is expired!");

		try {
			currentSub.isExpired = true;
			currentPayment.isActive = false;
			await currentSub.save();
			await currentPayment.save();
		} catch (error) {
			console.error(error);
		}

		return res.status(STATUS_CODE.OK).send(currentSub);
	}
);

export { router as expireSubscriptionRouter };
