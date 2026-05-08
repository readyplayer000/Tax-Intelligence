"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    // Mock login
    res.json({
        token: 'mock_jwt_token',
        user: { id: 'user_123', name: 'Rohith', email: 'rohith@example.com' }
    });
});
exports.default = router;
