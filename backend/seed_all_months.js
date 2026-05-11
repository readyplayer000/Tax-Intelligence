const fs = require('fs');
const dbPath = 'c:/Users/Rohith/Documents/Antigravity/taxai/backend/db.json';
const db = JSON.parse(fs.readFileSync(dbPath));

const years = [
  { fy: '2023-24', startYear: 2023 },
  { fy: '2024-25', startYear: 2024 },
  { fy: '2025-26', startYear: 2025 },
  { fy: '2026-27', startYear: 2026 }
];

for (const year of years) {
  for (let month = 0; month < 12; month++) {
    // April is month 3 in JS Date (0-indexed)
    let d = new Date(year.startYear, 3 + month, 15);
    
    // Income
    db.push({
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user_123',
      category: 'INCOME',
      subCategory: 'Salary',
      description: `Guaranteed Income`,
      amount: Math.floor(Math.random() * 50000) + 100000,
      date: d.toISOString().split('T')[0],
      financialYear: year.fy,
      note: 'Auto generated to fill graph',
      mode: 'BANK',
      tags: [],
      status: 'ACTIVE'
    });

    // Expense
    db.push({
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user_123',
      category: 'EXPENSE',
      subCategory: 'Rent',
      description: `Guaranteed Expense`,3
      amount: Math.floor(Math.random() * 20000) + 30000,
      date: d.toISOString().split('T')[0],
      financialYear: year.fy,
      note: 'Auto generated to fill graph',
      mode: 'BANK',
      tags: [],
      status: 'ACTIVE'
    });
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Added guaranteed income and expense for every month of every FY');
