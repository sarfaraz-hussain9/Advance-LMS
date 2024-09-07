import express from "express"
import {  isAuthenticated } from "../middleware/auth.js";

import { buySubscription } from "../controllers/paymentController.js";

const router = express.Router();

// buy substcription


router.get("/subscribe",isAuthenticated, buySubscription )

export default router