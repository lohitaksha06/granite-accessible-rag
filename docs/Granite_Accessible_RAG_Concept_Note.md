# Project Concept Note (1M1B – IBM SkillsBuild AI + Sustainability Virtual Internship)
# Granite Accessible Assistant: An Inclusive AI Interface for Sustainable Cities and Public Services

Student: Lohitaksha Patary
College: Amrita Vishwa Vidyapeetham, Bangalore
Email: bl.sc.u4cse24025@students.amrita.edu / patarylohitaksha06@gmail.com
GitHub: https://github.com/lohitaksha06/granite-accessible-rag

## Introduction & Project Context
Modern cities rely on self-service systems: kiosks at airports and hospitals, digital counters at banks, ticketing machines, and online government forms. These systems improve efficiency, but often assume users can see small text, follow complex menus, hear announcements, and ask staff confidently.

As a result, many people struggle to access essential services independently—especially people with disabilities (blind/low-vision, deaf/hard-of-hearing, cognitive/learning disabilities), elderly users, shy or socially anxious individuals, and non-native language speakers. In high-pressure places like airports, grocery stores, banks, hospitals, and government offices, the outcome is stress, longer queues, and dependence on staff.

This project treats sustainability as both environmental and social: inclusive systems reduce friction and make public services equitable, dignified, and usable for everyone.

## SDG Alignment
- Primary: SDG 11 – Sustainable Cities and Communities: inclusive access to public services and urban infrastructure.
- SDG 10 – Reduced Inequalities: reduces barriers based on disability, age, language, or confidence.
- SDG 4 – Quality Education: provides clear, step-by-step guidance that supports different learning needs.
- SDG 9 – Industry, Innovation, and Infrastructure: adds an accessibility layer to existing systems without full redesign.

## Problem Statement
How might we use AI to enable people of different abilities, languages, and confidence levels to independently access essential services in a sustainable and inclusive manner?

Current gaps:
- One-size-fits-all interfaces and instructions
- Over-reliance on visual or spoken interaction
- Limited personalization (language, simplified steps, calmer delivery)
- Stress and dependency on staff for routine guidance

## AI Solution Overview
Granite Accessible Assistant is an AI-powered accessibility layer (not just a chatbot) that provides grounded, user-adaptive help for public services.

It uses IBM Granite models for language understanding and response generation, and Retrieval-Augmented Generation (RAG) to pull verified, pre-approved information before answering. Responses adapt to a user’s selected language and accessibility preference (for example: cognitive-friendly short steps, caption-first, or low-vision friendly structure).

This project does not train a new LLM; it responsibly applies existing models and retrieval of trusted content to improve reliability.

## How the System Works (Short Workflow)
- User interacts via kiosk/small screen/tablet/mobile and selects language + accessibility preference.
- User asks for help (navigation, forms, procedures, service steps).
- The system retrieves verified information from a curated knowledge base.
- Granite generates a calm, simplified response grounded in that retrieved information.
- Output is delivered in an accessible format to support independent action.

## Target Users
Primary users:
- Blind or low-vision users
- Deaf or hard-of-hearing users
- Users with cognitive or learning disabilities

Secondary users:
- Elderly users
- Shy or socially anxious users
- Non-native language speakers
- General public in high-pressure environments (airports, hospitals, banks)

## Responsible AI Considerations
- Fairness: supports diverse needs via user-selected accessibility preferences.
- Transparency: indicates AI-assisted guidance and uses safe fallback when verified info is missing.
- Privacy: minimizes personal data; preferences can be used without identity details.
- Safety: reduces hallucinations by grounding responses in retrieved, curated content.

## Expected Impact
- Social: increased independence and dignity; reduced stress through calm, step-by-step guidance.
- Urban: faster service flow and more consistent instructions; reduced repetitive staff workload.
- Sustainability: scalable inclusive infrastructure that improves existing systems without major redesign.

## Metaverse & Future Scope
Here, “metaverse” means accessible virtual service interfaces (digital city-service spaces), not gaming and not VR-only.

Future scope:
- Virtual service agents for digital versions of city services
- Sign-language avatars for key instructions
- Braille/screen-reader optimized outputs
- Gesture and voice interaction options with accessibility controls

## Conclusion
Granite Accessible Assistant focuses on practical sustainability by improving inclusion in public services. By responsibly using IBM Granite with RAG-grounded verified information, the solution is feasible, scalable, and human-centric—helping citizens access services independently while reducing stress and staff overload.
