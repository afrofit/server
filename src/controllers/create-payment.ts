import { Payment } from "../entity/Payment";

export const createPayment = async (userId: string, amountInGBP: number) => {
	try {
		await Payment.create({
			amountInGBP,
			userId,
		}).save();
	} catch (error) {
		console.error(error);
		return null;
	}
};
