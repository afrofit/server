import { MoreThan, LessThan } from "typeorm";
import { Leaderboard } from "../entity/Leaderboard";

const TODAY = new Date();

export const createWeeklyLeaderboard = async () => {
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

export const getActiveLeaderboard = async (): Promise<Leaderboard | null> => {
	try {
		const weeklyLeaderboard = await Leaderboard.findOne({
			where: {
				endDate: MoreThan(TODAY),
				startDate: LessThan(TODAY),
			},
		});

		if (!weeklyLeaderboard) {
			throw new Error("Could not get this week's leaderboard!");
		}

		return weeklyLeaderboard;
	} catch (error) {
		console.error(error);
		return null;
	}
};
