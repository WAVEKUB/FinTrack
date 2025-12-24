# FinTrack Backend

The backend service for the FinTrack application, built with Go (Golang) and Gin Web Framework. It provides a RESTful API for managing personal finances, including users, wallets, transactions, budgets, and categories.

## Tech Stack

- **Language:** Go (1.25+)
- **Framework:** [Gin](https://gin-gonic.com/)
- **Database:** PostgreSQL
- **ORM:** [GORM](https://gorm.io/)
- **Authentication:** JWT (JSON Web Tokens) with Cookies

## Prerequisites

- [Go](https://go.dev/dl/) installed (version 1.25 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/download/) installed and running

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies

```bash
go mod download
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory. You can copy the variables below:

```env
PORT=3000
CLIENT_ORIGIN=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=fintrack
DB_PORT=5432

# Authentication
JWT_SECRET=your_super_secret_key_here
```

| Variable | Description |
|----------|-------------|
| `PORT` | The port the backend server will listen on. |
| `CLIENT_ORIGIN` | The URL of the frontend application (for CORS). |
| `DB_HOST` | Database host address. |
| `DB_USER` | Database username. |
| `DB_PASSWORD` | Database password. |
| `DB_NAME` | Name of the database. |
| `DB_PORT` | Database port (default 5432). |
| `JWT_SECRET` | Secret key used for signing JWT tokens. |

### 4. Database Setup

Ensure your PostgreSQL service is running and create the database specified in `DB_NAME`.

The application includes an auto-migration feature (in `initializers/syncDatabase.go`) which will automatically create the necessary tables when the application starts.

### 5. Running the Application

```bash
go run main.go
```

The server will start on port `3000` (or the port defined in your `.env`).

## API Endpoints

The API is served under `/api/v1`.

### Key Resources:
- **Auth**: `/api/v1/signup`, `/api/v1/login`, `/api/v1/logout`
- **Users**: `/api/v1/users`
- **Wallets**: `/api/v1/wallets`
- **Transactions**: `/api/v1/transactions`
- **Budgets**: `/api/v1/budgets`
- **Categories**: `/api/v1/categories`

## Project Structure

- `controllers`: Request handlers for endpoints.
- `initializers`: Database connection and environment loading.
- `middleware`: Authentication and other middleware.
- `models`: Database structs and GORM models.
- `routes`: API route definitions.
- `services`: Business logic (optional, if separated from controllers).
