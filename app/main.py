from fastapi import FastAPI

app = FastAPI(title="Granite Accessible RAG")


@app.get("/health")
def health_check() -> dict[str, str]:
    """Simple readiness probe to confirm the API is running."""
    return {"status": "ok"}
