# NovaMart AI CRM MVP

NovaMart AI CRM is a Dockerized university project prototype for an AI-enabled retail customer relationship management system. It demonstrates centralised customer data, profiles, segmentation, campaigns, support case management, dashboards, and backend-only AI assistance.

## Features

- CRM dashboard with KPIs, sales trends, segment breakdowns, campaign performance, support case status, and an inline AI-style insight summary.
- Customer list with search and filters for segment and churn risk.
- Customer profiles with contact data, source origin, purchase history, interactions, support cases, customer value summary, and saved AI recommendation audit trail.
- Customer segmentation view for high-value, frequent buyer, at-risk, new, and dormant customers.
- Campaign management with analytics and AI-powered campaign recommendations.
- Support case management with create, status update, automated routing, and AI-powered draft responses.
- Floating power-user guide helper for platform questions, powered by backend-only AI calls with fallback guidance.
- Privacy/data-handling awareness page covering data minimisation, backend-only AI calls, key handling, audit trail, mock data, and human review.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn-style components, React Router, Recharts, Lucide React.
- Backend: Node.js, Express, TypeScript.
- Database: SQLite with `better-sqlite3`.
- AI: configurable provider API via backend service files only.
- DevOps: Docker and Docker Compose, single-container architecture.

## Architecture

The application runs in one Docker container.

- Frontend runs on port `80`.
- Backend runs internally on port `8080`.
- Only port `80` is exposed to the host.
- The browser opens `http://localhost`.
- React code calls backend routes using relative `/api` paths only.
- Vite proxies `/api` requests to `http://localhost:8080` inside the container.
- SQLite is stored at `/app/data/novamart-crm.sqlite`.
- SQLite data persists through the Docker volume `novamart_sqlite_data`.
- The AI provider is called only from backend services and the API key is never sent to frontend code.

## Environment Setup

Create `server/.env` from `server/.env.example` if you want to use file-based configuration:

```bash
cp server/.env.example server/.env
```

Example:

```env
AI_API_KEY=your_ai_api_key_here
AI_BASE_URL=https://api.example.com/v1
AI_MODEL=chat-assistant
BACKEND_PORT=8080
DATABASE_PATH=/app/data/novamart-crm.sqlite
```

## AI Provider API Key

The configurable AI provider is used for:

- Customer next-best-action recommendations.
- Campaign recommendations.
- Support ticket response drafts and routing suggestions.
- Power-user platform guide answers.

`AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL` can be provided either as OS environment variables or in `server/.env`. OS environment variables take priority; `server/.env` is used as the fallback. If the key or base URL is missing, or if the key is left as the placeholder value, the backend returns safe fallback demo responses and marks them with `is_fallback: true`. Successful AI provider responses are marked with `is_fallback: false`. All AI responses are saved in SQLite as an audit trail.

AI ticket responses are draft suggestions only. They are not automatically sent to customers and do not automatically close support cases.

The floating guide helper answers questions about how to use this CRM prototype. It is scoped to platform guidance and does not replace the CRM pages or automate work.

## Docker Instructions

Run:

```bash
docker compose up --build
```

To use an OS environment variable instead of storing the key in `server/.env`:

```bash
export AI_API_KEY=your_ai_api_key_here
docker compose up --build
```

or

```bash
AI_API_KEY="your_ai_api_key_here" docker compose up --build
```

Open:

```text
http://localhost
```

The compose file maps host port `80` to container port `80`. It does not expose backend port `8080` to the host.

`BACKEND_PORT` controls the internal Express backend port. This avoids colliding with Cloud Run's reserved `PORT` variable, which should be used for the public container port.

## Local Development

Install dependencies:

```bash
npm install
npm run install:all
```

Use a local database path when running outside Docker:

```bash
cd server
DATABASE_PATH=./data/novamart-crm.sqlite npm run db:seed
cd ..
npm run dev
```

The frontend still runs on port `80`, so local development may require elevated privileges on some systems. Docker is the recommended demo path.

## Database Reset and Reseed

Inside local development:

```bash
DATABASE_PATH=./server/data/novamart-crm.sqlite npm run db:seed --prefix server
```

Inside Docker, remove the persisted volume and rebuild:

```bash
docker compose down -v
docker compose up --build
```

## Prototype Limitations

- Mock customer data only.
- No real authentication or role-based access control.
- No autonomous ticket resolution.
- No automatic customer message sending.
- No production privacy controls such as consent, retention policies, or access auditing.
- Vite dev server is used intentionally for the single-container university demo and internal `/api` proxy behavior.

## Google Cloud Run

Cloud Run injects a reserved `PORT` variable for the public container listener. This project keeps the frontend on Cloud Run's public port and uses `BACKEND_PORT=8080` for the internal Express API.

Example deploy command:

```bash
gcloud run deploy novamart-crm \
  --source . \
  --region australia-southeast1 \
  --allow-unauthenticated \
  --port 80 \
  --set-env-vars BACKEND_PORT=8080,AI_BASE_URL=https://api.example.com/v1,AI_MODEL=chat-assistant,DATABASE_PATH=/app/data/novamart-crm.sqlite,NODE_ENV=development \
  --set-secrets AI_API_KEY=ai-api-key:latest
```
