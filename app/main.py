import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.rag_pipeline import RAGPipeline, build_rag_prompt
from app.granite_model import generate_response
from app.profiles import DISABILITY_PROFILES, LANGUAGE_PROFILES


app = FastAPI(title="Granite Accessible RAG")


# Greeting patterns in multiple languages
GREETING_PATTERNS = [
    r'\b(hi|hey|hello|howdy|hiya)\b',
    r'\bgood\s*(morning|afternoon|evening|day)\b',
    r'\bhola\b', r'\bbonjour\b', r'\bhallo\b', r'\bciao\b', r'\bolá\b',
    r'\bпривет\b', r'\bこんにちは\b', r'\b你好\b', r'\b안녕\b',
    r'\bمرحبا\b', r'\bنمस्ते\b', r'\bxin\s*chào\b', r'\bสวัสดี\b',
]

GOODBYE_PATTERNS = [
    r'\b(bye|goodbye|farewell)\b', r'\bsee\s*you\b', r'\btake\s*care\b',
    r'\badiós\b', r'\bau\s*revoir\b', r'\bauf\s*wiedersehen\b',
    r'\bさようなら\b', r'\b再见\b', r'\bдо свидания\b',
]

THANK_PATTERNS = [
    r'\b(thanks?|thank\s*you)\b', r'\bgracias\b', r'\bmerci\b',
    r'\bdanke\b', r'\bgrazie\b', r'\bobrigad[oa]\b',
    r'\bありがとう\b', r'\b谢谢\b', r'\bспасибо\b', r'\b감사\b',
]


def detect_conversational_intent(text: str) -> tuple[str | None, str | None]:
    """Detect if the query is a greeting/goodbye/thanks and return (intent, response)."""
    lower = text.lower().strip()
    
    # Check if query is ONLY a greeting (don't trigger for "hi, how do I navigate airport?")
    if len(lower) < 50:  # Short messages likely to be greetings
        for pattern in GREETING_PATTERNS:
            if re.search(pattern, lower, re.IGNORECASE):
                return ('hello', 'Hello! 👋 Welcome! I\'m your accessible assistant. How can I help you today? You can ask me about airport navigation, accessibility services, and more!')
        
        for pattern in GOODBYE_PATTERNS:
            if re.search(pattern, lower, re.IGNORECASE):
                return ('goodbye', 'Goodbye! 👋 Take care and have a wonderful day. Feel free to come back anytime you need assistance!')
        
        for pattern in THANK_PATTERNS:
            if re.search(pattern, lower, re.IGNORECASE):
                return ('thanks', 'You\'re very welcome! 😊 I\'m happy to help. Let me know if you need anything else!')
    
    return (None, None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    query: str
    disability: str = "blind"
    language: str = "english"
    visual_context: str = "None"


class AskResponse(BaseModel):
    answer: str
    gesture: str = "idle"  # Hint for frontend avatar animation


rag = RAGPipeline()
rag.initialize()


@app.post("/ask", response_model=AskResponse)
def ask(request: AskRequest):
    # Check for conversational intents first (greetings, goodbyes, thanks)
    intent, friendly_response = detect_conversational_intent(request.query)
    if intent and friendly_response:
        return {"answer": friendly_response, "gesture": intent}
    
    # Normal RAG flow for actual questions
    context_docs = rag.retrieve(request.query)

    disability_key = request.disability
    if disability_key == "none":
        disability_key = ""

    disability_instruction = DISABILITY_PROFILES.get(
        disability_key, {}
    ).get("instruction", "")

    language_instruction = LANGUAGE_PROFILES.get(
        request.language, ""
    )

    prompt = build_rag_prompt(
        context_docs,
        request.query,
        disability=disability_instruction,
        language=language_instruction,
        visual_context=request.visual_context
    )

    answer = generate_response(prompt)
    return {"answer": answer, "gesture": "thumbsup"}
