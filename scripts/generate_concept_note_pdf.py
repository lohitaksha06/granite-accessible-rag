from __future__ import annotations

from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer


def build_pdf(md_source_path: Path, pdf_out_path: Path, screenshot_path: Path | None = None) -> None:
    styles = getSampleStyleSheet()
    title_style = styles["Title"]
    body_style = styles["BodyText"]
    body_style.leading = 12

    lines = md_source_path.read_text(encoding="utf-8").splitlines()

    story = []
    screenshot_inserted = False
    
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
            # Insert screenshot before "Target Users" section
            if "Target Users" in line and screenshot_path and screenshot_path.exists() and not screenshot_inserted:
                story.append(Spacer(1, 12))
                story.append(Paragraph("<b>Virtual Kiosk Interface (Screenshot)</b>", styles["Heading3"]))
                story.append(Spacer(1, 8))
                img = Image(str(screenshot_path), width=5*inch, height=3.5*inch)
                story.append(img)
                story.append(Spacer(1, 12))
                screenshot_inserted = True
            
            story.append(Paragraph(f"<b>{line[3:]}</b>", styles["Heading2"]))
            story.append(Spacer(1, 4))
            continue

        if line.startswith("- "):
            story.append(Paragraph(f"• {line[2:]}", body_style))
            continue

        # Skip ASCII art diagrams (lines with box-drawing characters)
        if any(c in line for c in "┌┐└┘├┤┬┴┼─│▼►▲◄"):
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
    screenshot = repo_root / "docs" / "kiosk_screenshot.png"

    build_pdf(md_source, pdf_out, screenshot)
    print(f"Wrote: {pdf_out}")


if __name__ == "__main__":
    main()
