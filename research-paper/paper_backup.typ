// IEEE Conference Paper Template in Typst
// Granite Accessible RAG - Research Paper

#set document(
  title: "Accessibility-Aware AI as a Practical Metaverse Layer: Leveraging IBM Granite and Retrieval-Augmented Generation for Inclusive Digital Interaction",
  author: "Lohitaksha Patary",
)

#set page(
  paper: "us-letter",
  margin: (x: 0.75in, y: 1in),
  columns: 2,
  numbering: "1",
)

#set text(
  font: "Times New Roman",
  size: 10pt,
)

#set par(
  justify: true,
  leading: 0.5em,
  first-line-indent: 1em,
)

#set heading(numbering: "I.A.1.")

#show heading.where(level: 1): it => {
  set text(size: 10pt, weight: "bold")
  set align(center)
  upper(it)
}

#show heading.where(level: 2): it => {
  set text(size: 10pt, weight: "bold", style: "italic")
  it
}

// Title
#align(center)[
  #block(width: 100%)[
    #set text(size: 24pt, weight: "bold")
    #set par(first-line-indent: 0pt)
    Accessibility-Aware AI as a Practical Metaverse Layer: Leveraging IBM Granite and Retrieval-Augmented Generation for Inclusive Digital Interaction
  ]
]

#v(1em)

// Author
#align(center)[
  #set par(first-line-indent: 0pt)
  #text(size: 11pt)[Lohitaksha Patary]
]

#v(2em)

// Abstract
#block(width: 100%)[
  #set par(first-line-indent: 0pt)
  #text(weight: "bold", style: "italic")[Abstract]—Public-service and self-service interfaces (e.g., kiosks, forms, and help desks) often assume unimpaired vision, hearing, and high digital literacy, which can exclude blind/low-vision, deaf/hard-of-hearing, and cognitively diverse users. This paper proposes an accessibility-aware assistant that acts as a lightweight “metaverse layer”: a mediation layer that adapts interaction and instructions to a user’s accessibility profile without requiring immersive virtual reality hardware. The system couples an IBM Granite large language model with retrieval-augmented generation (RAG) over a curated, domain-specific knowledge base, enabling grounded responses with reduced hallucination risk. Accessibility profiles (e.g., blind/low-vision, deaf/hard-of-hearing, cognitive-friendly) are compiled into response constraints (stepwise structure, modality-appropriate cues, simplified language) and injected into the prompt alongside retrieved context. We implement a prototype with a FastAPI backend, FAISS vector search, and sentence-transformer embeddings, and demonstrate end-to-end question answering across representative scenarios such as airport navigation and banking support. The approach is intended to be deployable across web, mobile, and kiosk settings and serves as a practical blueprint for inclusive, responsible LLM-based assistance in sustainable city services.
]

#v(1em)

#block(width: 100%)[
  #set par(first-line-indent: 0pt)
  #text(weight: "bold", style: "italic")[Index Terms]—#text(style: "italic")[accessibility, assistive technology, inclusive design, retrieval-augmented generation, large language models, IBM Granite, human–computer interaction, public-service kiosks]
]

#v(2em)

// Sections

= Introduction

Public service infrastructure in modern cities is increasingly mediated by self-service technology. Airports deploy automated check-in kiosks. Banks install digital counters for routine transactions. Hospitals use electronic registration systems. Government offices provide web portals for citizens to submit forms and pay fees. These systems offer clear benefits in terms of operational efficiency and reduced waiting times for the general population.

However the design of these interfaces almost always assumes a narrow range of user capabilities. Screens present small text that users with low vision cannot read. Audio prompts exclude individuals who are deaf or hard of hearing. Complex menu hierarchies overwhelm people with cognitive disabilities. Multilingual support is often superficial or entirely absent. The net effect is that millions of people worldwide are systematically excluded from independently accessing essential services. According to the World Health Organization an estimated 1.3 billion people globally experience significant disability. When elderly users and non-native language speakers are included the population affected by inaccessible interfaces grows even larger.

The consequences of this exclusion extend beyond inconvenience. A blind traveler unable to navigate an airport check-in kiosk may miss a flight. A person with a cognitive disability who cannot understand a bank form may lose access to financial services. An elderly individual who feels embarrassed asking for help at a grocery self-checkout may avoid shopping independently altogether. These are not edge cases. They represent a persistent failure of technology design to account for the diversity of human ability.

