from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Lenny Growth Assistant API is running"}

def test_chat_endpoint_no_session():
    # Simple test for chat endpoint handling without hitting LLMs
    # We will mock the agent.get_llm_response in a real test, 
    # but here we test the framework.
    response = client.post("/api/chat", json={
        "message": "Hello",
        "llm_provider": "local"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["role"] == "assistant"
    # Ensure a session ID is returned in some form, though our schema doesn't return it directly on the message.
    # Wait, our MessageResponse doesn't include session_id. Let's fix that.
    
