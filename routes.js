import express from "express";
import authRouter from "./routes/authRoutes.js";
import emailRouter from "./routes/SendEmailRoutes.js";
const router = express.Router();

router.use("/user", authRouter);
router.use("/email", emailRouter);

export default router;