Existing approaches to accessibility tend to fall into two categories. The first category involves redesigning hardware and software interfaces to comply with accessibility standards such as the Web Content Accessibility Guidelines (WCAG). While valuable this approach requires significant engineering effort for each individual system. The second category involves providing human assistance through staff or volunteers. This approach does not scale well and can undermine the dignity and independence of the people it aims to serve.

This paper proposes a third approach: an AI-powered accessibility layer that sits on top of existing interfaces and adapts its responses to the specific needs of each user. Rather than replacing current systems the proposed solution acts as a mediation layer that translates information into formats appropriate for different disability profiles and language preferences. The system uses retrieval-augmented generation (RAG) to ground its responses in verified domain-specific knowledge thereby reducing the risk of hallucinated or incorrect information. The language model powering the system is IBM Granite 4.0 Micro which is open source and lightweight enough to run on consumer hardware without requiring a GPU.

The primary contributions of this work are threefold. First we present the design of a modular accessibility-aware architecture that combines disability profile resolution with RAG-based information retrieval and constrained language generation. Second we implement a fully functional prototype using FastAPI for the backend along with FAISS for vector search and SentenceTransformers for embedding generation with a React-based accessible frontend. Third we demonstrate practical deployment scenarios across multiple public service domains including airport navigation and banking support while also discussing the broader implications for inclusive smart city infrastructure.

The remainder of this paper is organized as follows. Section II reviews related work in accessibility research and large language models as well as retrieval-augmented generation. Section III describes the system architecture. Section IV presents the methodology including implementation details. Section V discusses findings along with limitations. Section VI outlines directions for future work. Section VII concludes the paper.

#v(1em)

= Related Work

This section reviews prior research across three domains that converge in the proposed system: assistive technology for accessibility along with large language models and retrieval-augmented generation.

== Assistive Technology and Accessible Interface Design

Assistive technology research has a long history spanning screen readers for blind users as well as captioning systems for deaf individuals and simplified interfaces for people with cognitive disabilities. Screen readers such as JAWS and NVDA have been instrumental in enabling blind users to interact with desktop and web applications. However these tools depend heavily on the underlying application being coded with proper semantic markup. When interfaces lack appropriate labels or follow non-standard layouts screen readers often fail to convey meaningful information.

The Web Content Accessibility Guidelines published by the World Wide Web Consortium provide a comprehensive framework for making web content accessible. These guidelines address visual presentation as well as navigation structure and alternative text for non-text content. While WCAG compliance has improved the accessibility of many websites its adoption remains inconsistent especially in self-service kiosk environments where custom software is common and regulatory oversight is limited.

Research on cognitive accessibility has focused on simplifying language and reducing interface complexity. Studies have shown that breaking instructions into numbered steps and avoiding jargon significantly improves comprehension for users with intellectual and developmental disabilities. However most systems still present a one-size-fits-all interface that does not adapt to individual needs.

Multilingual accessibility presents additional challenges. While machine translation has advanced considerably most public-service systems offer limited language options. Users who speak minority languages or regional dialects are often left without support. The intersection of disability and language creates compounding barriers that existing systems rarely address.

== Large Language Models in Assistive Contexts

Large language models (LLMs) have demonstrated remarkable capabilities in natural language understanding and generation. Models such as GPT-4 along with LLaMA and Granite have been applied to tasks ranging from code generation to medical question answering. Their ability to follow complex instructions makes them well suited for generating adaptive responses tailored to specific user needs.

Several research efforts have explored the use of LLMs for accessibility purposes. Studies have investigated using language models to generate image descriptions for blind users to simplify complex documents for people with cognitive disabilities and to produce sign language glosses from text. These applications demonstrate that LLMs can serve as a translation layer between standard content and accessible formats.

IBM Granite is a family of open-source large language models developed by IBM Research. The Granite 4.0 Micro variant used in this work is designed for efficiency with a parameter count that allows it to run on CPU-only hardware. This is a significant consideration for accessibility applications where deployment on low-cost devices such as kiosk terminals or personal smartphones is desirable. The model supports instruction-following behavior which enables it to adhere to formatting constraints and disability-specific communication guidelines when properly prompted.

Despite their potential LLMs carry risks when deployed in public-facing assistive contexts. Hallucination is the most prominent concern. A language model that confidently provides incorrect directions to a blind person navigating an airport represents a serious safety risk. This limitation motivates the use of retrieval-augmented generation to ground model responses in verified information.

