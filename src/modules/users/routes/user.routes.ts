import { Router } from "express";
import userController from "../controllers/user.controller";
import { verifyToken } from "../../auth/middlewares/auth.middleware";
import { verifyRole } from "@/modules/auth/middlewares/roleGuard.middleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Public user lookup routes - should be protected in production
// In a real-world scenario, these should have role-based access control
router.get("/google/:googleId", verifyRole, userController.getUserByGoogleId);
router.get("/email/:email", verifyRole, userController.getUserByEmail);

// User management routes
router.get("/", verifyRole, userController.getUsersPaginated);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.put("/:id/profile", userController.completeProfile);

export default router;
