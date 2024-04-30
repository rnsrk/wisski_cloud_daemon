import {Router} from "express";
import healthcheckRoutes from "./healthcheck/healthcheck.router";
import instanceRoutes from "./instance/instance.router";

const router = Router();
// Base routes for all API endpoints
router.use('/health-check', healthcheckRoutes);
router.use('/instance', instanceRoutes);

export default router;
