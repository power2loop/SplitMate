import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const requireAuth = async (req, res, next) => {
    try {
        const cookieToken = req.cookies?.token;
        const header = req.get("Authorization");
        const headerToken = header?.startsWith("Bearer ") ? header.slice(7) : null;
        const token = cookieToken || headerToken;
        // console.log(token);

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select("_id username email");

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};
