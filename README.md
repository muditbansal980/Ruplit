# Bank Sahayak (बैंक सहायक)

> Your trusted banking assistant — helping people in India access formal banking services through a language-first, accessible interface.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- pnpm or npm

### 1. Start the database
```bash
docker compose up -d
```

### 2. Setup the backend
```bash
cd backend
npm install
cp .env.example .env  # Edit with your credentials
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

### 3. Setup the frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔑 Default Login Credentials

### Admin
- **Email**: admin@banksahayak.com
- **Password**: admin123
- **URL**: http://localhost:3000/admin/login

### Team Members
- **Email**: team1@banksahayak.com
- **Password**: team123
- **URL**: http://localhost:3000/team/login

## 🌐 Supported Languages

- English (en-IN)
- Hindi (hi-IN)
- Tamil (ta-IN)
- Bengali (bn-IN)

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)
- **State Management**: Zustand (persisted to localStorage)
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui
- **i18n**: react-i18next with JSON translation files
- **Real-time**: Socket.io client for live KYC queue updates

### Backend (Express + TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT tokens (TEAM/ADMIN), mobile-based session (USER - demo only)
- **File Upload**: Multer → Cloudinary
- **Email**: Brevo HTTP API
- **Real-time**: Socket.io server for live updates

### Database Schema
- `User` — End customers (mobile-based auth)
- `TeamMember` — Bank staff / KYC agents (email + password)
- `Admin` — System administrators (email + password)
- `KycRequest` — KYC verification requests
- `Friendship` — User friendships
- `Expense` — Lending/borrowing records
- `Activity` — Audit trail

## 📱 Features

### User Dashboard (`/dashboard`)
- **Expense Record** — Track money lent to friends
- **KYC Verification** — Hire an assistant or do it yourself
- Loan, Contact Bank, Wallet — Coming soon (disabled)

### Team Dashboard (`/team`)
- Live Requests queue — Accept/reject assisted KYC requests
- My Accepted — Upload Aadhar and verify
- Review Queue — Review self-mode submissions

### Admin Dashboard (`/admin`)
- Activity Feed — All system events
- Team Stats — Per-agent performance
- All KYC Requests — Full visibility

## ⚠️ Known Limitations (Demo Only)

### 1. Mobile-Only Authentication (USER Role)
**This is intentionally relaxed for the hackathon.** User login uses mobile number only — no OTP verification. In production, this should be replaced with:
- SMS-based OTP verification
- Or integration with India's Aadhaar-based authentication

### 2. Email Service (Brevo)
Email notifications require a valid Brevo API key. Until configured, emails are logged to console but not sent.

### 3. File Storage (Cloudinary)
Aadhar photo uploads require Cloudinary credentials. Until configured, uploads will fail.

### 4. WebSocket for Live Updates
The live KYC queue uses Socket.io for real-time updates. This requires both backend and frontend to be running.

## 🔧 Environment Variables

See `backend/.env` for all required variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_SECRET` | Secret for JWT tokens | ✅ |
| `BREVO_API_KEY` | Brevo API key for emails | ✅ |
| `CLOUDINARY_*` | Cloudinary credentials | ✅ |
| `ADMIN_SEED_EMAIL` | Initial admin email | Optional |
| `ADMIN_SEED_PASSWORD` | Initial admin password | Optional |

## 📁 Project Structure

```
├── docker-compose.yml      # PostgreSQL
├── backend/
│   ├── src/
│   │   ├── config/         # Environment validation
│   │   ├── middleware/      # Auth, RBAC, error handling
│   │   ├── modules/        # Feature modules (auth, kyc, expenses, admin)
│   │   ├── services/       # Email, storage
│   │   └── db/             # Prisma client
│   └── prisma/
│       ├── schema.prisma   # Database schema
│       └── seed.ts         # Initial data
└── frontend/
    └── src/
        ├── api/            # Axios API layer
        ├── components/     # Reusable UI components
        ├── features/       # Feature-specific code
        ├── hooks/          # Custom React hooks
        ├── lib/            # Utilities (i18n, speech)
        ├── locales/        # Translation files
        ├── routes/         # Route guards
        └── store/          # Zustand stores
```

## 🛠️ Development

### Type Checking
```bash
cd backend && npx tsc --noEmit
cd frontend && npm run build
```

### Database Reset
```bash
cd backend
npx prisma migrate reset
npx tsx prisma/seed.ts
```

## 📝 License

Hackathon project — not for production use.
