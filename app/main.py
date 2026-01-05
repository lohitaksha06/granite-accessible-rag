from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.rag_pipeline import RAGPipeline, build_rag_prompt
from app.granite_model import generate_response
from app.profiles import DISABILITY_PROFILES, LANGUAGE_PROFILES


app = FastAPI(title="Granite Accessible RAG")

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


class AskResponse(BaseModel):
    answer: str


rag = RAGPipeline()
rag.initialize()


@app.post("/ask", response_model=AskResponse)
def ask(request: AskRequest):
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
    )

    answer = generate_response(prompt)
    return {"answer": answer}
