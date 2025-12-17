from fastapi import FastAPI
from pydantic import BaseModel

from app.rag_pipeline import RAGPipeline, build_rag_prompt
from app.granite_model import generate_response
from app.profiles import DISABILITY_PROFILES, LANGUAGE_PROFILES


app = FastAPI(title="Granite Accessible RAG")


class AskRequest(BaseModel):
    query: str
    disability: str = "blind"
    language: str = "english"


class AskResponse(BaseModel):
    answer: str


rag = RAGPipeline()
rag.load_documents()
rag.build_index()


@app.post("/ask", response_model=AskResponse)
def ask(request: AskRequest):
    context_docs = rag.retrieve(request.query)

    disability_instruction = DISABILITY_PROFILES.get(
        request.disability, {}
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
