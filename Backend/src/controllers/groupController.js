import crypto from "crypto";
import Group from "../models/GroupModel.js";
import User from "../models/UserModel.js";

/**
 * Create a new group
 */
export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const inviteCode = crypto.randomBytes(6).toString("hex");

    const group = await Group.create({
      name,
      inviteCode,
      members: [req.user._id]
    });

    // add group reference to creator's profile
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { groups: group._id } }
    );

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Join a group via invite code
 */
export const joinGroup = async (req, res) => {
  try {
    const { code } = req.params;

    const group = await Group.findOne({ inviteCode: code });
    if (!group) return res.status(404).json({ message: "Invalid invite code" });

    // Avoid duplicate joins
    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { groups: group._id } }
      );
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get group details with populated members & expenses
 */
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