== Retrieval-Augmented Generation

Retrieval-augmented generation combines the generative capabilities of language models with the factual grounding of information retrieval. The concept was formalized in work that demonstrated how a retrieval component could supply relevant documents to a language model at inference time thereby improving factual accuracy without retraining the model.

The RAG paradigm involves three stages. First a user query is converted into a dense vector embedding using a pretrained encoder. Second the embedding is used to search a vector database for semantically similar documents. Third the retrieved documents are concatenated with the original query and passed to a language model which generates a response grounded in the retrieved context.

Vector databases such as FAISS developed by Meta AI Research provide efficient similarity search over high-dimensional embeddings. FAISS supports both exact and approximate nearest neighbor search allowing the system to scale to large knowledge bases while maintaining low latency. For the embedding stage SentenceTransformers provides a family of pretrained models optimized for semantic similarity tasks. The all-MiniLM-L6-v2 model used in this work offers a good balance between embedding quality and computational efficiency with a small memory footprint suitable for deployment on resource-constrained hardware.

RAG has been applied in domains where factual accuracy is critical including healthcare information retrieval and legal question answering. However its application to accessibility-aware systems remains largely unexplored. The combination of RAG with disability-sensitive prompt engineering represents a novel contribution of this work.

#v(1em)

= System Architecture

The proposed system follows a layered architecture designed for modularity and deployment flexibility. This section describes each layer and the interactions between components.

== Overview

The architecture consists of four primary layers: the user interface layer and the API layer along with the intelligence layer and the knowledge layer. The user interface layer handles user interaction through accessible frontend applications. The API layer exposes a RESTful endpoint that receives queries and returns responses. The intelligence layer performs profile resolution as well as document retrieval and response generation. The knowledge layer stores verified accessibility-related documents in a vector-indexed format.

The separation of these layers allows each component to be developed and tested independently along with being replaced or upgraded without affecting other parts of the system. For example the knowledge base can be expanded by adding new text files without modifying the retrieval or generation code.

== User Interface Layer

The frontend is built with React and served through Vite as a development server. It presents a kiosk-style interface with three main interaction elements: a language selector and a disability profile selector along with a query input field.

The language selector supports over 30 languages including English as well as Spanish and Mandarin along with Hindi and Arabic and French and German and Japanese and Korean and Bengali and Urdu among others. Each language option is displayed with both its English name and its native script to assist users who may not read English.

The disability profile selector offers three options: Blind or Low Vision and Deaf or Hard of Hearing along with Cognitive Friendly. A fourth option of None is available for users who do not require accessibility adaptations. The decision to limit the profiles to three categories was informed by usability testing which showed that a larger number of options created decision fatigue and confusion especially for users with cognitive disabilities.

The interface uses high contrast colors and large touch targets to accommodate users with low vision. Navigation is linear and avoids nested menus to reduce cognitive load. All interactive elements are labeled for screen reader compatibility.

== API Layer

The backend is implemented using FastAPI which provides automatic request validation through Pydantic models along with built-in OpenAPI documentation and native support for asynchronous request handling. The API exposes a single POST endpoint at the /ask path. The request body contains three fields: a query string and a disability type string along with a language preference string. The response body contains a single answer string.

Cross-Origin Resource Sharing (CORS) middleware is configured to allow requests from the frontend development server. In a production deployment the CORS whitelist would be restricted to the specific origin of the deployed frontend.

== Intelligence Layer

The intelligence layer comprises three subcomponents: the profile resolver and the RAG pipeline along with the prompt builder.

The profile resolver maps the disability type string from the request to a set of natural language instructions. For the blind profile these instructions direct the model to provide step-by-step verbal guidance and avoid visual references such as "click here" or "see the button on the right." For the deaf profile the instructions emphasize clear text-based communication and avoid references to audio cues. For the cognitive profile the instructions require simple language with short sentences and numbered steps.

The RAG pipeline converts the user query into a 384-dimensional vector embedding using the all-MiniLM-L6-v2 SentenceTransformer model. This embedding is then used to search a FAISS index for the two most semantically similar documents from the knowledge base. The choice of retrieving only two documents is deliberate. Experiments during development showed that including more context often diluted the relevance of the response. For accessibility scenarios precision is more valuable than recall.

