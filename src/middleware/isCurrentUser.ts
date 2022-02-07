import { Response, Request, NextFunction } from "express";
import { STATUS_CODE } from "../util/status-codes";

export const isCurrentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.currentUser!)
		return res.status(STATUS_CODE.FORBIDDEN).send("Access forbidden.");
	next();
};
