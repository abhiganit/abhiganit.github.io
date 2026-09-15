#!/usr/bin/env python3
"""Build the handbook (and, from the same geometry, the colouring edition)."""
import sys, os, glob
import cairosvg
from pypdf import PdfWriter, PdfReader

TMP = "/home/claude/work/handbook/out"

def build(outpath, outline=False, title="Bartholomew's Handbook for New Ghosts"):
    import handbook
    handbook.OUTLINE = outline
    import importlib; importlib.reload(handbook)
    handbook.OUTLINE = outline
    os.makedirs(TMP, exist_ok=True)
    w = PdfWriter()
    for i, fn in enumerate(handbook.PAGES, 1):
        svg, pdf = f"{TMP}/p{i:02d}.svg", f"{TMP}/p{i:02d}.pdf"
        open(svg, "w").write(fn())
        cairosvg.svg2pdf(url=svg, write_to=pdf)
        for p in PdfReader(pdf).pages:
            w.add_page(p)
    w.add_metadata({"/Title": title})
    w.write(outpath)
    print("wrote", outpath, round(os.path.getsize(outpath)/1e3), "KB")

if __name__ == "__main__":
    build(sys.argv[1] if len(sys.argv)>1 else "handbook.pdf")
