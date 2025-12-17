import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.rag_pipeline import RAGPipeline, build_rag_prompt
from app.granite_model import generate_response


def ask_question(query: str):
    rag = RAGPipeline()
    rag.load_documents()
    rag.build_index()

    context_docs = rag.retrieve(query)
    prompt = build_rag_prompt(context_docs, query)

    return generate_response(prompt)


if __name__ == "__main__":
    answer = ask_question("How can blind users navigate systems?")
    print(answer)
