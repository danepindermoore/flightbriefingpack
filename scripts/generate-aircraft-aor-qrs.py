#!/usr/bin/env python3
"""Generate local SVG QR codes from the BA AOR URLs in data/aircraft.js.

Requires ReportLab (the Codex Python runtime includes it).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from reportlab.graphics import renderSVG
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing


ROOT = Path(__file__).resolve().parents[1]
AIRCRAFT_DATA = ROOT / "data" / "aircraft.js"
OUTPUT_DIR = ROOT / "assets" / "aircraft-aor-qr"


def aircraft_records(source: str) -> dict[str, dict]:
    records: dict[str, dict] = {}
    decoder = json.JSONDecoder()
    assignment = re.compile(r'globalThis\.AIRCRAFT\["([^"]+)"\]\s*=\s*')

    for match in assignment.finditer(source):
        record, _ = decoder.raw_decode(source, match.end())
        records[match.group(1)] = record
    return records


def main() -> None:
    records = aircraft_records(AIRCRAFT_DATA.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    written = 0

    for code, record in records.items():
        url = record.get("baAorUrl")
        if not url:
            continue

        qr = QrCodeWidget(url, barLevel="M")
        x0, y0, x1, y1 = qr.getBounds()
        drawing = Drawing(x1 - x0, y1 - y0)
        drawing.add(qr)
        svg = renderSVG.drawToString(drawing)
        svg = svg.replace("<svg ", '<svg shape-rendering="crispEdges" ', 1)
        (OUTPUT_DIR / f"{code}.svg").write_text(svg, encoding="utf-8")
        written += 1

    print(f"Generated {written} aircraft AOR QR codes in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
