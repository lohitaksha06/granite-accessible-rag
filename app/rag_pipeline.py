from sentence_transformers import SentenceTransformer
import faiss
import os
import pickle

DOCS_PATH = "data/docs"
VECTORSTORE_PATH = "data/vectorstore"
INDEX_FILE = os.path.join(VECTORSTORE_PATH, "index.faiss")
DOCS_FILE = os.path.join(VECTORSTORE_PATH, "docs.pkl")

EMBEDDING_MODEL = "all-MiniLM-L6-v2"


class RAGPipeline:
    def __init__(self):
        self.embedder = SentenceTransformer(EMBEDDING_MODEL)
        self.documents = []
        self.index = None

    def load_documents(self):
        for filename in os.listdir(DOCS_PATH):
            if filename.endswith(".txt"):
                with open(os.path.join(DOCS_PATH, filename), "r", encoding="utf-8") as f:
                    self.documents.append(f.read())

    def build_index(self):
        embeddings = self.embedder.encode(self.documents)
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)

    def save_index(self):
        os.makedirs(VECTORSTORE_PATH, exist_ok=True)
        faiss.write_index(self.index, INDEX_FILE)
        with open(DOCS_FILE, "wb") as f:
            pickle.dump(self.documents, f)

    def load_index(self):
        if os.path.exists(INDEX_FILE) and os.path.exists(DOCS_FILE):
            self.index = faiss.read_index(INDEX_FILE)
            with open(DOCS_FILE, "rb") as f:
                self.documents = pickle.load(f)
            return True
        return False

    def initialize(self):
        if not self.load_index():
            self.load_documents()
            self.build_index()
            self.save_index()

    def retrieve(self, query: str, k: int = 2):
        query_embedding = self.embedder.encode([query])
        distances, indices = self.index.search(query_embedding, k)
        return [self.documents[i] for i in indices[0]]


def build_rag_prompt(context_docs, user_query, disability=None, language=None):
    context = "\n\n".join(context_docs)

    instructions = ""
    if disability:
        instructions += disability + "\n"
    if language:
        instructions += language + "\n"

    formatting = (
        "Format your response for accessibility and clarity:\n"
        "- Start with a short title\n"
        "- Then give 3–6 numbered steps (Step 1, Step 2, …)\n"
        "- Keep sentences short; avoid dense paragraphs\n"
    )

    grounding = (
        "Grounding rules:\n"
        "- Use ONLY the context below\n"
        "- Do not add outside facts or assumptions\n"
        "- If the context does not contain the answer, reply exactly: I don't know\n"
    )

    intent = infer_intent_instruction(user_query)
    if intent:
        instructions += intent + "\n"

    return f"""
You are an accessibility-focused AI assistant.
{grounding}

Additional Instructions:
{instructions}

{formatting}

Context:
{context}

Question:
{user_query}

Answer:
"""


def infer_intent_instruction(user_query: str) -> str:
    q = user_query.lower()

    ordering_keywords = ["order", "buy", "purchase", "pay", "payment", "checkout"]
    navigation_keywords = ["where", "direction", "directions", "go", "navigate", "way", "how do i get"]
    explanation_keywords = ["what is", "define", "meaning", "explain"]

    if any(k in q for k in ordering_keywords):
        return "The user intent is ordering or purchasing. Provide step-by-step guidance."
    if any(k in q for k in navigation_keywords):
        return "The user intent is navigation. Provide clear step-by-step directions without visual-only references."
    if any(k in q for k in explanation_keywords):
        return "The user intent is an explanation. Provide a simple definition first, then short steps or examples."
    return ""
