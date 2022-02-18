import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODE } from "../util/status-codes";

export interface UserPayload {
	id: string;
	email: string;
	isPremium: boolean;
	isVerified: boolean;
	isRegistered: boolean;
	isAdmin: boolean;
	username: string;
	joinDate: string;
	rankId: string;
	hasTrial: boolean;
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header(process.env.CUSTOM_TOKEN_HEADER!);
	if (!token)
		return res.status(STATUS_CODE.UNAUTHORIZED).send("Provide Valid Token.");

	try {
		const decoded = jwt.verify(
			token as string,
			process.env.TOKEN_SECRET!
		) as UserPayload;
		req.currentUser = decoded;
		next();
	} catch (error) {
		res.status(STATUS_CODE.BAD_REQUEST).send("Invalid token provided.");
	}
};
