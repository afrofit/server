import express, { Request, Response } from "express";
import _ from "lodash";
import { User } from "../../entity/User";

import { isReactivatable } from "../../middleware/isReactivatable";
import { validatePassword } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/users/set-new-password",
	[isReactivatable],
	async (req: Request, res: Response) => {
		if (!req.returningUser) return res.status(403).send("Access Forbidden.");
		if (!req.returningUser.isReactivated)
			return res.status(403).send("Access Forbidden.");

		const { error } = validatePassword(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		let user = await User.findOne(req.returningUser.id);
		if (!user) return res.status(400).send("No such user.");

		const { password } = req.body;
		const hashedPassword = await user.hashPassword(password);

		try {
			user.isReactivated = false;
			user.password = hashedPassword;
			await user.save();

			const token = user.generateToken();
			return res.header(process.env.CUSTOM_TOKEN_HEADER!, token).send(token);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as setNewPasswordRouter };
