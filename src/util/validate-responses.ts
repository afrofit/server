import Joi from "joi";
import { VerifySubscriptionType } from "./subscription-types";
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

export const validateSubscriptionType = (
	subscriptionType: VerifySubscriptionType
) => {
	const schema = Joi.object({
		subscriptionType: Joi.string().required(),
	});

	return schema.validate(subscriptionType);
};
