import { isToday } from "date-fns";
import { ActiveDay } from "../../entity/ActiveDay";
import { PlayedChapter } from "../../entity/Played_Chapter";
import { PlayedStory } from "../../entity/Played_Story";
import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { UserPerformance } from "../../entity/UserPerformance";

const NOW = new Date();

const createUserDailyActivity = async (user: User) => {
	const newDailyUserActivity = await UserActivityToday.create({
		userId: user.id,
	}).save();

	return newDailyUserActivity;
};

const createUserPerformanceData = async (user: User) => {
	const newUserPerformanceData = await UserPerformance.create({
		userId: user.id,
	}).save();

	return newUserPerformanceData;
};

const getUserDailyActivity = async (user: User) => {
	const userActivityList = await UserActivityToday.find({
		userId: user.id,
	});

	if (userActivityList && userActivityList.length) {
		const userActivityToday = userActivityList[0];

		if (
			userActivityToday.dayEndTime > NOW &&
			userActivityToday.dayStartTime < NOW
		) {
			return userActivityToday;
		} else {
			const newUserActivityToday = await createUserDailyActivity(user);
			return newUserActivityToday;
		}
	}
};

const getUserPerformanceData = async (user: User) => {
	const userPerformanceData = await UserPerformance.findOne({
		where: {
			userId: user.id,
		},
	});

	if (!userPerformanceData) {
		const newUserPerformanceData = await createUserPerformanceData(user);
		return newUserPerformanceData;
	}

	return userPerformanceData;
};

const getActiveDays = async (user: User) => {
	const activeDayList = await ActiveDay.find({
		where: { userId: user.id },
		order: { createdAt: "DESC" },
	});

	if (!activeDayList || !activeDayList.length) {
		await ActiveDay.create({ userId: user.id }).save();
		return 1;
	}

	const latestActiveDay = activeDayList[0];

	if (isToday(new Date(latestActiveDay.createdAt))) {
		return activeDayList.length;
	} else {
		await ActiveDay.create({ userId: user.id }).save();
		return activeDayList.length + 1;
	}
};

const getPlayedStory = async (user: User, contentStoryId: string) => {
	const playedStory = await PlayedStory.findOne({
		userId: user.id,
		contentStoryId,
	});

	return playedStory ? playedStory : null;
};
const getPlayedChapter = async (
	user: User,
	contentStoryId: string,
	contentChapterId: string,
	playedStoryId: string
) => {
	const playedChapter = await PlayedChapter.findOne({
		userId: user.id,
		contentChapterId,
		contentStoryId,
		playedStoryId,
	});
	return playedChapter ? playedChapter : null;
};

export default {
	getUserDailyActivity,
	getUserPerformanceData,
	getActiveDays,
	getPlayedStory,
	getPlayedChapter,
};
