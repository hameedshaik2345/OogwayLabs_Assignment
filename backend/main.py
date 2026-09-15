from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session as DBSession
from typing import List
import logging
import models, schemas, database, agent
from database import engine, get_db

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="The Lenny Growth Assistant API")

# Allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Lenny Growth Assistant API is running"}

@app.post("/api/chat", response_model=schemas.MessageResponse)
def chat(request: schemas.ChatRequest, db: DBSession = Depends(get_db)):
    # Retrieve or create session
    if request.session_id:
        session = db.query(models.Session).filter(models.Session.id == request.session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = models.Session()
        db.add(session)
        db.commit()
        db.refresh(session)
        
    # Save user message
    user_message = models.Message(session_id=session.id, role="user", content=request.message)
    db.add(user_message)
    db.commit()
    
    # Retrieve chat history for the agent
    history = db.query(models.Message).filter(models.Message.session_id == session.id).order_by(models.Message.created_at).all()
    messages_for_llm = [{"role": msg.role, "content": msg.content} for msg in history]
    
    # Get response from Agent
    ai_response_content = agent.get_llm_response(messages_for_llm, request.llm_provider)
    
    # Save assistant message
    assistant_message = models.Message(session_id=session.id, role="assistant", content=ai_response_content)
    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)
    
    return assistant_message

@app.get("/api/sessions/{session_id}", response_model=schemas.SessionResponse)
def get_session(session_id: str, db: DBSession = Depends(get_db)):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
