import argon2 from "argon2";
import express, { Request, Response } from "express";
import _ from "lodash";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import { validateUsername } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/users/change-username",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		if (!req.currentUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateUsername(req.body);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		const { username } = req.body;

		let user = await User.findOne(req.currentUser.id);
		if (!user) return res.status(STATUS_CODE.BAD_REQUEST).send("No such user.");

		try {
			user.username = username;
			await user.save();

			const token = user.generateToken();
			return res
				.status(STATUS_CODE.OK)
				.header(process.env.CUSTOM_TOKEN_HEADER!, token)
				.send(token);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as changePasswordRouter };
