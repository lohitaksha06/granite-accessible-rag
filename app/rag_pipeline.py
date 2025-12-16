from sentence_transformers import SentenceTransformer
import faiss
import os

DOCS_PATH = "data/docs"
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

    def retrieve(self, query: str, k: int = 2):
        query_embedding = self.embedder.encode([query])
        distances, indices = self.index.search(query_embedding, k)
        return [self.documents[i] for i in indices[0]]