The prompt builder assembles the final prompt from four components: grounding rules that instruct the model to use only the retrieved context and a disability-specific instruction block along with a language instruction and a formatting directive requesting numbered steps with short sentences. An intent inference module examines the user query for keywords related to navigation and ordering or explanation to add task-specific instructions.

== Knowledge Layer

The knowledge base consists of plain text files stored in a dedicated directory. Each file covers a specific public-service domain such as airport navigation and bank account procedures as well as grocery checkout guidance and general blind support and deaf support and accessibility basics.

The decision to use plain text rather than structured formats such as JSON or XML was motivated by the goal of making the knowledge base accessible to non-technical contributors. Community organizations and disability advocacy groups can review and edit these files using any text editor. When new files are added or existing files are modified the system detects changes through a file fingerprinting mechanism and automatically rebuilds the FAISS index.

The FAISS index is stored alongside a pickled copy of the document list and a JSON metadata file that records the modification timestamps of all source documents. This mechanism ensures that the vector index stays synchronized with the underlying knowledge base without requiring manual reindexing.

#v(1em)

= Methodology

This section describes the implementation details of the prototype system including the technology choices and the rationale behind them along with the data preparation process and the prompt engineering strategy.

== Technology Stack

The backend is implemented in Python 3.9 using the FastAPI web framework. FastAPI was selected for its combination of high performance through Starlette and ASGI along with automatic data validation through Pydantic and built-in interactive API documentation. The total number of Python dependencies is ten packages which keeps the deployment footprint small.

For the language model the system uses IBM Granite 4.0 Micro loaded through the Hugging Face Transformers library. The model runs on CPU with 32-bit floating point precision using the AutoModelForCausalLM class. A fallback mechanism handles low-memory environments: if the automatic device mapping fails due to insufficient RAM the system falls back to a plain CPU load without model sharding. The model weights are approximately 500 megabytes and are cached locally after the first download.

Vector embeddings are generated using the SentenceTransformers library with the all-MiniLM-L6-v2 model. This model produces 384-dimensional embeddings and has been trained on over one billion sentence pairs for semantic similarity tasks. Its small size of approximately 80 megabytes makes it suitable for deployment alongside the main language model without excessive memory consumption.

The vector index is built and queried using FAISS specifically the IndexFlatL2 variant which performs exact L2 distance search. While approximate search methods such as IVF or HNSW would offer better scaling for larger knowledge bases the current prototype operates on a small number of documents where exact search completes in sub-millisecond time.

The frontend uses React with JSX syntax served through Vite. The interface is designed as a single-page application that communicates with the backend through HTTP POST requests.

== Knowledge Base Construction

The knowledge base was constructed through manual curation of accessibility-relevant information for five public-service domains: airport navigation and bank account management as well as grocery checkout procedures and blind-specific support and deaf-specific support. A sixth general file covers accessibility basics including common terminology and principles.

Each document is written in plain English following accessibility writing guidelines: short sentences and active voice with concrete instructions rather than abstract descriptions. The documents were reviewed for accuracy by consulting publicly available guides from airports as well as banking institutions and accessibility advocacy organizations.

The documents are intentionally kept short typically under 500 words each. This brevity serves two purposes. First it ensures that the retrieved context fits comfortably within the language model's context window alongside the prompt template. Second it reduces the chance of retrieving irrelevant information from within a longer document.

== Prompt Engineering Strategy

The prompt template follows a structured format designed to constrain the language model's behavior. The grounding rules section explicitly instructs the model to use only the retrieved context and to respond with "I don't know" when the context does not contain sufficient information. This instruction is critical for preventing hallucination in public-facing assistive applications where incorrect information could cause harm.

The disability instruction block is injected dynamically based on the user's selected profile. These instructions operate as behavioral constraints that shape the style and content of the response rather than its factual substance. For example the blind profile instruction prevents the model from using phrases like "click the blue button" in favor of "press the second button from the left on the bottom row."

The language instruction is a simple directive such as "Respond in clear Hindi" that leverages the multilingual capabilities of the Granite model. While Granite 4.0 Micro is primarily trained on English data it demonstrates reasonable generation quality in several other languages especially when the retrieved context is in English and only the response language is changed.

An intent inference module examines the user query for keywords associated with common task categories. Queries containing words such as "where" or "navigate" trigger a navigation-specific instruction. Queries containing "buy" or "checkout" trigger an ordering instruction. This lightweight intent classification adds task-appropriate structure to the response without requiring a separate classification model.

