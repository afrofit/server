import { Request } from "express";

import { User } from "../entity/User";

export const checkUserAuth = async (req: Request) => {
	if (!req.currentUser) return null;

	const user = await User.findOne({ id: req.currentUser.id });
	if (!user) return null;

	return user;
};

// return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");
// return res
// 			.status(STATUS_CODE.UNAUTHORIZED)
// 			.send("Sorry. Something went wrong with this request.");
