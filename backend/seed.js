const fs = require('fs');
const dbPath = 'c:/Users/Rohith/Documents/Antigravity/taxai/backend/db.json';
const db = JSON.parse(fs.readFileSync(dbPath));

const categories = ['INCOME', 'EXPENSE', 'INVESTMENT', 'DEDUCTION'];
const subCategories = {
  INCOME: ['Salary', 'Freelance', 'Rent', 'Shares', 'Dividend'],
  EXPENSE: ['Rent', 'Groceries', 'Utilities', 'Car', 'Entertainment'],
  INVESTMENT: ['ELSS', 'PPF', 'Stocks', 'Bonds', 'Mutual Fund'],
  DEDUCTION: ['80C', '80D', '80G', 'Education Loan', 'Home Loan Interest']
};
const modes = ['BANK', 'CASH', 'UPI'];

for(let i=0; i<100; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const subCategory = subCategories[category][Math.floor(Math.random() * subCategories[category].length)];
  
  const amt = Math.floor(Math.random() * 90000) + 10000;
  // random year between 2024 and 2026
  const yr = Math.floor(Math.random() * 3) + 2024;
  db.push({
    id: Math.random().toString(36).substr(2, 9),
    userId: 'user_123',
    category,
    subCategory,
    description: `Generated ${category} - ${subCategory}`,
    amount: amt,
    date: new Date(Date.now() - Math.random() * 1e10).toISOString().split('T')[0],
    financialYear: `${yr}-${(yr+1).toString().slice(2)}`,
    note: 'Auto generated',
    mode: modes[Math.floor(Math.random() * modes.length)],
    tags: [],
    status: 'ACTIVE'
  });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Added 100 entries');
