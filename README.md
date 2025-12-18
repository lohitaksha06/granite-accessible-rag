# Granite Accessible RAG

An AI-powered accessibility assistant designed to help people with disabilities communicate and access information easily within digital and real-world environments. The system uses **IBM Granite LLM** combined with **Retrieval-Augmented Generation (RAG)** to provide accurate, grounded, and disability-aware responses.

The project explores how an AI-driven accessibility layer can function as part of a **metaverse-like digital environment**, where users interact through adaptive interfaces rather than immersive VR hardware.

---

## 🌍 Vision

People with disabilities often face communication barriers in public and digital spaces such as **banks, grocery stores, malls, hospitals, and educational institutions**. Existing systems are fragmented and rarely adapt to different accessibility needs.

This project envisions an AI assistant that:
- Responds using **accessible formats** (text, simplified language, structured output)
- Can be extended to **sign language avatars**, **braille displays**, or **audio interfaces**
- Acts as a digital representative or kiosk-style assistant in both virtual and physical environments
- Enables inclusive communication without requiring human intermediaries

A small-scale application (for example, a mobile device or kiosk) running this AI system could allow users to communicate with an AI assistant that understands their needs and responds appropriately.

---

## ♿ Accessibility Capabilities (Conceptual)

The system is designed with extensibility in mind for:

- **Deaf / Hard-of-Hearing Users**
  - Clear text-based responses
  - Potential integration with sign-language avatars

- **Blind / Low-Vision Users**
  - Step-by-step verbal instructions
  - Compatibility with braille or screen-reader outputs

- **Users with Cognitive Disabilities**
  - Simplified explanations
  - Reduced information overload

---

## 🧩 System Architecture

User / Kiosk / Mobile App
↓
FastAPI Backend (/ask endpoint)
↓
Disability & Language Profile Resolver
↓
RAG Pipeline
├── Vector Store (FAISS)
├── Accessibility Knowledge Documents
↓
IBM Granite LLM
↓
Accessible, Grounded Response

---

## ⚙️ How It Works

1. A user submits a question along with accessibility preferences such as disability type and language.
2. The FastAPI backend receives the request through the `/ask` endpoint.
3. The RAG pipeline retrieves relevant accessibility documents from a FAISS vector database.
4. Retrieved content is injected into a structured prompt.
5. Disability and language profiles shape how the AI should respond.
6. IBM Granite LLM generates a grounded and accessibility-aware response using only the retrieved context.
7. The response is returned to the user in an inclusive and understandable format.

This design ensures accurate, explainable, and responsible AI behavior.

---

## 🌐 Multilingual Accessibility

To further reduce communication barriers, the system includes a **"Choose Your Language"** capability designed for users from diverse linguistic backgrounds.

The AI assistant can be configured to respond in multiple widely spoken languages, making it suitable for deployment in public and international environments such as airports, banks, malls, hospitals, and service kiosks.

### Supported / Planned Languages
The system is designed to support the most widely spoken languages globally, including:

- English
- Mandarin Chinese
- Hindi
- Spanish
- French
- Arabic
- Portuguese
- Bengali
- Russian
- german
- japanese
- korean
- Urdu

Language selection can be combined with disability profiles to ensure responses remain accessible, simplified, and culturally appropriate.

### Example
A user may select:
- **Language:** Hindi  
- **Accessibility Mode:** Cognitive-friendly  

The AI assistant will then retrieve relevant knowledge and respond in **simple Hindi**, reducing both language and accessibility barriers.

---



The system avoids hallucinations by retrieving verified accessibility and domain-specific knowledge before generating responses.

---

## 🛠️ Tech Stack

- **Language:** Python
- **LLM:** IBM Granite (via Hugging Face)
- **Approach:** Retrieval-Augmented Generation (RAG)
- **Vector Store:** FAISS / Chroma
- **Backend:** FastAPI
- **Version Control:** Git + GitHub

---

## 🌱 Social Impact & SDG Alignment

This project aims to reduce communication barriers for people with disabilities by providing inclusive, AI-powered assistance.

Aligned UN Sustainable Development Goals:
- **SDG 4 – Quality Education**: Accessible explanations for diverse learners
- **SDG 9 – Industry, Innovation, and Infrastructure**: AI-driven public service systems
- **SDG 10 – Reduced Inequalities**: Inclusive access to information
- **SDG 11 – Sustainable Cities and Communities**: Accessible digital infrastructure

Potential real-world applications include:
- Bank and government service kiosks
- Hospital and campus navigation assistants
- Shopping malls and public service centers
- Mobile accessibility applications

---

## 🔮 Future Extensions

- Integration with sign language recognition systems for gesture-based input
- Sign language avatar rendering for AI responses
- Braille display and screen-reader integration
- Expanded multilingual support with regional accessibility rules
- Deployment on kiosks, edge devices, and mobile platforms

---

## 🚀 Project Status

- [x] Repository initialized
- [x] Project vision defined
- [ ] RAG pipeline implementation
- [ ] IBM Granite integration
- [ ] Disability-aware prompting
- [ ] API and demo interface

---

## 📌 Note

This project focuses on the **AI accessibility layer** rather than full VR or hardware-based metaverse systems. Sign language, braille, and immersive interfaces are considered **future extensions** of the core AI system.
