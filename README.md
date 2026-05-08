# TaxAI — Your Intelligent Tax Manager

TaxAI is a comprehensive platform designed for the Indian tax ecosystem. It combines structured data entry (Tally-style) with a powerful AI advisor to help you maximize tax savings.

## Architecture
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, TypeScript.
- **AI Agent**: Python 3.11, FastAPI, LangChain, Claude API.
- **Shared**: Zod schemas and TypeScript types shared across FE and BE.

## Project Structure
```text
taxai/
├── frontend/                  # React UI
├── backend/                   # Express API
├── ai-agent/                  # Python AI Service
├── shared/                    # Shared logic & types
└── docker-compose.yml         # Full stack deployment
```

## Getting Started

### Local Development (Manual)

1. **Setup Shared**:
   ```bash
   cd shared
   npm install
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Setup AI Agent**:
   ```bash
   cd ai-agent
   python -m venv venv
   source venv/bin/activate # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

### Using Docker
```bash
docker compose up --build
```

## Features
- **Tally-style Entry**: Categorize income, expenses, and deductions with ease.
- **AI Tax Advisor**: Get personalized suggestions on 80C, 80D, HRA, and more.
- **Premium UI**: Modern dark-mode interface with glassmorphic elements.
- **Old vs New Regime**: (Planned) Comparison tool for tax regimes.

## Environment Variables
Create a `.env` file in the root:
```env
ANTHROPIC_API_KEY=your_key_here
DB_PASSWORD=your_password
JWT_SECRET=your_secret
```
