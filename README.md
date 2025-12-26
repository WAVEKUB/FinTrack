# 💰 FinTrack

<div align="center">

![FinTrack Logo](https://img.shields.io/badge/FinTrack-Personal%20Finance-4F46E5?style=for-the-badge&logo=chart-line&logoColor=white)

**A modern, full-stack personal finance management application**

[![Go](https://img.shields.io/badge/Go-1.25+-00ADD8?style=flat-square&logo=go&logoColor=white)](https://go.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📋 Overview

FinTrack is a comprehensive personal finance management application designed to help you take control of your financial life. Track expenses, manage multiple wallets, set budgets, and achieve your savings goals — all in one beautiful, intuitive interface.

## ✨ Features

### 💳 Wallet Management
- Create and manage multiple wallets (Cash, Bank, Credit Card)
- Real-time balance tracking
- Transfer funds between wallets

### 📊 Transaction Tracking
- Log income and expense transactions
- Categorize transactions with custom categories
- Filter and search transaction history
- Visual transaction insights

### 📈 Budgets & Goals
- Set spending budgets by category
- Create savings goals with deadlines
- Track progress towards financial targets
- Flexible budget periods (weekly, monthly, one-time)

### 🏷️ Categories
- Pre-defined expense and income categories
- Create custom categories with icons and colors
- Category-based spending analysis

### 📉 Analytics Dashboard
- Income vs. expense charts
- Spending breakdown by category
- Interactive data visualizations with Recharts

### ⚙️ Settings
- User profile management
- Dark/Light mode toggle
- Notification preferences
- Data export and management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, TailwindCSS 4 |
| **Backend** | Go 1.25, Gin Framework, GORM |
| **Database** | PostgreSQL 15 |
| **State Management** | TanStack Query (React Query) |
| **Charts** | Recharts |
| **Auth** | JWT (JSON Web Tokens) |
| **DevOps** | Docker, Docker Compose |

---

## 📁 Project Structure

```
FinTrack/
├── backend/                 # Go REST API
│   ├── controllers/         # Request handlers
│   ├── dto/                 # Data Transfer Objects
│   ├── initializers/        # DB connection & seeding
│   ├── middleware/          # Auth middleware
│   ├── models/              # GORM models
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   └── main.go              # Entry point
│
├── frontend/                # Next.js application
│   └── src/
│       ├── app/             # App router pages
│       │   ├── auth/        # Login & Register
│       │   ├── budgets/     # Budgets & Goals
│       │   ├── settings/    # User settings
│       │   └── transactions/# Transaction management
│       ├── components/      # Reusable UI components
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utilities
│       └── services/        # API service layer
│
├── docker-compose.yml       # Docker orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Go](https://go.dev/) 1.25+
- [Node.js](https://nodejs.org/) 20+ (LTS)
- [pnpm](https://pnpm.io/) or npm

### 1. Clone the Repository

```bash
git clone https://github.com/WAVEKUB/FinTrack.git
cd FinTrack
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=fintrack

# pgAdmin
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin
```

Create `backend/.env`:

```env
PORT=8080
DB_URL=host=localhost user=postgres password=your_secure_password dbname=fintrack port=5432 sslmode=disable
JWT_SECRET=your_super_secret_jwt_key
CLIENT_ORIGIN=http://localhost:3000
```

Create `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 3. Start the Database

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `localhost:5050` (Web UI for database management)

### 4. Run the Backend

```bash
cd backend
go mod download
go run main.go
```

The API will be available at `http://localhost:8080`

### 5. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login and receive JWT |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/users/me` | Get current user profile |

### Wallets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/wallets` | List all wallets |
| `POST` | `/api/v1/wallets` | Create a wallet |
| `PUT` | `/api/v1/wallets/:id` | Update a wallet |
| `DELETE` | `/api/v1/wallets/:id` | Delete a wallet |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/transactions` | List all transactions |
| `POST` | `/api/v1/transactions` | Create a transaction |
| `PUT` | `/api/v1/transactions/:id` | Update a transaction |
| `DELETE` | `/api/v1/transactions/:id` | Delete a transaction |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/categories` | List all categories |
| `POST` | `/api/v1/categories` | Create a category |
| `PUT` | `/api/v1/categories/:id` | Update a category |
| `DELETE` | `/api/v1/categories/:id` | Delete a category |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/budgets` | List all budgets |
| `POST` | `/api/v1/budgets` | Create a budget |
| `PUT` | `/api/v1/budgets/:id` | Update a budget |
| `DELETE` | `/api/v1/budgets/:id` | Delete a budget |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/goals` | List all goals |
| `POST` | `/api/v1/goals` | Create a goal |
| `PUT` | `/api/v1/goals/:id` | Update a goal |
| `DELETE` | `/api/v1/goals/:id` | Delete a goal |

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
go test ./... -v
```

---

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset database (caution: deletes all data)
docker-compose down -v
rm -rf pgdata
docker-compose up -d
```

---

<div align="center">

Made with️ by [WAVEKUB](https://github.com/WAVEKUB)

</div>
