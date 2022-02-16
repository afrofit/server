import express, { Request, Response } from "express";
import _ from "lodash";

import { User } from "../../entity/User";
import { UserActivityToday } from "../../entity/UserActivityToday";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { validateActivityData } from "../../util/validate-responses";
import { UserPerformance } from "../../entity/UserPerformance";
import { STATUS_CODE } from "../../util/status-codes";
import performanceControllers from "./controllers";
import { IActivityType } from "./types";

const router = express.Router();

router.post(
	"/api/performance/save-user-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const { activityData } = req.body;
		console.log("ActivityData", activityData);
		console.log("ActivityData ReqBody", req.body);

		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateActivityData(req.body.activityData);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		let user = await User.findOne({ email: req.currentUser.email });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("Sorry! Something went wrong.");

		console.log("We got here!");

		try {
			let userDailyActivity, userPerformanceData, playedStory, playedChapter;
			userDailyActivity = await performanceControllers.getUserDailyActivity(
				user
			);

			if (!userDailyActivity) {
				userDailyActivity = await UserActivityToday.create({
					userId: user.id,
				}).save();
			} else {
				userDailyActivity.bodyMoves += activityData.bodyMoves;
				userDailyActivity.caloriesBurned += activityData.caloriesBurned;
				await userDailyActivity.save();
			}

			const userActiveDays = await performanceControllers.getActiveDays(user);

			userPerformanceData = await performanceControllers.getUserPerformanceData(
				user
			);

			if (!userPerformanceData) {
				userPerformanceData = await UserPerformance.create({
					userId: user.id,
				}).save();
			} else {
				userPerformanceData.totalBodyMoves += activityData.bodyMoves;
				userPerformanceData.totalCaloriesBurned += activityData.caloriesBurned;
				userPerformanceData.totalTimeDancedInMilliseconds +=
					activityData.totalTimeDancedInMilliseconds;
				userPerformanceData.totalDaysActive = userActiveDays;

				await userPerformanceData.save();
			}

			playedStory = await performanceControllers.getPlayedStory(
				user,
				activityData.contentStoryId
			);

			if (!playedStory)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Sorry. Could not save your story activity.");

			playedStory.totalBodyMoves += activityData.bodyMoves;
			playedStory.totalUserTimeSpentInMillis +=
				activityData.totalTimeDancedInMilliseconds;

			await playedStory.save();

			playedChapter = await performanceControllers.getPlayedChapter(
				user,
				activityData.contentStoryId,
				activityData.contentChapterId,
				playedStory.id
			);

			if (!playedChapter)
				return res
					.status(STATUS_CODE.INTERNAL_ERROR)
					.send("Sorry. Could not save your chapter activity.");

			playedChapter.bodyMoves += activityData.bodyMoves;
			playedChapter.timeSpentInMillis +=
				activityData.totalTimeDancedInMilliseconds;
			playedChapter.completed = activityData.chapterCompleted;
			playedChapter.started = activityData.chapterStarted;

			await playedStory.save();

			console.log(
				"Played",
				playedChapter,
				playedStory,
				userPerformanceData,
				userDailyActivity
			);

			/**
			 * Look a Played_Story for this user and contentStoryId
			 * Look for a Played_Chapter for this user and contentChapterId
			 * Update them accordingly
			 * They would have been created when user fetches stories/chapters in the first place
			 */

			return res.status(STATUS_CODE.OK).send({
				perfomance: userPerformanceData,
				daily: userDailyActivity,
				chapter: playedChapter,
				story: playedStory,
			});
		} catch (error) {
			console.error(error);
			return res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as saveUserActivityRouter };
