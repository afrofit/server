import argon2 from "argon2";
import express, { Request, Response } from "express";
import _ from "lodash";
import { User } from "../../entity/User";
import { generateCode } from "../../util/generate-code";
import { validateCreateAccount } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/users/create-account",
	async (req: Request, res: Response) => {
		const { error } = validateCreateAccount(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await User.findOne({ email: req.body.email });
		if (user) return res.status(400).send("Sorry! Email Already Registered.");

		let userWithUsername = await User.findOne({ username: req.body.username });
		if (userWithUsername)
			return res.status(400).send("Sorry! Username Already Taken.");

		//Generate Verification Code
		const verificationCode = generateCode();

		try {
			user = await User.create({
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
				isPremium: false,
				isRegistered: true,
				code: verificationCode,
			}).save();

			console.log("Create Account Code: ", user.code);

			//Send verification email at this point

			const token = user.generateToken();

			return res.header(process.env.CUSTOM_TOKEN_HEADER!, token).send(token);
		} catch (error) {
			console.error(error);
		}

		return res.send({});
	}
);

export { router as createAccountRouter };
