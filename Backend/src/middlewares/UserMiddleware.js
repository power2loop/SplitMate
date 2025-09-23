import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token; // read httpOnly cookie set by login [Set-Cookie] [web:15]
        if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const payload = jwt.verify(token, process.env.JWT_SECRET); // verify signature [JWT testing] [web:39]

        const user = await User.findById(payload.id).select('_id username email');

        if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};
