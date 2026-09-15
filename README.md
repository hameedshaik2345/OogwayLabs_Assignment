# The Lenny Growth Assistant

A full-stack, AI-powered conversational web application that ingests transcripts from Lenny’s Podcast, answers product and growth questions, and securely generates artifacts (HTML/Markdown).

## Features
- **Local & Cloud LLMs:** Switch seamlessly between Anthropic Claude and local Ollama.
- **RAG via Transcripts:** Grounded answers referencing Lenny's Podcast transcripts.
- **Artifact Viewer:** Securely renders HTML and Markdown snippets dynamically.
- **Session Persistence:** Chat history saved in PostgreSQL (or SQLite for fast local demo).

## Architecture
- **Backend:** FastAPI, SQLAlchemy, LangChain/Anthropic SDK.
- **Frontend:** Next.js (React), DOMPurify for secure artifact rendering.
- **Database:** PostgreSQL via Docker (or SQLite default).

## Prerequisites
- Docker & Docker Compose (optional for DB, but recommended for full stack).
- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.ai/) installed locally (if testing Local LLM).

## Quick Start (Without Docker)

### 1. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (or .\venv\Scripts\Activate.ps1 on Windows)
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```
*(By default, this will use SQLite and `llama3` via Ollama)*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the assistant.

## Quick Start (With Docker Compose)
```bash
docker-compose up --build
```
This will start Postgres on port 5432, FastAPI on port 8000, and Next.js on port 3000.

## Configuration
Edit the `.env` file in the `backend/` directory:
- `LLM_PROVIDER=local` (or `cloud`)
- `ANTHROPIC_API_KEY=your_key` (if using cloud)
- `DATABASE_URL=postgresql://user:password@localhost:5432/lenny_assistant` (if using postgres)

## Troubleshooting
- **Ollama Error:** Ensure Ollama is running and you have downloaded the model (`ollama run llama3`).
- **Database Error:** If using Docker, make sure port 5432 isn't occupied.

## Evaluator Handoff
This project is configured out-of-the-box to run using local SQLite and Ollama `llama3` so you don't need any API keys or Docker installations to test the basic functionality. You can switch to Cloud LLMs or PostgreSQL by updating `.env`.
