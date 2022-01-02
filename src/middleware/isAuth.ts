import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UserPayload {
	id: string;
	email: string;
	isPremium: boolean;
	isPremiumUntil: string;
	isVerified: boolean;
	isRegistered: boolean;
	isAdmin: boolean;
	username: string;
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
	if (!token) return res.status(401).send("Provide Valid Token.");

	try {
		const decoded = jwt.verify(
			token as string,
			process.env.TOKEN_SECRET!
		) as UserPayload;
		req.currentUser = decoded;
		next();
	} catch (error) {
		res.status(400).send("Invalid token provided.");
	}
};
