from sentence_transformers import SentenceTransformer
import faiss
import os
import pickle
import json

DOCS_PATH = "data/docs"
VECTORSTORE_PATH = "data/vectorstore"
INDEX_FILE = os.path.join(VECTORSTORE_PATH, "index.faiss")
DOCS_FILE = os.path.join(VECTORSTORE_PATH, "docs.pkl")
META_FILE = os.path.join(VECTORSTORE_PATH, "meta.json")

EMBEDDING_MODEL = "all-MiniLM-L6-v2"


class RAGPipeline:
    def __init__(self):
        self.embedder = SentenceTransformer(EMBEDDING_MODEL)
        self.documents = []
        self.index = None

    def load_documents(self):
        for filename in sorted(os.listdir(DOCS_PATH)):
            if filename.endswith(".txt"):
                with open(os.path.join(DOCS_PATH, filename), "r", encoding="utf-8") as f:
                    self.documents.append(f.read())

    def _docs_fingerprint(self) -> dict:
        files = []
        for filename in sorted(os.listdir(DOCS_PATH)):
            if not filename.endswith(".txt"):
                continue
            path = os.path.join(DOCS_PATH, filename)
            try:
                mtime = os.path.getmtime(path)
            except OSError:
                mtime = None
            files.append({"name": filename, "mtime": mtime})
        return {"docs_path": DOCS_PATH, "files": files}

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
        if os.path.exists(INDEX_FILE) and os.path.exists(DOCS_FILE) and os.path.exists(META_FILE):
            self.index = faiss.read_index(INDEX_FILE)
            with open(DOCS_FILE, "rb") as f:
                self.documents = pickle.load(f)

            try:
                meta = json.loads(open(META_FILE, "r", encoding="utf-8").read())
            except OSError:
                return False
            except json.JSONDecodeError:
                return False

            return meta == self._docs_fingerprint()
        return False

    def initialize(self):
        if not self.load_index():
            self.load_documents()
            self.build_index()
            self.save_index()
            os.makedirs(VECTORSTORE_PATH, exist_ok=True)
            with open(META_FILE, "w", encoding="utf-8") as f:
                json.dump(self._docs_fingerprint(), f, ensure_ascii=False, indent=2)

    def retrieve(self, query: str, k: int = 2):
        query_embedding = self.embedder.encode([query])
        distances, indices = self.index.search(query_embedding, k)
        return [self.documents[i] for i in indices[0]]


def build_rag_prompt(context_docs, user_query, disability=None, language=None, visual_context="None"):
    context = "\n\n".join(context_docs)

    disability_profile = disability if disability else "Unknown/None"
    language_pref = language if language else "Unknown/None"

    formatting = (
        "Format your response for accessibility and clarity:\n"
        "- Start with a short title\n"
        "- Then give 3–6 numbered steps (Step 1, Step 2, …)\n"
        "- Keep sentences short; avoid dense paragraphs\n"
    )

    intent = infer_intent_instruction(user_query)
    intent_instructions = f"Intent Guidance: {intent}\n" if intent else ""

    return f"""
You are an advanced, empathetic AI accessibility assistant powered by IBM Granite. 
You act as a digital representative situated in a public or digital spatial environment (such as a kiosk, bank, hospital, or metaverse space).

Your purpose is to communicate inclusively with users based on their specific disability profile and language preference, using context strictly retrieved from your accessibility knowledge base (RAG).

<INPUT_CONTEXT>
The user communicates with you via physical actions translated into text (e.g., [Gesture: Hand Wave], [Sign Language Input]), real-time webcam analysis, or via standard text/voice typing.

You will be provided with:
1. USER_PROFILE: {disability_profile}
2. LANGUAGE_PREF: {language_pref}
3. RETRIEVED_DOCS: {context}
4. USER_INPUT: {user_query}
5. VISUAL_CONTEXT: {visual_context}

<INSTRUCTIONS>
1. GROUNDING: You must ONLY use the provided RETRIEVED_DOCS to answer the user's domain-specific questions. Do not hallucinate outside information.
2. GESTURE & VISUAL RECOGNITION: If the user provides visual context via webcam or explicit gestures (e.g., "[Gesture: Hand Wave]", or VISUAL_CONTEXT indicates confusion), use it to react more empathetically and dynamically. For example, kindly acknowledge gestures in their preferred language.
3. MULTIMODAL FLEXIBILITY: Always allow and respect the user's choice to type manually instead of using the webcam. If the webcam is off, fall back seamlessly to processing standard text/voice inputs without demanding visual context.
4. ACCESSIBLE OUTPUT FORMATTING: Adapt your response to the USER_PROFILE:
   - For Cognitive Disabilities: Use extremely simple words, short sentences, and bullet points. Avoid jargon.
   - For Low-Vision/Screen Readers: Provide clear, descriptive audio-friendly text. No complex tables or emojis.
   - For Deaf/Sign-Language Avatars: Keep the text concise, action-oriented, and structured so the avatar can render it easily.
5. TONE: Remain calm, incredibly patient, friendly, and deeply respectful. Never rush the user.

If the retrieved documents do not contain the answer, state clearly in an accessible way: "I do not have that information right now, but I can call a human staff member to assist you."

{formatting}
{intent_instructions}
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
