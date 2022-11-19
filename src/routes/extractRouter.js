import { Router } from "express";
import { account, transactions } from "../controllers/extractControlles.js";

const router = Router();

router.post("/extract", transactions);

router.get("/extract", account);

export default router;