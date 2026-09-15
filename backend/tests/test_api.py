from fastapi.testclient import TestClient
from main import app, get_db
import models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest

# Setup an in-memory SQLite DB for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

models.Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Lenny Growth Assistant API is running"}

def test_chat_persistence_and_routing():
    # 1. Test creating a new session
    response = client.post("/api/chat", json={
        "message": "Hello, this is a test.",
        "llm_provider": "local" # Assuming local handles it, or fails gracefully but still saves DB
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "content" in data
    assert data["role"] == "assistant"
    
    # 2. Verify Session Persistence
    # Wait, the response is just the assistant message. We need the session_id to query it.
    # We should retrieve the session from the DB directly to test persistence.
    db = TestingSessionLocal()
    session = db.query(models.Session).first()
    assert session is not None
    
    messages = db.query(models.Message).filter(models.Message.session_id == session.id).all()
    assert len(messages) == 2 # 1 user msg, 1 assistant msg
    assert messages[0].role == "user"
    assert messages[0].content == "Hello, this is a test."
    assert messages[1].role == "assistant"
    
    db.close()

def test_chat_session_retrieval_endpoint():
    # Create a dummy session
    db = TestingSessionLocal()
    session = models.Session()
    db.add(session)
    db.commit()
    db.refresh(session)
    session_id = session.id
    db.close()
    
    # Test GET endpoint
    response = client.get(f"/api/sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == session_id
    assert "messages" in data
