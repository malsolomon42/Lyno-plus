import { Router } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import stripeRouter from "./stripe";

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(stripeRouter);

router.get("/", (_req, res) => {
	res.status(200).json({ status: "ok", message: "Server is live" });
});

export default router;


