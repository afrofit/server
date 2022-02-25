import express, { Request, Response } from "express";

const router = express.Router();

router.post(
	"/api/marathon/save-user-marathon-activity",
	(req: Request, res: Response) => {}
);

export { router as getUserDailyActivityRouter };
