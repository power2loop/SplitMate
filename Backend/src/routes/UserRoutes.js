// src/routes/UserRoutes.js
import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { registerUser, loginUser, getAllUsers } from '../controllers/UserController.js';

const router = express.Router();

const registerSchema = checkSchema({
    username: {
        in: ['body'],
        trim: true,
        notEmpty: { errorMessage: 'Username is required' },
    },
    email: {
        in: ['body'],
        isEmail: { errorMessage: 'Valid email is required' },
        normalizeEmail: true,
    },
    password: {
        in: ['body'],
        isLength: { options: { min: 6 }, errorMessage: 'Password must be at least 6 chars' },
    },
});

const loginSchema = checkSchema({
    email: {
        in: ['body'],
        isEmail: { errorMessage: 'Valid email is required' },
        normalizeEmail: true,
    },
    password: { in: ['body'], notEmpty: { errorMessage: 'Password is required' } },
});

function runValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
}

router.post('/register', registerSchema, runValidation, registerUser);
router.post('/login', loginSchema, runValidation, loginUser);
router.post('/', getAllUsers);


export default router;
