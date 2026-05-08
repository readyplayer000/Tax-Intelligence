"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entrySchema = void 0;
const zod_1 = require("zod");
exports.entrySchema = zod_1.z.object({
    category: zod_1.z.enum(['INCOME', 'EXPENSE', 'INVESTMENT', 'DEDUCTION']),
    subCategory: zod_1.z.string().optional(),
    description: zod_1.z.string().min(1, 'Description is required'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    financialYear: zod_1.z.string().regex(/^\d{4}-\d{2}$/, 'Invalid FY format (e.g., 2024-25)'),
    note: zod_1.z.string().optional(),
    mode: zod_1.z.enum(['CASH', 'BANK', 'CREDIT_CARD']).default('CASH'),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    status: zod_1.z.enum(['ACTIVE', 'EXCLUDED']).default('ACTIVE')
});
