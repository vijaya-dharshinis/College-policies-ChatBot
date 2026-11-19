import os
import io
import re

def clean_ascii(text):
    replacements = {
        "—": "-",
        "–": "-",
        "•": "*",
        "·": "*",
        "“": '"',
        "”": '"',
        "‘": "'",
        "’": "'",
        "…": "...",
        "₹": "Rs. ",
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text.encode("ascii", "replace").decode("ascii")

def generate_simple_pdf(title, subtitle, sections):
    title = clean_ascii(title)
    subtitle = clean_ascii(subtitle)
    
    objects = []
    def add_object(obj_content):
        objects.append(obj_content)
        return len(objects)

    pages = []
    current_page_lines = []
    page_capacity = 42 # lines per page
    
    current_page_lines.append(("TITLE", title))
    current_page_lines.append(("SUBTITLE", subtitle))
    current_page_lines.append(("LINE", "-" * 55))
    current_page_lines.append(("SPACER", ""))
    
    for sec_title, sec_body in sections:
        sec_title = clean_ascii(sec_title)
        sec_body = clean_ascii(sec_body)
        
        current_page_lines.append(("HEADING", sec_title))
        words = sec_body.split()
        line = ""
        for w in words:
            if len(line) + len(w) + 1 > 75:
                current_page_lines.append(("BODY", line))
                line = w
            else:
                line = (line + " " + w).strip()
        if line:
            current_page_lines.append(("BODY", line))
        current_page_lines.append(("SPACER", ""))
        
        if len(current_page_lines) >= page_capacity:
            pages.append(current_page_lines[:page_capacity])
            current_page_lines = current_page_lines[page_capacity:]
            
    if current_page_lines:
        pages.append(current_page_lines)
        
    content_obj_indices = []
    
    for p_idx, page_lines in enumerate(pages):
        stream_lines = ["BT"]
        y = 780
        for item_type, text in page_lines:
            safe_text = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            if item_type == "TITLE":
                stream_lines.append("/F2 18 Tf")
                stream_lines.append(f"50 {y} Td")
                stream_lines.append(f"({safe_text}) Tj")
                y -= 26
            elif item_type == "SUBTITLE":
                stream_lines.append("/F1 11 Tf")
                stream_lines.append(f"50 {y} Td")
                stream_lines.append(f"({safe_text}) Tj")
                y -= 20
            elif item_type == "HEADING":
                stream_lines.append("/F2 12 Tf")
                stream_lines.append(f"50 {y} Td")
                stream_lines.append(f"({safe_text}) Tj")
                y -= 17
            elif item_type == "LINE":
                stream_lines.append("/F1 10 Tf")
                stream_lines.append(f"50 {y} Td")
                stream_lines.append(f"({safe_text}) Tj")
                y -= 14
            elif item_type == "BODY":
                stream_lines.append("/F1 9 Tf")
                stream_lines.append(f"50 {y} Td")
                stream_lines.append(f"({safe_text}) Tj")
                y -= 13
            elif item_type == "SPACER":
                y -= 8
            if y < 50:
                break
                
        # Footer
        stream_lines.append("/F1 8 Tf")
        footer_text = f"Sri Krishna University Policy Handbook  -  Page {p_idx + 1} of {len(pages)}"
        stream_lines.append(f"50 30 Td")
        stream_lines.append(f"({footer_text}) Tj")
        
        stream_lines.append("ET")
        stream_content = "\n".join(stream_lines)
        stream_bytes = stream_content.encode("latin-1", "replace")
        
        c_obj = f"<< /Length {len(stream_bytes)} >>\nstream\n{stream_content}\nendstream"
        objects.append(c_obj)
        content_obj_indices.append(len(objects))

    # Font objects
    objects.append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>") # obj F1
    f1_idx = len(objects)
    objects.append("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>") # obj F2
    f2_idx = len(objects)
    
    # Page objects
    page_ref_indices = []
    pages_root_idx = len(objects) + len(content_obj_indices) + 1
    
    for c_idx in content_obj_indices:
        p_obj = (
            f"<< /Type /Page\n"
            f"/Parent {pages_root_idx} 0 R\n"
            f"/MediaBox [0 0 595 842]\n"
            f"/Contents {c_idx} 0 R\n"
            f"/Resources << /Font << /F1 {f1_idx} 0 R /F2 {f2_idx} 0 R >> >>\n"
            f">>"
        )
        objects.append(p_obj)
        page_ref_indices.append(len(objects))
        
    kids_str = " ".join([f"{idx} 0 R" for idx in page_ref_indices])
    pages_root_obj = (
        f"<< /Type /Pages\n"
        f"/Kids [{kids_str}]\n"
        f"/Count {len(page_ref_indices)}\n"
        f">>"
    )
    objects.append(pages_root_obj)
    actual_pages_root_idx = len(objects)
    
    catalog_obj = f"<< /Type /Catalog /Pages {actual_pages_root_idx} 0 R >>"
    objects.append(catalog_obj)
    catalog_idx = len(objects)
    
    out = io.BytesIO()
    out.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = []
    
    for i, obj in enumerate(objects):
        offsets.append(out.tell())
        out.write(f"{i+1} 0 obj\n{obj}\nendobj\n".encode("latin-1"))
        
    xref_offset = out.tell()
    out.write(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode("latin-1"))
    for off in offsets:
        out.write(f"{off:010d} 00000 n \n".encode("latin-1"))
        
    out.write(
        f"trailer\n<< /Size {len(objects)+1} /Root {catalog_idx} 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("latin-1")
    )
    
    return out.getvalue()


def build_handbook_pdf(source_txt_path, output_pdf_path):
    with open(source_txt_path, "r", encoding="utf-8") as f:
        text = f.read()
        
    sections = []
    parts = text.split("\n\n")
    curr_title = "University Overview"
    curr_body = []
    
    for p in parts:
        p_clean = p.strip()
        if not p_clean:
            continue
        if p_clean.startswith("Part ") or (len(p_clean) < 60 and ("Policy" in p_clean or "About " in p_clean or "Governance" in p_clean or p_clean[0].isdigit())):
            if curr_body:
                sections.append((curr_title, " ".join(curr_body)))
                curr_body = []
            curr_title = p_clean
        else:
            curr_body.append(p_clean)
            
    if curr_body:
        sections.append((curr_title, " ".join(curr_body)))
        
    pdf_bytes = generate_simple_pdf(
        "SRI KRISHNA UNIVERSITY",
        "Official University Policy Handbook - Academic, Student Life & Governance",
        sections
    )
    
    os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
    with open(output_pdf_path, "wb") as f:
        f.write(pdf_bytes)
    return len(pdf_bytes)

if __name__ == "__main__":
    txt = "backend/api/data/sku_policy_handbook.txt"
    pdf = "backend/api/data/Sri_Krishna_University_Policy_Handbook.pdf"
    size = build_handbook_pdf(txt, pdf)
    print(f"Generated PDF successfully: {size} bytes")
