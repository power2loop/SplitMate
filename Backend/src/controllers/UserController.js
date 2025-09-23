// src/controllers/UserController.js
import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const getAllUsers = async (req, res) => {
    try {
        const allUser = await User.find();
        return res.status(201).json({ success: true, message: allUser });

    } catch {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Optional: pre-check to return a fast 409 before insert
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds is typical
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        // Handle unique index violation from DB
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
        const ok = user && await bcrypt.compare(password, user.password); // compare plaintext vs hash
        if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // set expiry
        // Option A: return token in body (SPA stores in memory/localStorage)
        // return res.status(200).json({ success: true, token });
        console.log(token);
        // Option B: set httpOnly cookie (more secure against XSS)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true behind HTTPS in prod
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ success: true, message: "Logged in" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
