import express from "express";
import {
    createGroup,
    joinGroup,
    getGroupDetails,
    getMyGroups,
    LeaveGroup,
    DeleteGroup,
    getGroupAnalytics,
    recordSettlement,
} from "../controllers/groupController.js";
import { protect } from "../middlewares/GroupMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyGroups);
router.post("/", protect, createGroup);
router.post("/join/:code", protect, joinGroup);
router.get("/:id", getGroupDetails);

// NEW: analytics + settlements
router.get("/:id/analytics", protect, getGroupAnalytics);
router.post("/:id/settlements", protect, recordSettlement);

router.post("/:id/leave", protect, LeaveGroup);
router.delete("/:id", protect, DeleteGroup);

export default router;
