# Granite Accessible RAG – Project Concept Note

**Project Title:** Granite Accessible RAG: An AI Accessibility Assistant for Inclusive Digital, Physical, and Metaverse-Ready Services

## SDG Alignment (UN Sustainable Development Goals)
- **SDG 4 – Quality Education:** Provides simplified, accessible explanations; supports diverse learning needs.
- **SDG 9 – Industry, Innovation, and Infrastructure:** Demonstrates scalable AI embedded into kiosks/apps/virtual systems using LLM + RAG.
- **SDG 10 – Reduced Inequalities:** Reduces disability-driven communication barriers by adapting interaction style (disability + language).
- **SDG 11 – Sustainable Cities and Communities:** Supports inclusive public services (banks, hospitals, malls, transport hubs, government offices).

## Problem Statement
Many public and digital services still rely on complex kiosks, forms, signs, and staff interactions that assume users are visually and cognitively typical and comfortable asking for help. This creates real barriers for people who are blind, deaf/hard-of-hearing, or have cognitive/learning disabilities—but also for users who are anxious, shy, elderly, unfamiliar with technology, or uncomfortable with human interaction.

In high-impact environments such as airports, grocery stores, banks, hospitals, universities, and government offices, these barriers become day-to-day problems:
- **Airport:** A nervous traveler may not understand signage and may avoid asking staff (“Where do I go after security?”).
- **Grocery store:** A shy customer may be unsure about payment options (“How do I pay here?”).
- **Bank:** An elderly/anxious user may struggle with forms and fear making mistakes (needs calm, step-by-step guidance).

At the same time, many AI assistants rely only on a large language model (LLM). In real-world service settings, hallucinated or unreliable answers can confuse users and reduce trust—especially in accessibility-critical contexts.

There is a clear need for a responsible, accessibility-first AI assistant that:
- Adapts communication style based on disability and language preferences
- Provides calm, pressure-free guidance without judgment
- Produces grounded, trustworthy responses suitable for public service use
- Can be integrated behind kiosks, tablets, mobile apps, and virtual/metaverse-style interfaces

## AI Solution Overview
**Granite Accessible RAG** combines **IBM Granite LLM** with **Retrieval-Augmented Generation (RAG)** to produce reliable, disability-aware answers.

**Key technical components**
- IBM Granite LLM for natural language generation
- RAG pipeline with **FAISS** vector search for grounded retrieval
- Prompt shaping via **disability profiles** and **language profiles**
- **FastAPI** backend exposing a clean `POST /ask` endpoint

This creates an “accessibility intelligence layer” that can power kiosks, mobile apps, and metaverse-style interfaces without requiring VR hardware.

## Target Users
**Primary users:**
- Blind or low-vision individuals
- Deaf or hard-of-hearing individuals
- Users with cognitive or learning disabilities

**Secondary users:**
- Public service institutions (banks, hospitals, schools, government offices)
- Developers building inclusive digital/virtual platforms
- Organizations aiming for accessibility compliance

## Beyond Accessibility
While designed for people with disabilities, the system also benefits shy users, elderly individuals, non-native speakers, and anyone who prefers self-service over human interaction.

## Responsible AI Considerations
- **Grounded responses:** Uses RAG to reduce hallucinations.
- **Transparency:** Instructs the model to reply “I don’t know” when context is missing.
- **Inclusivity:** Response style adapts to disability and language preferences.
- **Human-centered design:** Complements assistive tech (screen readers, captions, braille), not replacing human support.

## Prototype / Demo (Any One)
**Selected demo:** RAG demo with API interface
- Accessibility knowledge stored as documents
- FAISS-based semantic retrieval
- Granite-based grounded response generation
- FastAPI + Swagger UI (`/docs`) for interactive testing

## Expected Impact
**Social impact:** Reduced communication barriers; increased independence in public and digital services.

**Technical impact:** A reusable accessibility intelligence layer encouraging responsible AI adoption in sensitive domains.

**Long-term impact:** Foundation for inclusive assistants in virtual/metaverse-like environments, supporting digital equity and inclusion.

## Future Scope
- Sign-language avatar rendering and gesture recognition input
- Braille display and screen-reader integration
- Expanded multilingual support with regional accessibility rules
- Deployment on kiosks, edge devices, and mobile platforms
