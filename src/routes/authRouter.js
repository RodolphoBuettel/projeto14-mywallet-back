import {signIn, signUp} from "../controllers/authControllers.js";
import { signUpBodyValidation } from "../middlewares/signUpBodyValidation.js";
import { signInBodyValidation } from "../middlewares/signInBodyValidation.js";
import { Router } from "express";

const router = Router();

router.post("/sign-up", signUpBodyValidation, signUp);

router.post("/sign-in", signInBodyValidation, signIn);

export default router;