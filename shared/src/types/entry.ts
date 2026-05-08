export type CategoryType = 'INCOME' | 'EXPENSE' | 'INVESTMENT' | 'DEDUCTION';

export interface TaxEntry {
  id?: string;
  userId: string;
  category: CategoryType;
  description: string;
  amount: number;
  date: string;
  financialYear: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AgentResponse {
  response: string;
  suggestions?: string[];
}
