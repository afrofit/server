import express, { Request, Response } from "express";
import _ from "lodash";
import { User } from "../../entity/User";
import { generateCode } from "../../util/generate-code";
import { STATUS_CODE } from "../../util/status-codes";
import { validateEmailResetCode } from "../../util/validate-responses";

const router = express.Router();

router.post(
	"/api/users/send-reset-code/",
	async (req: Request, res: Response) => {
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res
				.status(STATUS_CODE.UNAUTHORIZED)
				.send("There is a problem with the email.");

		const { error } = validateEmailResetCode(req.body);
		if (error)
			return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

		const newCode = generateCode();

		try {
			user.code = newCode;
			await user.save();

			console.log("Email Reset Code: ", user.code);

			//Send Email to User Here, using the code and username

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

export { router as sendResetCodeRouter };
