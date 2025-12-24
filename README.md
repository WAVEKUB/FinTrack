# FinTrack

FinTrack is a personal finance management application that helps you track your expenses, budgets, and savings.

## Tech Stack

*   **Frontend**: Next.js (React), TypeScript
*   **Backend**: Go (Golang), Gin Framework
*   **Database**: PostgreSQL
*   **Tools**: Docker, Docker Compose

## Project Structure

*   `backend/`: Contains the Go REST API.
*   `frontend/`: Contains the Next.js web application.

## Prerequisites

*   [Docker](https://www.docker.com/)
*   [Go](https://go.dev/) (1.25+)
*   [Node.js](https://nodejs.org/) (LTS)

## Getting Started

### 1. Start the Database

We use Docker Compose to spin up the PostgreSQL database and pgAdmin.

```bash
docker-compose up -d
```

This will start:
*   **PostgreSQL**: Port `5432`
*   **pgAdmin**: Port `5050` (Web interface for PostgreSQL)

### 2. Backend Setup

Navigate to the `backend` directory and follow the instructions in [backend/README.md](./backend/README.md).

Quick start:
```bash
cd backend
# Create .env file (see backend/README.md for reference)
go mod download
go run main.go
```
*Note: Ensure your `.env` connects to the Postgres instance running via Docker.*

### 3. Frontend Setup

Navigate to the `frontend` directory and follow the instructions in [frontend/README.md](./frontend/README.md).

Quick start:
```bash
cd frontend
npm install
npm run dev
```

The frontend typically runs on [http://localhost:3000](http://localhost:3000).

> [!NOTE]
> **Port Conflict Warning**: Both Next.js and the Backend (as configured by default) may attempt to use port 3000.
> *   **Frontend**: Default is 3000.
> *   **Backend**: Default `.env` example uses 8080.
>
> **Recommendation**: Change the backend `PORT` in `backend/.env` to `8080` or another free port, and update the existing `CLIENT_ORIGIN` if necessary.

## License

[Add License Information]
