import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface ReactivatedUserPayload {
	id: string;
	email: string;
	isReactivated: boolean;
	reactivationDate: string;
}

declare global {
	namespace Express {
		interface Request {
			returningUser?: ReactivatedUserPayload;
		}
	}
}

export const isReactivatable = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const resetToken = req.header(process.env.CUSTOM_RESET_TOKEN_HEADER!);
	if (!resetToken) return res.status(401).send("Provide Valid Reset Token.");

	try {
		const decoded = jwt.verify(
			resetToken as string,
			process.env.RESET_TOKEN_SECRET!
		) as ReactivatedUserPayload;
		req.returningUser = decoded;
		next();
	} catch (error) {
		res.status(400).send("Invalid Reset Token provided.");
	}
};
