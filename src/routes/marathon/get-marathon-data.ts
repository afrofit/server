import express, { Request, Response } from "express";

const router = express.Router();

router.get(
	"/api/marathon/get-marathon-data",
	(req: Request, res: Response) => {}
);

export { router as getUserDailyActivityRouter };
