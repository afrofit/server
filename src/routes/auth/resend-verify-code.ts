import express, { Request, Response } from "express";
import _ from "lodash";

import { User } from "../../entity/User";
import { generateCode } from "../../util/generate-code";
import { validateEmailResetCode } from "../../util/validate-responses";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";

const router = express.Router();

router.post(
	"/api/users/resend-verify-code",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const user = await User.findOne({ email: req.body.email });
		if (!user) return res.status(400).send("User does not exist.");

		const { error } = validateEmailResetCode(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const newCode = generateCode();

		try {
			user.code = newCode;
			await user.save();

			console.log("Resent Verify Email Code: ", user.code);

			//Send Email to User Here

			return res.json({ success: true });
		} catch (error) {
			console.error(error);
		}
	}
);

export { router as resendVerifyCode };
