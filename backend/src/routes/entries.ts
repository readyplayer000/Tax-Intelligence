import { Router } from 'express';
import { entrySchema } from 'shared';
import fs from 'fs';
import path from 'path';

const router = Router();
const DB_PATH = path.join(__dirname, '../../db.json');

// Helper to read DB
const readDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data: any[]) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

router.post('/', (req, res) => {
  const result = entrySchema.safeParse(req.body);
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
  
  if (category) entries = entries.filter((e: any) => e.category === category);
  if (fy) entries = entries.filter((e: any) => e.financialYear === fy);
  if (userId) entries = entries.filter((e: any) => e.userId === userId);
  
  res.json(entries);
});

router.get('/summary', (req, res) => {
  const entries = readDB();
  const activeEntries = entries.filter((e: any) => e.status !== 'EXCLUDED');
  const summary = {
    income: activeEntries.filter((e: any) => e.category === 'INCOME').reduce((acc: number, e: any) => acc + e.amount, 0),
    expense: activeEntries.filter((e: any) => e.category === 'EXPENSE').reduce((acc: number, e: any) => acc + e.amount, 0),
    investment: activeEntries.filter((e: any) => e.category === 'INVESTMENT').reduce((acc: number, e: any) => acc + e.amount, 0),
    deduction: activeEntries.filter((e: any) => e.category === 'DEDUCTION').reduce((acc: number, e: any) => acc + e.amount, 0),
  };
  res.json(summary);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const result = entrySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const entries = readDB();
  const index = entries.findIndex((e: any) => e.id === id);
  
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
  const filteredEntries = entries.filter((e: any) => e.id !== id);
  
  if (entries.length === filteredEntries.length) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  writeDB(filteredEntries);
  res.status(204).send();
});

export default router;
