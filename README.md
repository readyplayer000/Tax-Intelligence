<div align="center">

# ðŸ§  Reinventing Tax Intelligence

### *AI-Powered Tax Management Platform for the Modern Era*

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Reinventing Tax Intelligence** is a full-stack, AI-powered taxation assistant that simplifies financial tracking, tax optimization, and compliance using cutting-edge AI â€” built for Indian taxpayers navigating the 2025-26 tax year and beyond.

[Live Demo](#) Â· [Report Bug](https://github.com/readyplayer000/Reinventing-Tax-Intelligence/issues) Â· [Request Feature](https://github.com/readyplayer000/Reinventing-Tax-Intelligence/issues)

</div>

---

## âœ¨ Features

- ðŸ¤– **Trio AI Chatbot** â€” Holographic tax strategist powered by Google Gemini, trained on the latest 2026 Indian Tax regulations
- ðŸ“Š **Smart Analytics Dashboard** â€” Real-time income/expense charts with financial year selection
- ðŸ“ **Transaction Ledger** â€” Add, edit, delete, and exclude financial entries across all categories
- ðŸ§® **GST Compliance Hub** â€” Quick GST calculator, GSTIN verification, and upcoming return alerts
- ðŸ“ˆ **Financial Intelligence** â€” AI-driven projections, tax efficiency score, and wealth health meter
- ðŸ“„ **Tax Reports** â€” Auto-generated reports with regime comparison (New vs Old)
- ðŸ”’ **Secure Auth** â€” JWT-based authentication system
- âš¡ **Regime Advisor** â€” Real-time comparison of Old vs New tax regime savings
- ðŸ‡®ðŸ‡³ **2026-Ready** â€” Built with the new Income Tax Act rules, Crypto/VDA taxation, and GST Hard Compliance

---

## ðŸ› ï¸ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Recharts | Data Visualization |
| React Query | Server State Management |
| Zustand | Client State |
| React Router v6 | Navigation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API Server |
| TypeScript | Type Safety |
| PostgreSQL | Primary Database |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Zod | Schema Validation |

### AI Agent
| Technology | Purpose |
|---|---|
| Python + FastAPI | Agent Microservice |
| LangChain | AI Orchestration |
| Google Gemini | Language Model |
| Pydantic | Data Validation |
| Uvicorn | ASGI Server |

---

## ðŸ“ Project Structure

```
Reinventing-Tax-Intelligence/
â”œâ”€â”€ ðŸ“ frontend/              # React + Vite Application
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”‚   â”œâ”€â”€ Dashboard.tsx     # Main dashboard with analytics
â”‚   â”‚   â”‚   â”œâ”€â”€ DataEntry.tsx     # Transaction management
â”‚   â”‚   â”‚   â”œâ”€â”€ Analytics.tsx     # Financial intelligence
â”‚   â”‚   â”‚   â”œâ”€â”€ ChatBot.tsx       # Trio AI chatbot
â”‚   â”‚   â”‚   â”œâ”€â”€ GST.tsx           # GST compliance hub
â”‚   â”‚   â”‚   â”œâ”€â”€ Reports.tsx       # Tax reports
â”‚   â”‚   â”‚   â””â”€â”€ Login.tsx         # Authentication
â”‚   â”‚   â”œâ”€â”€ App.tsx
â”‚   â”‚   â””â”€â”€ main.tsx
â”‚   â””â”€â”€ vite.config.ts
â”‚
â”œâ”€â”€ ðŸ“ backend/               # Node.js + Express API
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ routes/
â”‚       â”‚   â”œâ”€â”€ entries.ts        # Financial entries CRUD
â”‚       â”‚   â”œâ”€â”€ auth.ts           # Authentication
â”‚       â”‚   â””â”€â”€ chat.ts           # Chat proxy
â”‚       â””â”€â”€ index.ts
â”‚
â”œâ”€â”€ ðŸ“ ai-agent/              # Python FastAPI AI Microservice
â”‚   â””â”€â”€ app/
â”‚       â”œâ”€â”€ agent.py              # LangChain AI agent
â”‚       â”œâ”€â”€ main.py               # FastAPI endpoints
â”‚       â””â”€â”€ prompts/
â”‚           â””â”€â”€ system_prompt.txt # Trio AI personality & rules
â”‚
â”œâ”€â”€ ðŸ“ shared/                # Shared TypeScript types & schemas
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ validators/
â”‚       â”‚   â””â”€â”€ entrySchema.ts
â”‚       â””â”€â”€ index.ts
â”‚
â”œâ”€â”€ docker-compose.yml        # Full stack Docker setup
â”œâ”€â”€ package.json              # Monorepo workspace config
â””â”€â”€ .env.example              # Environment variables template
```

---

## ðŸš€ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/readyplayer000/Reinventing-Tax-Intelligence.git
cd Reinventing-Tax-Intelligence
```

### 2. Set Up Environment Variables
Create a `.env` file in the root:
```env
# AI Agent
GOOGLE_API_KEY=your_google_gemini_api_key

# Backend
JWT_SECRET=your_jwt_secret
DB_PASSWORD=your_db_password

# Database
POSTGRES_USER=taxai
POSTGRES_DB=taxai
```

### 3. Install Dependencies
```bash
# Install all Node.js dependencies (monorepo)
npm install

# Install Python dependencies for AI agent
cd ai-agent
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cd ..
```

### 4. Start the Application
```bash
# Start all services concurrently
npm run dev
```

This starts:
- ðŸŽ¨ **Frontend** â†’ http://localhost:3000
- âš™ï¸ **Backend API** â†’ http://localhost:4000
- ðŸ¤– **AI Agent** â†’ http://localhost:8000

### 5. (Optional) Docker Setup
```bash
docker-compose up --build
```

---

## ðŸŒ Deployment

| Service | Platform |
|---|---|
| ðŸŽ¨ Frontend | [Vercel](https://vercel.com) â€” Set root dir to `frontend` |
| âš™ï¸ Backend | [Railway](https://railway.app) â€” Set root dir to `backend` |
| ðŸ—„ï¸ Database | [Railway](https://railway.app) â€” Deploy PostgreSQL plugin |
| ðŸ¤– AI Agent | [Railway](https://railway.app) â€” Set root dir to `ai-agent` |

---

## ðŸ§  AI Capabilities

**Trio** â€” the AI tax strategist â€” is trained on:

- ðŸ“œ **New Income Tax Act 2026** â€” Tax Year concept, revised slabs
- ðŸ’° **Capital Gains Rules 2026** â€” Updated STCG/LTCG with indexation changes
- ðŸª™ **Crypto / VDA Taxation** â€” 30% flat rate, loss set-off restrictions
- ðŸ¥ **Section 80C, 80D, 80E** â€” Full deduction eligibility logic
- ðŸ“‹ **GST Hard Compliance** â€” 3-Year bar, IRN window rules
- ðŸ”„ **Regime Comparison** â€” Real-time Old vs New regime calculator
- ðŸ  **HRA Exemption** â€” Full HRA calculation methodology

---

## ðŸ“¸ Screenshots

> Add your project screenshots in a `screenshots/` folder and update paths below.

| Dashboard | Trio AI Chatbot | Analytics |
|---|---|---|
| ![Dashboard](screenshots/dashboard.png) | ![Chatbot](screenshots/chatbot.png) | ![Analytics](screenshots/analytics.png) |

---

## ðŸ¤ Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ðŸ“„ License

Distributed under the MIT License. See `LICENSE` for more information.

---

## ðŸ‘¨â€ðŸ’» Author

**readyplayer000**

[![GitHub](https://img.shields.io/badge/GitHub-readyplayer000-181717?style=for-the-badge&logo=github)](https://github.com/readyplayer000)

---

<div align="center">

**â­ Star this repo if you found it useful!**

*Built with â¤ï¸ for smarter tax management*

</div>

