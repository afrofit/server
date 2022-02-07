import { Subscription, SubscriptionName } from "../entity/Subscription";
import { addDays, formatISO } from "date-fns";
import { SubscriptionPayment } from "../entity/SubscriptionPayment";
import { Payment } from "../entity/Payment";
import {
	calculatePrices,
	calculateSubscriptionDuration,
} from "../util/calculators";

export const createSubscription = async (
	subscriptionData: SubscriptionName,
	durationInDays: number,
	userId: string
) => {
	const NOW = new Date();
	const END_DATE = formatISO(addDays(NOW, durationInDays));

	try {
		const newPayment = await Payment.create({
			userId,
			amountInGBP: calculatePrices(subscriptionData),
		}).save();

		const newSubscription = await Subscription.create({
			userId,
			durationInDays: calculateSubscriptionDuration(subscriptionData),
			endDate: END_DATE,
			name: subscriptionData,
		}).save();

		await SubscriptionPayment.create({
			userId,
			paymentId: newPayment.id,
			subscriptionId: newSubscription.id,
		}).save();

		const response = {
			isExpired: newSubscription.isExpired,
			id: newSubscription.id,
			userId,
			amountInGBP: newPayment.amountInGBP,
			name: newSubscription.name,
			durationInDays: newSubscription.durationInDays,
			startDate: newSubscription.createdAt,
			endDate: newSubscription.endDate,
			freshSubscription: true,
		};
		console.log(
			"Payment from Create Sub Controller",
			newPayment,
			newSubscription
		);

		return response;
	} catch (error) {
		console.error(error);
		return null;
	}
};
