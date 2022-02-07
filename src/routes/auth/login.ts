import argon2 from "argon2";
import express, { Request, Response } from "express";
import _ from "lodash";

import { User } from "../../entity/User";
import { STATUS_CODE } from "../../util/status-codes";
import { validateLogin } from "../../util/validate-responses";

const router = express.Router();

router.post("/api/users/login", async (req: Request, res: Response) => {
	const { error } = validateLogin(req.body);
	if (error)
		return res.status(STATUS_CODE.BAD_REQUEST).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (!user)
		return res.status(STATUS_CODE.BAD_REQUEST).send("Wrong Email/Password");

	const validPassword = await argon2.verify(user.password, req.body.password);
	if (!validPassword)
		return res.status(STATUS_CODE.BAD_REQUEST).send("Wrong Email/Password");

	const token = user.generateToken();

	return res.status(STATUS_CODE.OK).send(token);
});

export { router as loginRouter };
