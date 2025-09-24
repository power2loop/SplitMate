// controllers/GroupController.js
import crypto from "crypto";
import Group from "../models/GroupModel.js";
import User from "../models/UserModel.js";

// POST /api/groups
export const createGroup = async (req, res) => {
  try {
    const { name, description = "" } = req.body;
    const inviteCode = crypto.randomBytes(6).toString("hex");

    const group = await Group.create({
      name,
      description,
      inviteCode,
      members: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { groups: group._id } });
    res.status(201).json(group);
  } catch (err) {
    // If inviteCode collides, MongoDB throws duplicate key (E11000)
    res.status(500).json({ error: err.message });
  }
};

// POST /api/groups/join/:code
export const joinGroup = async (req, res) => {
  try {
    const { code } = req.params;
    const group = await Group.findOne({ inviteCode: code });
    if (!group) return res.status(404).json({ message: "Invalid invite code" });

    const alreadyMember = group.members.some(m => m.equals(req.user._id));
    if (!alreadyMember) {
      group.members.push(req.user._id);
      await group.save();
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { groups: group._id } });
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/groups/:id
export const getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "username email")
      .populate("expenses");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
