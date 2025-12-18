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

    return f"""
You are an accessibility-focused AI assistant.
Use ONLY the information in the context below.
If the answer is not in the context, say "I don't know".

Additional Instructions:
{instructions}

Context:
{context}

Question:
{user_query}

Answer:
"""
