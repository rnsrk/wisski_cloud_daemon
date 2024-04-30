import {Router} from "express";
const router = Router();
import {healthcheck, mailTest} from "./healthcheck.controller";

// Base routes for all API endpoints
router.get('/', healthcheck);

// Test route for sending mails
router.get('/mail-test', mailTest);

export default router;
