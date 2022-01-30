import { MoreThan, LessThan } from "typeorm";
import { Leaderboard } from "../entity/Leaderboard";

export const createWeeklyLeaderboard = async () => {
	const TODAY = new Date();
	try {
		const existingLeaderboard = await Leaderboard.findOne({
			where: {
				endDate: MoreThan(TODAY),
				startDate: LessThan(TODAY),
			},
		});

		console.log("Existing Leaderboard", existingLeaderboard);
		if (existingLeaderboard) return existingLeaderboard;

		const leaderboard = await Leaderboard.create().save();
		if (!leaderboard) {
			throw new Error("Could not create a leaderboard!");
		}

		console.log("Leaderboard", leaderboard);
		return leaderboard;
	} catch (error) {
		console.error(error);
	}
};
