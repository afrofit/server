import express, { Request, Response } from "express";
import _ from "lodash";
import { User } from "../../entity/User";
import { isReactivatable } from "../../middleware/isReactivatable";
import { STATUS_CODE } from "../../util/status-codes";
import { validateVerifyEmail } from "../../util/validate-responses";

const router = express.Router();

router.put(
	"/api/users/verify-password-reset-code",
	[isReactivatable],
	async (req: Request, res: Response) => {
		if (!req.returningUser)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		const { error } = validateVerifyEmail(req.body);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		let user = await User.findOne(req.returningUser.id);
		if (!user) return res.status(STATUS_CODE.BAD_REQUEST).send("No such user.");

		if (req.body.code !== user.code)
			return res.status(STATUS_CODE.BAD_REQUEST).send("Invalid Code.");

		try {
			user.isReactivated = true;
			user.code = 100000;
			await user.save();

			const resetToken = user.generateResetToken();

			return res
				.status(STATUS_CODE.OK)
				.header(process.env.CUSTOM_RESET_TOKEN_HEADER!, resetToken)
				.send(resetToken);
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as verifyPasswordResetCodeRouter };
