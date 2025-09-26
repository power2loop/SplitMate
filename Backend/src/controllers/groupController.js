// controllers/GroupController.js
import crypto from "crypto";
import Group from "../models/GroupModel.js";
import User from "../models/UserModel.js";
import { group } from "console";
import expenses from "../models/Expense.js";

// POST /api/groups
export const createGroup = async (req, res) => {
  try {
    const { name, description = "" } = req.body;
    const inviteCode = crypto.randomBytes(6).toString("hex");

    const group = await Group.create({

      name,
      description,
      inviteCode,
      createdBy: req.user._id,
      members: [req.user._id],

    });

    await User.findByIdAndUpdate(req.user._id, { $push: { groups: group._id } });
    res.status(201).json({
      groupId: group._id,
      group,
    });

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
      .populate("createdBy", "username")
      .populate("expenses");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyGroups = async (req, res) => {
  const userId = req.user._id;
  const groups = await Group.find({ members: userId })
    .select("name description type expensesCount totalSpent members createdBy")
    .populate({ path: "members", select: "username", options: { limit: 8 } }) // preview
    .populate({ path: "createdBy", select: "username" });
  return res.status(200).json(groups);
};


// GET /api/groups  -> all groups for logged-in user
export const getAllGroup = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'username email')
      .populate('expenses'); // if you need expense amounts

    const formatted = groups.map(g => ({
      id: g._id.toString(),
      name: g.name,
      description: g.description,
      members: g.members.map(m => ({
        id: m._id.toString(),
        username: m.username,
        email: m.email,
        initials: m.username?.slice(0, 2).toUpperCase()
      })),
      expensesCount: g.expenses?.length || 0,
      totalSpent: g.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0),
      balance: 0 // or compute a real per-user balance if you have logic
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE /api/groups/:id
export const DeleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // authorize owner
    if (!group.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only creator can delete" });
    }

    // remove group ref from all users who have it
    await User.updateMany(
      { groups: group._id },
      { $pull: { groups: group._id } }          // remove from users' groups[]
    ); // uses updateMany with $pull [web:212][web:218]

    // optionally: also delete related expenses if required
    // await Expense.deleteMany({ _id: { $in: group.expenses } });

    await group.deleteOne();                     // delete the group doc [web:206][web:214]
    return res.json({ message: "Group deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// POST /api/groups/:id/leave
export const LeaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // prevent creator from leaving without deleting or transferring ownership
    if (group.createdBy.equals(req.user._id)) {
      return res.status(400).json({ message: "Creator cannot leave; delete the group instead" });
    }

    // ensure member exists
    const isMember = group.members.some(m => m.equals(req.user._id));
    if (!isMember) return res.status(400).json({ message: "Not a member" });

    // pull member from group and group from user
    await Group.updateOne(
      { _id: group._id },
      { $pull: { members: req.user._id } }      // remove member from group.members
    ); // $pull on array of ObjectIds [web:218]

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { groups: group._id } }          // remove group from user.groups
    ); // keeps references consistent [web:218]

    // delete group if it has no members left
    const updated = await Group.findById(group._id).select('members');
    if (updated && updated.members.length === 0) {
      await Group.deleteOne({ _id: group._id }); // cleanup empty group [web:206]
    }

    return res.json({ message: "Left group" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