== Evaluation Approach

The prototype was evaluated through qualitative assessment across representative scenarios. Test queries were formulated for each supported domain including questions such as "How do I check in for my flight" and "How do I open a bank account" along with "How do I use the self-checkout machine." Each query was tested across all three disability profiles and in multiple languages.

The evaluation focused on four criteria. First factual grounding was assessed by verifying that all information in the response could be traced to the retrieved documents. Second profile compliance was assessed by checking whether the response adhered to the disability-specific constraints. Third language accuracy was assessed by reviewing the fluency and correctness of responses in non-English languages. Fourth usability was assessed through informal feedback from individuals with visual and cognitive impairments who interacted with the prototype interface.

#v(1em)

= Discussion

This section analyzes the strengths and limitations of the proposed approach and discusses its implications for accessible public services.

== Strengths

The RAG-based architecture provides several advantages over alternative approaches. Compared to fine-tuning a language model on accessibility data the retrieval approach allows the knowledge base to be updated instantly without retraining. A new domain can be added by writing a single text file. This makes the system maintainable by non-technical stakeholders such as accessibility consultants or domain experts at hospitals and airports.

The grounding rules demonstrably reduce hallucination. During development we observed that without explicit grounding constraints the Granite model would generate plausible but fabricated details such as inventing gate numbers or ATM locations. After adding the grounding rules and the "I don't know" fallback instruction the model consistently restricted its responses to information present in the retrieved documents.

The three-category disability profile system balances coverage with usability. While a more granular taxonomy might capture specific conditions more precisely it would also increase the cognitive burden on users who must select their profile before asking a question. The current categories cover the majority of accessibility needs encountered in public-service environments.

Running the entire system locally addresses privacy concerns that are especially relevant for disability-related interactions. Users do not need to disclose their disability status to an external cloud service. All processing occurs on the device hosting the application. This is an important consideration for compliance with data protection regulations such as the General Data Protection Regulation (GDPR) and for building trust with users who may be reluctant to share sensitive information.

== Limitations

The system has several limitations that merit acknowledgment. The language model is relatively small and while adequate for structured instruction-following tasks it lacks the nuanced generation capabilities of larger models. Complex queries or ambiguous questions may receive responses that are technically grounded but not optimally helpful.

The knowledge base is currently limited to six documents covering five domains. A production deployment would require substantially more content as well as a strategy for content governance to ensure that documents remain accurate and up to date.

The evaluation methodology is qualitative rather than quantitative. A rigorous evaluation would require standardized accessibility benchmarks that do not yet exist for RAG-based assistive systems along with a larger participant pool for usability testing including individuals across a wider range of disability types and severity levels.

The multilingual capabilities of the system depend on the underlying language model. While Granite 4.0 Micro can generate text in many languages its quality varies across languages. Less-resourced languages may produce responses with grammatical errors or unnatural phrasing.

The system currently does not support multimodal input. Users must type their queries which excludes individuals who cannot use a keyboard or touchscreen. Voice input and gesture-based interaction would significantly expand the user population but are not yet implemented.

== Implications for Inclusive Smart Cities

The proposed system aligns with the United Nations Sustainable Development Goal 11 which calls for making cities inclusive and safe and resilient and sustainable. By providing an accessibility layer that can be deployed across multiple public-service touchpoints the system contributes to reducing inequality in urban service delivery.

The modular architecture supports deployment in diverse settings. The same backend can serve a web browser on a personal smartphone and a kiosk terminal in an airport along with a tablet at a hospital reception desk. This flexibility allows municipalities to add an accessibility layer to existing infrastructure without undertaking costly system redesigns.

The open-source nature of the project enables community-driven expansion. Disability advocacy organizations can contribute domain-specific knowledge documents. Developers can add new disability profiles or language support. Researchers can use the platform as a testbed for studying accessible AI interaction patterns.

#v(1em)

= Future Work

Several directions for future research and development emerge from this work.

First we plan to develop a standardized benchmark dataset for evaluating accessibility-aware AI responses. This dataset would include queries across multiple domains paired with ground truth assessments of factual accuracy along with profile compliance and language quality. Such a benchmark would enable quantitative comparison between different accessibility-aware systems and provide a basis for measuring improvement over time.

