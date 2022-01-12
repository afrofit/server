import express, { Request, Response, Router } from "express";
import { Subscription } from "../../entity/Subscription";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";

const router = express.Router();

router.post(
	"/api/performance/save-user-daily-activity",
	[isAuth, isCurrentUser],
	(req: Request, res: Response) => {}
);

export { router as saveUserDailyActivityRouter };
