import express, { Request, Response } from "express";

import { checkUserAuth } from "../../lib/checkUserAuth";
import { isAuth } from "../../middleware/isAuth";
import { isCurrentUser } from "../../middleware/isCurrentUser";
import { STATUS_CODE } from "../../util/status-codes";
import performanceControllers from "./controllers";

const router = express.Router();

router.get(
	"/api/performance/get-user-performance-data",
	[isAuth, isCurrentUser],
	async (req: Request, res: Response) => {
		const user = await checkUserAuth(req);
		if (!user)
			return res.status(STATUS_CODE.FORBIDDEN).send("Access Forbidden.");

		try {
			const derivedUserPerformanceData =
				await performanceControllers.getUserPerformanceData(user);
			return res.status(STATUS_CODE.OK).send(derivedUserPerformanceData);
		} catch (error) {
			console.error(error);
			return res.status(STATUS_CODE.INTERNAL_ERROR).send(null);
		}
	}
);

export { router as getUserPerformanceDataRouter };
