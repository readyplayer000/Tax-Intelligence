"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const USERS_PATH = path_1.default.join(__dirname, '../../users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'taxai_super_secret_key_123';
const SALT_ROUNDS = 10;
const readUsers = () => {
    if (!fs_1.default.existsSync(USERS_PATH)) {
        fs_1.default.writeFileSync(USERS_PATH, JSON.stringify([]));
        return [];
    }
    const data = fs_1.default.readFileSync(USERS_PATH, 'utf-8');
    return JSON.parse(data);
};
const writeUsers = (users) => {
    fs_1.default.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
};
const generateId = () => Math.random().toString(36).substr(2, 9);
// ── POST /api/auth/signup ──
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }
        const users = readUsers();
        const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
        const newUser = {
            id: generateId(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        writeUsers(users);
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        const users = readUsers();
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.default = router;
