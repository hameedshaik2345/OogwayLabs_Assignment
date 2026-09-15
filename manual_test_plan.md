# Manual Test Plan for the UI

This test plan ensures the frontend and backend are interacting correctly under various scenarios.

## 1. Local LLM Routing (Ollama)
**Pre-condition:** `ollama pull llama3` has been executed. `uvicorn` and `npm run dev` are running.
- **Action:** Open `http://localhost:3000`. Type "how are you" into the chat and hit enter.
- **Expected:** A chat bubble appears from the user. A pulsing typing indicator appears. Within 5-15 seconds, a response bubble from the assistant appears answering the question.

## 2. Cloud LLM Routing (Anthropic)
**Pre-condition:** Set `LLM_PROVIDER=cloud` and `ANTHROPIC_API_KEY=your_key` in `backend/.env`. Restart the backend.
- **Action:** Open the UI. Ask "what is product growth?".
- **Expected:** The assistant responds using the Claude model (usually faster than local, with higher reasoning quality).

## 3. Artifact Generation (HTML/CSS)
- **Action:** In the chat, type: "Write a Ship 30 for 30 essay on why product managers should learn to code, include an HTML table."
- **Expected:** The assistant responds with the essay in the chat. Simultaneously, the Artifact Viewer pane on the right renders the HTML table securely.

## 4. RAG / Grounding Verification
- **Action:** Ask "What does Lenny say about growth loops?"
- **Expected:** The assistant provides an answer and explicitly includes a citation block at the end (e.g. `[Source: ep14_mock.md]`).

## 5. Error Handling & Fallback
**Pre-condition:** Stop the `uvicorn` backend server completely.
- **Action:** Type "hello" in the UI.
- **Expected:** The UI displays a red or fallback error bubble saying "Sorry, there was an error processing your request." The UI does not crash.
