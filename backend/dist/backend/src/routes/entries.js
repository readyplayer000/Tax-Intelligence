"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shared_1 = require("shared");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const DB_PATH = path_1.default.join(__dirname, '../../db.json');
// Helper to read DB
const readDB = () => {
    if (!fs_1.default.existsSync(DB_PATH)) {
        fs_1.default.writeFileSync(DB_PATH, JSON.stringify([]));
        return [];
    }
    const data = fs_1.default.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
};
// Helper to write DB
const writeDB = (data) => {
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};
router.post('/', (req, res) => {
    const result = shared_1.entrySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    const entries = readDB();
    const newEntry = {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'user_123', // Mock user
        ...result.data
    };
    entries.push(newEntry);
    writeDB(entries);
    res.status(201).json(newEntry);
});
router.get('/', (req, res) => {
    const { category, fy, userId } = req.query;
    let entries = readDB();
    if (category)
        entries = entries.filter((e) => e.category === category);
    if (fy)
        entries = entries.filter((e) => e.financialYear === fy);
    if (userId)
        entries = entries.filter((e) => e.userId === userId);
    res.json(entries);
});
router.get('/summary', (req, res) => {
    const entries = readDB();
    const activeEntries = entries.filter((e) => e.status !== 'EXCLUDED');
    const summary = {
        income: activeEntries.filter((e) => e.category === 'INCOME').reduce((acc, e) => acc + e.amount, 0),
        expense: activeEntries.filter((e) => e.category === 'EXPENSE').reduce((acc, e) => acc + e.amount, 0),
        investment: activeEntries.filter((e) => e.category === 'INVESTMENT').reduce((acc, e) => acc + e.amount, 0),
        deduction: activeEntries.filter((e) => e.category === 'DEDUCTION').reduce((acc, e) => acc + e.amount, 0),
    };
    res.json(summary);
});
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const result = shared_1.entrySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    const entries = readDB();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Entry not found' });
    }
    entries[index] = { ...entries[index], ...result.data };
    writeDB(entries);
    res.json(entries[index]);
});
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const entries = readDB();
    const filteredEntries = entries.filter((e) => e.id !== id);
    if (entries.length === filteredEntries.length) {
        return res.status(404).json({ error: 'Entry not found' });
    }
    writeDB(filteredEntries);
    res.status(204).send();
});
exports.default = router;
