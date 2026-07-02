import { z } from 'zod';

export const entrySchema = z.object({
  category: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT', 'DEDUCTION']),
  subCategory: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  financialYear: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid FY format (e.g., 2024-25)'),
  note: z.string().optional(),
  mode: z.enum(['CASH', 'BANK', 'CREDIT_CARD']).default('CASH'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['ACTIVE', 'EXCLUDED']).default('ACTIVE')
});

export type TaxEntryInput = z.infer<typeof entrySchema>;
