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
  #text(weight: "bold", style: "italic")[Abstract]—Digital interaction systems increasingly serve diverse populations, yet many remain inaccessible to individuals with visual, auditory, cognitive, or motor disabilities. Traditional approaches to accessibility often treat assistive features as secondary additions rather than core design principles, resulting in fragmented user experiences. This paper presents an accessibility-aware artificial intelligence system that functions as a practical metaverse layer—an adaptive digital interaction framework that mediates between users and real-world services without requiring immersive virtual reality environments. The proposed architecture integrates IBM Granite large language models with Retrieval-Augmented Generation (RAG) to deliver contextually grounded, responsible, and hallucination-reduced responses. The system is designed for deployment across public kiosks, mobile applications, and enterprise platforms, supporting multilingual interaction and adaptive communication modalities tailored to individual user needs. By leveraging curated knowledge bases and real-time retrieval mechanisms, the framework provides accurate guidance for tasks such as navigation assistance, financial transactions, and public service access. Preliminary implementation demonstrates the feasibility of combining open-source language models with accessibility-first design principles to create inclusive AI systems that bridge the gap between digital services and underserved user populations.
]

#v(1em)

#block(width: 100%)[
  #set par(first-line-indent: 0pt)
  #text(weight: "bold", style: "italic")[Keywords]—#text(style: "italic")[accessibility, artificial intelligence, retrieval-augmented generation, large language models, IBM Granite, inclusive design, assistive technology, metaverse, human-computer interaction]
]

#v(2em)

// Sections to be added
= Introduction
#text(style: "italic", fill: gray)[(To be written — problem statement, motivation, and research objectives)]

#v(1em)

= Related Work
#text(style: "italic", fill: gray)[(To be written — literature review on LLMs, RAG, accessibility research, and metaverse concepts)]

#v(1em)

= System Architecture
#text(style: "italic", fill: gray)[(To be written — architectural overview with diagram-based explanation)]

#v(1em)

= Methodology
#text(style: "italic", fill: gray)[(To be written — implementation details, data sources, and evaluation approach)]

#v(1em)

= Discussion
#text(style: "italic", fill: gray)[(To be written — analysis of results, limitations, and implications)]

#v(1em)

= Future Work
#text(style: "italic", fill: gray)[(To be written — planned extensions and research directions)]

#v(1em)

= Conclusion
#text(style: "italic", fill: gray)[(To be written — summary of contributions)]

#v(2em)

// References placeholder
#heading(outlined: false, numbering: none)[References]
#text(style: "italic", fill: gray)[(To be added)]
