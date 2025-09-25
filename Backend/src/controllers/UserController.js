// Backend/src/controllers/UserController.js
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req, res) => {
    try {
        const allUser = await User.find();
        return res.status(200).json({ success: true, message: allUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ success: true, message: "User registered successfully", token});
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ success: false, message: "Email already registered" });
        }
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        const ok = user && await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log(token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/', // ensure a known path so we can clear it
        });

        // Optional: return user for immediate UI hydration
        return res.status(200).json({
            success: true,
            message: "Logged in",
            user: { id: user._id, username: user.username, email: user.email },
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// NEW: logout clears the cookie by setting an immediate expiry
export const logoutUser = async (req, res) => {
    try {
        // Use the same attributes (path/sameSite/secure) so the browser actually removes it
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
        });
        // Alternatively: res.cookie('token', '', { maxAge: 0, ...same options })
        return res.status(200).json({ success: true, message: "Logged out" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
