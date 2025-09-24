import express from "express";
import { createGroup, joinGroup, getGroupDetails } from "../controllers/GroupController.js";
import { protect } from "../middlewares/GroupMiddleware.js";

const router = express.Router();

// POST /api/groups        -> create new group
router.post("/", protect, createGroup);

// POST /api/groups/join/:code  -> join by invite code
router.post("/join/:code", protect, joinGroup);

// GET /api/groups/:id     -> group details
router.get("/:id", protect, getGroupDetails);

export default router;
