import { Router } from "express";
import { account, transactions } from "../controllers/extractControlles.js";
import transactionsValidation from "../middlewares/transactionsValidation.js";


const router = Router();

router.post("/extract", transactionsValidation, transactions);

router.get("/extract", account);

export default router;