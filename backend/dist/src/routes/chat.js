"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /chat
router.post('/', async (req, res) => {
    try {
        const { user_id, financial_year, message } = req.body;
        // Validate input
        if (!user_id || !financial_year || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Simulate processing the message (replace with actual logic)
        const responseMessage = `Processed message: "${message}" for user ${user_id} in financial year ${financial_year}.`;
        // Send response
        res.status(200).json({ response: responseMessage });
    }
    catch (error) {
        console.error('Error in /chat endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
