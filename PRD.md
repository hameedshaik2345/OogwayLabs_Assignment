# The Lenny Growth Assistant - PRD

## 1. User and Problem
**Primary User:** Product and Growth Managers.
**Job to be Done:** Extract actionable growth insights, frameworks, and writing principles (e.g., Ship 30 for 30) from Lenny's Podcast transcripts.
**Pain Points:** Reading hours of transcripts is inefficient. Querying raw LLMs without grounding leads to hallucinations. Navigating multiple tabs for generated markdown or HTML content breaks flow.

## 2. Success Metric
**Product Metric:** Percentage of answers successfully citing a specific podcast episode or transcript snippet.
**Operational Metric:** Latency of generating "Ship 30 for 30" essays (< 15 seconds).

## 3. Assumptions
- We assume users will primarily ask single-turn questions, though session persistence allows follow-ups.
- We assume local Ollama models (like `llama3`) have enough context window for our chunked retrieval.
- We assume SQLite is acceptable for local demonstration, with a seamless switch to PostgreSQL via the `DATABASE_URL` environment variable for production.

## 4. Scope Choices
**Included:**
- RAG ingestion logic using local mock transcripts (as actual dataset wasn't fully provided).
- Support for Cloud (Anthropic) and Local (Ollama) routing.
- In-app Artifact Viewer utilizing a sandboxed iframe with DOMPurify for secure HTML/CSS rendering.
- PostgreSQL compatibility via SQLAlchemy, but using SQLite as the out-of-the-box local default to prevent Docker dependencies blocking evaluator testing.

**Excluded:**
- Vector Database (We are simulating RAG using simple text matching/context passing to keep the demo lightweight and runnable without a complex Vector DB setup).
- Real-time Audio transcription (we only operate on provided text transcripts).

## 5. Risks and Trade-offs
- **Hallucination Risk:** High if the LLM isn't strictly prompted. Mitigated by prompt engineering and grounding context.
- **Artifact Security:** Rendering arbitrary HTML from an LLM is dangerous. Trade-off made: using an `iframe` with `sandbox="allow-same-origin"` and sanitizing via DOMPurify before injection.
- **Local Model Quality:** Local models like `llama3` may struggle with complex artifact generation compared to Claude 3.5 Sonnet. User toggle allows fallback to cloud.
