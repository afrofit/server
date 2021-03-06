import Joi from "joi";
import {
	VerifyActivityData,
	VerifyContentPlayedData,
	VerifyDailyActivityData,
	VerifyMarathonData,
	VerifyPerformanceData,
	VerifyResetContentData,
} from "./performance-types";
import {
	UserDailyActivityType,
	VerifySubscriptionData,
	VerifySubscriptionParams,
} from "./subscription-types";
import {
	CreateAccountType,
	PasswordType,
	VerifyEmailCodeType,
	VerifyEmailResetCodeType,
	VerifyUsernameType,
} from "./user-types";

export const validateCreateAccount = (user: CreateAccountType) => {
	const schema = Joi.object({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6).max(255),
		username: Joi.string().required().min(5).max(25),
	});

	return schema.validate(user);
};

export const validateLogin = (user: CreateAccountType) => {
	const schema = Joi.object({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6).max(255),
	});

	return schema.validate(user);
};

export const validatePassword = (user: PasswordType) => {
	const schema = Joi.object({
		password: Joi.string().required().min(7).max(255),
	});

	return schema.validate(user);
};

export const validateVerifyEmail = (code: VerifyEmailCodeType) => {
	const schema = Joi.object({
		code: Joi.number().required().min(100000).max(999999),
	});
	return schema.validate(code);
};

export const validateEmailResetCode = (email: VerifyEmailResetCodeType) => {
	const schema = Joi.object({
		email: Joi.string().required().email(),
	});

	return schema.validate(email);
};

export const validateUsername = (username: VerifyUsernameType) => {
	const schema = Joi.object({
		username: Joi.string().required().min(5).max(25),
	});

	return schema.validate(username);
};

export const validateSubscriptionData = (
	subscriptionData: VerifySubscriptionData
) => {
	const schema = Joi.object({
		subscriptionData: Joi.string().required(),
	});

	return schema.validate(subscriptionData);
};

export const validateSubscriptionParams = (
	subscriptionId: VerifySubscriptionParams
) => {
	const schema = Joi.object({
		subscriptionId: Joi.string().required(),
	});

	return schema.validate(subscriptionId);
};

export const validateUserActivityToday = (
	userActivityDailyData: UserDailyActivityType
) => {
	const schema = Joi.object({
		bodyMoves: Joi.number().required(),
		caloriesBurned: Joi.number().required(),
		timeDanced: Joi.number().required(),
		totalDaysActive: Joi.number().required(),
	});

	return schema.validate(userActivityDailyData);
};

export const validateActivityData = (activityData: VerifyActivityData) => {
	const schema = Joi.object({
		caloriesBurned: Joi.number().required(),
		bodyMoves: Joi.number().required(),
		totalTimeDancedInMilliseconds: Joi.number().required(),
		chapterStarted: Joi.boolean().required(),
		chapterCompleted: Joi.boolean().required(),
		storyStarted: Joi.boolean().required(),
		storyCompleted: Joi.boolean().required(),
		contentStoryId: Joi.string().required(),
		contentChapterId: Joi.string().required(),
	});

	return schema.validate(activityData);
};

export const validateDailyActivityData = (
	dailyActivityData: VerifyDailyActivityData
) => {
	const schema = Joi.object({
		caloriesBurned: Joi.number().required(),
		bodyMoves: Joi.number().required(),
	});

	return schema.validate(dailyActivityData);
};

export const validateUserPerformanceData = (
	activityData: VerifyPerformanceData
) => {
	const schema = Joi.object({
		caloriesBurned: Joi.number().required(),
		bodyMoves: Joi.number().required(),
		totalTimeDancedInMilliseconds: Joi.number().required(),
	});

	return schema.validate(activityData);
};

export const validateContentPlayedData = (
	cotentPlayedData: VerifyContentPlayedData
) => {
	const schema = Joi.object({
		caloriesBurned: Joi.number().required(),
		bodyMoves: Joi.number().required(),
		totalTimeDancedInMilliseconds: Joi.number().required(),
		chapterStarted: Joi.boolean().required(),
		chapterCompleted: Joi.boolean().required(),
		storyStarted: Joi.boolean().required(),
		storyCompleted: Joi.boolean().required(),
		contentStoryId: Joi.string().required(),
		contentChapterId: Joi.string().required(),
		chapterOrderNumber: Joi.number().required(),
	});

	return schema.validate(cotentPlayedData);
};

export const validateResetContentData = (
	resetContentData: VerifyResetContentData
) => {
	const schema = Joi.object({
		contentStoryId: Joi.string().required(),
	});

	return schema.validate(resetContentData);
};

export const validateMarathonData = (marathonData: VerifyMarathonData) => {
	const schema = Joi.object({
		bodyMoves: Joi.number().required(),
		marathonId: Joi.string(),
		userMarathonScoreId: Joi.string().required(),
	});

	return schema.validate(marathonData);
};
