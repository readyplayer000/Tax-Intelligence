<div align="center">

# Reinventing Tax Intelligence

### AI-Powered Tax Management Platform for the Modern Era

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**Reinventing Tax Intelligence** is a full-stack, AI-powered taxation assistant that simplifies financial tracking, tax optimization, and compliance using cutting-edge AI -- built for Indian taxpayers navigating the 2025-26 tax year and beyond.

[Live Demo](#) - [Report Bug](https://github.com/readyplayer000/Reinventing-Tax-Intelligence/issues) - [Request Feature](https://github.com/readyplayer000/Reinventing-Tax-Intelligence/issues)

</div>

---

## Features

- **Trio AI Chatbot** -- Holographic tax strategist powered by Google Gemini, trained on the latest 2026 Indian Tax regulations
- **Smart Analytics Dashboard** -- Real-time income/expense charts with financial year selection
- **Transaction Ledger** -- Add, edit, delete, and exclude financial entries across all categories
- **GST Compliance Hub** -- Quick GST calculator, GSTIN verification, and upcoming return alerts
- **Financial Intelligence** -- AI-driven projections, tax efficiency score, and wealth health meter
- **Tax Reports** -- Auto-generated reports with regime comparison (New vs Old)
- **Secure Auth** -- JWT-based authentication system
- **Regime Advisor** -- Real-time comparison of Old vs New tax regime savings
- **2026-Ready** -- Built with the new Income Tax Act rules, Crypto/VDA taxation, and GST Hard Compliance

---

## Tech Stack

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

## Project Structure

```
Reinventing-Tax-Intelligence/
├── frontend/               # React + Vite Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx     # Main dashboard with analytics
│   │   │   ├── DataEntry.tsx     # Transaction management
│   │   │   ├── Analytics.tsx     # Financial intelligence
│   │   │   ├── ChatBot.tsx       # Trio AI chatbot
│   │   │   ├── GST.tsx           # GST compliance hub
│   │   │   ├── Reports.tsx       # Tax reports
│   │   │   └── Login.tsx         # Authentication
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
│
├── backend/                # Node.js + Express API
│   └── src/
│       ├── routes/
│       │   ├── entries.ts        # Financial entries CRUD
│       │   ├── auth.ts           # Authentication
│       │   └── chat.ts           # Chat proxy
│       └── index.ts
│
├── ai-agent/               # Python FastAPI AI Microservice
│   └── app/
│       ├── agent.py              # LangChain AI agent
│       ├── main.py               # FastAPI endpoints
│       └── prompts/
│           └── system_prompt.txt # Trio AI personality & rules
│
├── shared/                 # Shared TypeScript types & schemas
│   └── src/
│       ├── validators/
│       │   └── entrySchema.ts
│       └── index.ts
│
├── docker-compose.yml      # Full stack Docker setup
├── package.json            # Monorepo workspace config
└── .env.example            # Environment variables template
```

---

## Getting Started

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
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
cd ..
```

### 4. Start the Application
```bash
npm run dev
```

This starts:
- Frontend  --> http://localhost:3000
- Backend API --> http://localhost:4000
- AI Agent  --> http://localhost:8000

### 5. (Optional) Docker Setup
```bash
docker-compose up --build
```

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) -- Set root dir to `frontend` |
| Backend | [Railway](https://railway.app) -- Set root dir to `backend` |
| Database | [Railway](https://railway.app) -- Deploy PostgreSQL plugin |
| AI Agent | [Railway](https://railway.app) -- Set root dir to `ai-agent` |

---

## AI Capabilities

**Trio** -- the AI tax strategist -- is trained on:

- **New Income Tax Act 2026** -- Tax Year concept, revised slabs
- **Capital Gains Rules 2026** -- Updated STCG/LTCG with indexation changes
- **Crypto / VDA Taxation** -- 30% flat rate, loss set-off restrictions
- **Section 80C, 80D, 80E** -- Full deduction eligibility logic
- **GST Hard Compliance** -- 3-Year bar, IRN window rules
- **Regime Comparison** -- Real-time Old vs New regime calculator
- **HRA Exemption** -- Full HRA calculation methodology

---

## Screenshots

> Add your project screenshots in a `screenshots/` folder and update paths below.

| Dashboard | Trio AI Chatbot | Analytics |
|---|---|---|
| ![Dashboard](screenshots/dashboard.png) | ![Chatbot](screenshots/chatbot.png) | ![Analytics](screenshots/analytics.png) |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Author

**readyplayer000**

[![GitHub](https://img.shields.io/badge/GitHub-readyplayer000-181717?style=for-the-badge&logo=github)](https://github.com/readyplayer000)

---

<div align="center">

**Star this repo if you found it useful!**

*Built with passion for smarter tax management*

</div>