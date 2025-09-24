// routes/groups.js
import express from "express";
import { createGroup, joinGroup, getGroupDetails, getAllGroup, LeaveGroup, DeleteGroup } from "../controllers/GroupController.js";
import { protect } from "../middlewares/GroupMiddleware.js";

const router = express.Router();

// list before param route
router.get("/", protect, getAllGroup);               // GET /api/groups
router.post("/", protect, createGroup);              // POST /api/groups
router.post("/join/:code", protect, joinGroup);      // POST /api/groups/join/:code
router.get("/:id", protect, getGroupDetails);        // GET /api/groups/:id
router.post("/:id/leave", protect, LeaveGroup);
router.delete("/:id", protect, DeleteGroup);

export default router;
