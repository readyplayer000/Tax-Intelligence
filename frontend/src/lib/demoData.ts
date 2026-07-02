// Rich demo dataset — 5-digit transactions across all categories, multiple months
// Used when the user logs in as the demo account (id: 'demo')

export const DEMO_USER = {
  id: 'demo',
  name: 'Demo User',
  email: 'demo@taxai.app',
};

export interface DemoEntry {
  id: string;
  userId: string;
  category: 'INCOME' | 'EXPENSE' | 'INVESTMENT' | 'DEDUCTION';
  subCategory: string;
  description: string;
  amount: number;
  date: string;
  financialYear: string;
  mode: string;
  status: 'ACTIVE' | 'EXCLUDED';
  note: string;
  tags: string[];
}

export const DEMO_ENTRIES: DemoEntry[] = [
  // ── INCOME ───────────────────────────────────────────────────
  { id: 'd1',  userId: 'demo', category: 'INCOME',     subCategory: 'Salary',         description: 'Monthly Salary — Tech Corp',         amount: 95000,  date: '2024-10-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Primary employment income', tags: ['salary'] },
  { id: 'd2',  userId: 'demo', category: 'INCOME',     subCategory: 'Salary',         description: 'Monthly Salary — Tech Corp',         amount: 95000,  date: '2024-11-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Primary employment income', tags: ['salary'] },
  { id: 'd3',  userId: 'demo', category: 'INCOME',     subCategory: 'Salary',         description: 'Monthly Salary — Tech Corp',         amount: 95000,  date: '2024-12-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Primary employment income', tags: ['salary'] },
  { id: 'd4',  userId: 'demo', category: 'INCOME',     subCategory: 'Salary',         description: 'Monthly Salary — Tech Corp',         amount: 98000,  date: '2025-01-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Annual increment applied', tags: ['salary'] },
  { id: 'd5',  userId: 'demo', category: 'INCOME',     subCategory: 'Salary',         description: 'Monthly Salary — Tech Corp',         amount: 98000,  date: '2025-02-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Annual increment applied', tags: ['salary'] },
  { id: 'd6',  userId: 'demo', category: 'INCOME',     subCategory: 'Freelance',      description: 'UI/UX Consulting Project — Startup', amount: 45000,  date: '2024-10-15', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: '3-month contract payment', tags: ['freelance', 'consulting'] },
  { id: 'd7',  userId: 'demo', category: 'INCOME',     subCategory: 'Freelance',      description: 'Web App Development — Client B',    amount: 62000,  date: '2024-12-20', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Milestone 2 payment', tags: ['freelance'] },
  { id: 'd8',  userId: 'demo', category: 'INCOME',     subCategory: 'Interest',       description: 'Bank Fixed Deposit Interest',        amount: 18500,  date: '2024-10-31', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Annual FD interest credited', tags: ['interest', 'passive'] },
  { id: 'd9',  userId: 'demo', category: 'INCOME',     subCategory: 'Dividends',      description: 'Mutual Fund Dividend Payout',        amount: 12800,  date: '2024-11-10', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Dividend from equity fund', tags: ['dividend', 'investment'] },
  { id: 'd10', userId: 'demo', category: 'INCOME',     subCategory: 'Rental Income',  description: 'House Property Rent Received',       amount: 28000,  date: '2024-10-05', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Monthly rental — 2BHK flat', tags: ['rental'] },
  { id: 'd11', userId: 'demo', category: 'INCOME',     subCategory: 'Rental Income',  description: 'House Property Rent Received',       amount: 28000,  date: '2024-11-05', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Monthly rental — 2BHK flat', tags: ['rental'] },
  { id: 'd12', userId: 'demo', category: 'INCOME',     subCategory: 'Rental Income',  description: 'House Property Rent Received',       amount: 28000,  date: '2024-12-05', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Monthly rental — 2BHK flat', tags: ['rental'] },

  // ── EXPENSE ──────────────────────────────────────────────────
  { id: 'd13', userId: 'demo', category: 'EXPENSE',    subCategory: 'Rent',           description: 'Monthly House Rent — Koramangala',  amount: 38000,  date: '2024-10-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'HRA partially claimable', tags: ['rent', 'hra'] },
  { id: 'd14', userId: 'demo', category: 'EXPENSE',    subCategory: 'Rent',           description: 'Monthly House Rent — Koramangala',  amount: 38000,  date: '2024-11-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'HRA partially claimable', tags: ['rent', 'hra'] },
  { id: 'd15', userId: 'demo', category: 'EXPENSE',    subCategory: 'Rent',           description: 'Monthly House Rent — Koramangala',  amount: 38000,  date: '2024-12-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'HRA partially claimable', tags: ['rent', 'hra'] },
  { id: 'd16', userId: 'demo', category: 'EXPENSE',    subCategory: 'Groceries',      description: 'BigBasket Monthly Order',            amount: 14500,  date: '2024-10-10', financialYear: '2024-25', mode: 'CARD',   status: 'ACTIVE', note: 'Monthly grocery subscription', tags: ['food'] },
  { id: 'd17', userId: 'demo', category: 'EXPENSE',    subCategory: 'Groceries',      description: 'BigBasket Monthly Order',            amount: 13200,  date: '2024-11-10', financialYear: '2024-25', mode: 'CARD',   status: 'ACTIVE', note: 'Monthly grocery subscription', tags: ['food'] },
  { id: 'd18', userId: 'demo', category: 'EXPENSE',    subCategory: 'Travel',         description: 'Flight Tickets — Delhi Business Trip', amount: 22000, date: '2024-11-18', financialYear: '2024-25', mode: 'CARD',   status: 'ACTIVE', note: 'Reimbursable from company', tags: ['travel', 'business'] },
  { id: 'd19', userId: 'demo', category: 'EXPENSE',    subCategory: 'Healthcare',     description: 'Annual Health Checkup — Apollo',    amount: 11500,  date: '2024-10-22', financialYear: '2024-25', mode: 'CARD',   status: 'ACTIVE', note: 'Company tie-up discount applied', tags: ['health'] },
  { id: 'd20', userId: 'demo', category: 'EXPENSE',    subCategory: 'Utility Bills',  description: 'Electricity + Internet + Gas Bills', amount: 8500,   date: '2024-10-15', financialYear: '2024-25', mode: 'UPI',    status: 'ACTIVE', note: 'Monthly utilities', tags: ['utilities'] },
  { id: 'd21', userId: 'demo', category: 'EXPENSE',    subCategory: 'Utility Bills',  description: 'Electricity + Internet + Gas Bills', amount: 9200,   date: '2024-11-15', financialYear: '2024-25', mode: 'UPI',    status: 'ACTIVE', note: 'Monthly utilities', tags: ['utilities'] },
  { id: 'd22', userId: 'demo', category: 'EXPENSE',    subCategory: 'Education',      description: 'Online Course — AWS Certification',  amount: 15000,  date: '2024-12-08', financialYear: '2024-25', mode: 'CARD',   status: 'ACTIVE', note: 'Professional upskilling', tags: ['education'] },

  // ── INVESTMENT ───────────────────────────────────────────────
  { id: 'd23', userId: 'demo', category: 'INVESTMENT', subCategory: 'ELSS (80C)',     description: 'Axis Long Term Equity Fund — SIP',  amount: 25000,  date: '2024-10-05', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Section 80C — ₹1.5L limit', tags: ['80c', 'sip'] },
  { id: 'd24', userId: 'demo', category: 'INVESTMENT', subCategory: 'ELSS (80C)',     description: 'Axis Long Term Equity Fund — SIP',  amount: 25000,  date: '2024-11-05', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Section 80C — ₹1.5L limit', tags: ['80c', 'sip'] },
  { id: 'd25', userId: 'demo', category: 'INVESTMENT', subCategory: 'PPF (80C)',      description: 'Public Provident Fund Deposit',      amount: 50000,  date: '2024-10-12', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Annual PPF deposit — 15yr lock', tags: ['ppf', '80c'] },
  { id: 'd26', userId: 'demo', category: 'INVESTMENT', subCategory: 'NPS (80CCD)',    description: 'National Pension System Contribution', amount: 30000, date: '2024-11-20', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Sec 80CCD(1B) — extra ₹50k', tags: ['nps', '80ccd'] },
  { id: 'd27', userId: 'demo', category: 'INVESTMENT', subCategory: 'Mutual Funds',   description: 'Nifty 50 Index Fund — Lumpsum',      amount: 75000,  date: '2024-12-15', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Long term wealth creation', tags: ['mf', 'equity'] },
  { id: 'd28', userId: 'demo', category: 'INVESTMENT', subCategory: 'Fixed Deposit (5yr)', description: 'SBI Tax Saving FD — 5 Year',     amount: 50000,  date: '2024-10-25', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: '5yr tax saving FD under 80C', tags: ['fd', '80c'] },

  // ── DEDUCTION ────────────────────────────────────────────────
  { id: 'd29', userId: 'demo', category: 'DEDUCTION',  subCategory: 'Health Insurance (80D)', description: 'Star Health Family Floater Plan', amount: 25000, date: '2024-10-08', financialYear: '2024-25', mode: 'CARD',   status: 'ACTIVE', note: 'Self + Spouse + Child — 80D', tags: ['80d', 'health'] },
  { id: 'd30', userId: 'demo', category: 'DEDUCTION',  subCategory: 'Home Loan Interest (24b)', description: 'Home Loan Interest — HDFC Bank', amount: 65000, date: '2024-10-30', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Section 24b deduction — max ₹2L', tags: ['homeloan', '24b'] },
  { id: 'd31', userId: 'demo', category: 'DEDUCTION',  subCategory: 'Education Loan (80E)',  description: 'Education Loan Interest Paid',     amount: 18000,  date: '2024-11-30', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'MBA loan repayment', tags: ['80e', 'education'] },
  { id: 'd32', userId: 'demo', category: 'DEDUCTION',  subCategory: 'Standard Deduction',    description: 'Standard Deduction FY 2024-25',    amount: 50000,  date: '2024-04-01', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: 'Flat deduction for salaried employees', tags: ['standard'] },
  { id: 'd33', userId: 'demo', category: 'DEDUCTION',  subCategory: 'Charity (80G)',          description: 'PM CARES Fund Donation',           amount: 11000,  date: '2024-12-10', financialYear: '2024-25', mode: 'BANK',   status: 'ACTIVE', note: '100% deduction under 80G', tags: ['80g', 'charity'] },
];

// Precomputed summary for demo mode
export const DEMO_SUMMARY = {
  income:     DEMO_ENTRIES.filter(e => e.category === 'INCOME'     && e.status === 'ACTIVE').reduce((s, e) => s + e.amount, 0),
  expense:    DEMO_ENTRIES.filter(e => e.category === 'EXPENSE'    && e.status === 'ACTIVE').reduce((s, e) => s + e.amount, 0),
  investment: DEMO_ENTRIES.filter(e => e.category === 'INVESTMENT' && e.status === 'ACTIVE').reduce((s, e) => s + e.amount, 0),
  deduction:  DEMO_ENTRIES.filter(e => e.category === 'DEDUCTION'  && e.status === 'ACTIVE').reduce((s, e) => s + e.amount, 0),
};