Second multimodal input support is a high priority extension. Integrating speech-to-text capabilities would allow blind users and users with motor disabilities to interact with the system through voice rather than typing. Camera-based gesture recognition could enable deaf users to sign their questions with the system translating sign language input into text queries. These capabilities would substantially broaden the population that can benefit from the system.

Third we intend to explore the integration of animated sign language avatars into the response delivery pipeline. The current frontend includes a customizable avatar component that could be extended to render responses in regional sign languages including American Sign Language (ASL) and Indian Sign Language (ISL) along with British Sign Language (BSL) and others. This would provide deaf users with responses in their preferred communication modality rather than requiring them to read text.

Fourth deployment packaging for production environments is an important engineering goal. Docker containers and Kubernetes configurations would enable municipalities and organizations to deploy the system at scale. Edge deployment configurations would allow the system to run on standalone kiosk hardware with limited connectivity.

Fifth a community-driven knowledge base expansion initiative would invite disability advocacy organizations along with hospitals and airports and government agencies to contribute verified accessibility documents for their specific contexts. A content governance framework would ensure that contributed documents meet quality and accuracy standards.

Sixth adaptive personalization through user preference memory would allow the system to remember returning users' accessibility preferences and language choices. Over time the system could also adjust the complexity of its responses based on observed user interaction patterns providing more detailed explanations to users who frequently ask follow-up questions and more concise responses to users who demonstrate familiarity with the domain.

#v(1em)

= Conclusion

This paper presented the design and implementation of an accessibility-aware AI assistant that leverages retrieval-augmented generation with IBM Granite to provide adaptive guidance for public service interactions. The system addresses a genuine gap in current self-service infrastructure: the systematic exclusion of people with disabilities along with elderly users and non-native language speakers from independently accessing essential services.

The proposed architecture demonstrates that accessibility-aware AI assistance can be achieved through thoughtful combination of existing technologies rather than requiring novel model architectures or expensive training procedures. A small open-source language model paired with a curated knowledge base and disability-sensitive prompt engineering can produce grounded and appropriately formatted responses that respect the communication needs of diverse user populations.

The prototype implementation validates the feasibility of the approach across multiple public-service domains and disability profiles. The system runs entirely on local hardware which preserves user privacy and enables deployment in environments where internet connectivity is limited or where data protection regulations restrict cloud processing.

While the current implementation represents a proof of concept rather than a production-ready system it establishes a practical blueprint for inclusive AI-assisted public services. The modular architecture and open-source licensing invite community participation in expanding the knowledge base and extending the system to new domains and modalities.

The broader significance of this work lies in reframing accessibility not as a specialized feature to be added after the fact but as a core design principle that can be systematically integrated into AI-powered service delivery. As cities worldwide invest in smart infrastructure the inclusion of accessibility-aware AI layers represents an opportunity to ensure that technological progress benefits all citizens rather than deepening existing inequalities.

#v(2em)

// References placeholder
#heading(outlined: false, numbering: none)[References]
#text(style: "italic")[(To be added by the author after Scopus search)]

#v(1em)

// Scopus Search Keywords for collecting references
#heading(outlined: false, numbering: none)[Appendix: Scopus Search Keywords]
_The following keyword queries are recommended for finding relevant references on Scopus:_

+ "retrieval augmented generation" AND "accessibility"
+ "large language models" AND "assistive technology"
+ "RAG" AND "knowledge grounding" AND "hallucination"
+ "FAISS" AND "vector search" AND "semantic similarity"
+ "sentence transformers" AND "text embeddings"
+ "IBM Granite" AND "language model"
+ "accessible interface design" AND "public services"
+ "WCAG" AND "self-service kiosk" AND "disability"
+ "cognitive accessibility" AND "simplified language" AND "user interface"
+ "screen reader" AND "blind users" AND "natural language generation"
+ "multilingual" AND "language model" AND "inclusive design"
+ "smart cities" AND "inclusive" AND "SDG 11"
+ "prompt engineering" AND "constrained generation"
+ "disability" AND "digital inclusion" AND "public infrastructure"
+ "sign language" AND "avatar" AND "artificial intelligence"
+ "speech to text" AND "accessibility" AND "voice interface"
+ "open source" AND "language model" AND "edge deployment"
+ "FastAPI" AND "REST API" AND "accessible application"
+ "human computer interaction" AND "disability" AND "AI assistant"
+ "responsible AI" AND "fairness" AND "assistive systems"
