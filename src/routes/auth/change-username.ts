import argon2 from "argon2";
import express, { Request, Response } from "express";
import _ from "lodash";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { validateUsername } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/users/change-username",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser) return res.status(403).send("Access Forbidden.");

		const { error } = validateUsername(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const { username } = req.body;

		let user = await User.findOne(req.currentUser.id);
		if (!user) return res.status(400).send("No such user.");

		try {
			user.username = username;
			await user.save();

			const token = user.generateToken();
			return res.header(process.env.CUSTOM_TOKEN_HEADER!, token).send(token);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as changePasswordRouter };
