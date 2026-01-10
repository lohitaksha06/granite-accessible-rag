from __future__ import annotations

from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def build_pdf(md_source_path: Path, pdf_out_path: Path) -> None:
    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    body_style = styles["BodyText"]
    body_style.leading = 12

    lines = md_source_path.read_text(encoding="utf-8").splitlines()

    story = []
    for raw in lines:
        line = raw.strip()
        if not line:
            story.append(Spacer(1, 4))
            continue

        if line.startswith("# "):
            story.append(Paragraph(line[2:], title_style))
            story.append(Spacer(1, 6))
            continue

        if line.startswith("## "):
            story.append(Paragraph(f"<b>{line[3:]}</b>", styles["Heading2"]))
            story.append(Spacer(1, 4))
            continue

        if line.startswith("- "):
            story.append(Paragraph(f"• {line[2:]}", body_style))
            continue

        story.append(Paragraph(line, body_style))

    pdf_out_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(pdf_out_path),
        pagesize=LETTER,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
        title="Granite Accessible Assistant – Project Concept Note",
    )
    doc.build(story)


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    md_source = repo_root / "docs" / "Granite_Accessible_RAG_Concept_Note.md"
    pdf_out = repo_root / "docs" / "Granite_Accessible_RAG_Concept_Note.pdf"

    build_pdf(md_source, pdf_out)
    print(f"Wrote: {pdf_out}")


if __name__ == "__main__":
    main()
