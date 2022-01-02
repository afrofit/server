import express, { Request, Response } from "express";
import _ from "lodash";

import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { User } from "../../entity/User";
import { validateVerifyEmail } from "../../util/validate-responses";

const router = express.Router();

router.put(
	"/api/users/verify-signup-code",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		const { error } = validateVerifyEmail(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await User.findOne(req.currentUser.id);
		if (!user) return res.status(400).send("No such user.");
		if (user.isVerified) return res.status(400).send("User already verified.");

		if (req.body.code !== user.code)
			return res.status(400).send("Invalid Code.");

		try {
			user.isVerified = true;
			user.code = 0;
			await user.save();

			const token = user.generateToken();
			return res.header(process.env.CUSTOM_TOKEN_HEADER!, token).send(token);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as verifySignupCodeRouter };
