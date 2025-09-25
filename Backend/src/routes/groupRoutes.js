// routes/groups.js
import express from "express";
import { createGroup, joinGroup, getGroupDetails, getAllGroup, LeaveGroup, DeleteGroup } from "../controllers/GroupController.js";
import { protect } from "../middlewares/GroupMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllGroup);
router.post("/", protect, createGroup);
router.post("/join/:code", protect, joinGroup);
router.get("/:id", getGroupDetails);
router.post("/:id/leave", protect, LeaveGroup);
router.delete("/:id", protect, DeleteGroup);

export default router;
