import express, { Request, Response } from "express";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";

const router = express.Router();

router.post(
	"/api/performance/save-user-daily-activity",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {}
);

export { router as saveUserDailyActivityRouter };
