#!/usr/bin/env python3
"""Generate the website aircraft data from the September 2026 fleet workbook.

Requires openpyxl for this maintenance script only. Summary-level aircraft data
is generated into data/aircraft.js; individual crew-position details remain in
the aircraft AOR files until those details are added to the workbook.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from openpyxl import load_workbook


SOURCE_NAME = "British_Airways_Fleet_September_2026_Registrations.xlsx"
SOURCE_AS_OF = "2026-09"
REGISTRATION_SHEETS = (("Longhaul Registrations", "longhaul"), ("Shorthaul Registrations", "shorthaul"))
EXCLUDED_AIRFILES = {"788", "78Z", "38T"}
AIRFILE_MARKER_START = "// BEGIN GENERATED AIRFILE DATA"
AIRFILE_MARKER_END = "// END GENERATED AIRFILE DATA"


def normalise_header(value: object) -> str:
    return " ".join(str(value or "").strip().casefold().replace("–", "-").replace("—", "-").split())


def get_value(row: tuple, headers: dict[str, int], *names: str):
    for name in names:
        index = headers.get(normalise_header(name))
        if index is not None:
            return row[index] if index < len(row) else None
    return None


def get_cabin_value(row: tuple, headers: dict[str, int], *names: str):
    for name in names:
        wanted = normalise_header(name)
        for header, index in headers.items():
            if header == wanted or header.endswith(" " + wanted):
                return row[index] if index < len(row) else None
    return None


def yes_no(value: object) -> bool | None:
    if value is None or str(value).strip() == "":
        return None
    normalised = str(value).strip().casefold()
    if normalised in {"yes", "y", "true", "1"}:
        return True
    if normalised in {"no", "n", "false", "0"}:
        return False
    raise ValueError(f"Unexpected yes/no value: {value!r}")


def read_sheet_rows(workbook, sheet_name: str, title_rows: int):
    rows = workbook[sheet_name].iter_rows(values_only=True)
    for _ in range(title_rows):
        next(rows, None)
    header_row = next(rows)
    headers = {normalise_header(value): index for index, value in enumerate(header_row) if value is not None}
    return headers, rows


def load_registration_records(workbook_path: Path) -> dict[str, dict]:
    workbook = load_workbook(workbook_path, read_only=True, data_only=True)
    records: dict[str, dict] = {}
    for sheet_name, haul in REGISTRATION_SHEETS:
        headers, rows = read_sheet_rows(workbook, sheet_name, 1)
        for row in rows:
            raw_registration = get_value(row, headers, "Registration")
            if raw_registration is None or not str(raw_registration).strip():
                continue
            registration = str(raw_registration).strip().upper()
            airfile = str(get_value(row, headers, "Airfile") or "").strip()
            if not airfile:
                raise ValueError(f"No Airfile code for registration {registration}")
            if airfile in EXCLUDED_AIRFILES:
                continue
            if registration in records:
                raise ValueError(f"Duplicate registration found across workbook sheets: {registration}")

            wifi = get_value(row, headers, "Wi-Fi Type")
            wifi_type = str(wifi).strip() if wifi is not None and str(wifi).strip() else ("None" if haul == "shorthaul" else None)
            record = {
                "registration": registration,
                "haul": haul,
                "baseSection": get_value(row, headers, "Base / section", "Base / Section"),
                "airfile": airfile,
                "wifiType": wifi_type,
                "livery": get_value(row, headers, "Livery"),
                "newShorthaulSeat": yes_no(get_value(row, headers, "New SH seat")),
                "xlOverheadBins": yes_no(get_value(row, headers, "XL overhead bins")),
            }
            if haul == "longhaul":
                record["firstProduct"] = get_value(row, headers, "First Product")
                record["clubWorldProduct"] = get_value(row, headers, "Club World Product")
            records[registration] = record

    workbook.close()
    return records


def spare_seats(count, raw_location) -> list[dict]:
    if not count or not raw_location:
        return []
    locations = [part.strip() for part in re.split(r"\s*,\s*|\s*&\s*", str(raw_location)) if part.strip()]
    results = []
    for location in locations[:int(count)]:
        match = re.search(r"\b([A-Z]?\d+[A-Z]?)\b", location.upper())
        if not match:
            results.append({"seat": location, "facing": None, "note": "Spare crew seat"})
            continue
        seat = match.group(1)
        facing_match = re.search(r"\b(FWD|AFT)\b", location.upper())
        descriptor_match = re.search(r"\b(INBOARD|CENTRE|CENTER)\b", location.upper())
        descriptor = descriptor_match.group(1).title() if descriptor_match else None
        item = {"seat": seat, "facing": facing_match.group(1) if facing_match else None, "note": "Spare crew seat"}
        if descriptor:
            item["descriptor"] = descriptor
        results.append(item)
    return results


def read_type_summaries(workbook_path: Path) -> dict[str, list[dict]]:
    workbook = load_workbook(workbook_path, read_only=True, data_only=True)
    summaries = {"longhaul": [], "shorthaul": []}
    for sheet_name, haul, title_rows in (("Long Haul", "longhaul", 2), ("Short Haul", "shorthaul", 1)):
        headers, rows = read_sheet_rows(workbook, sheet_name, title_rows)
        for row in rows:
            raw_airfile = get_value(row, headers, "Airfile")
            if raw_airfile is None or not str(raw_airfile).strip():
                continue
            airfile = str(raw_airfile).strip()
            if airfile in EXCLUDED_AIRFILES:
                continue
            variant = str(get_value(row, headers, "Aircraft / Variant", "Aircraft / variant") or airfile).strip()
            family_match = re.search(r"[AB]\d{3}", variant.upper())
            family = family_match.group(0) if family_match else variant
            manufacturer = str(get_value(row, headers, "Manufacturer") or ("Airbus" if family.startswith("A") else "Boeing" if family.startswith("B") else "Unknown"))
            if haul == "longhaul":
                breakdown = {
                    "first": get_cabin_value(row, headers, "F - First"),
                    "clubWorld": get_cabin_value(row, headers, "J - Club World"),
                    "worldTravellerPlus": get_cabin_value(row, headers, "W - World Traveller Plus"),
                    "worldTraveller": get_cabin_value(row, headers, "M - World Traveller"),
                }
                classes = [code for key, code in (("first", "F"), ("clubWorld", "J"), ("worldTravellerPlus", "W"), ("worldTraveller", "M")) if isinstance(breakdown[key], (int, float)) and breakdown[key] > 0]
                flight_bunks = yes_no(get_value(row, headers, "FC Bunks"))
                cabin_bunks = yes_no(get_value(row, headers, "CC Bunks"))
                rest_types = []
                if flight_bunks:
                    rest_types.append("OFCR" if manufacturer.casefold() == "airbus" else "FCRC")
                if cabin_bunks:
                    rest_types.append("OFAR" if manufacturer.casefold() == "airbus" else "CCRC")
                rest_lookup = {"OFCR": "flightCrewRest", "FCRC": "flightCrewRest", "OFAR": "cabinCrewRest", "CCRC": "cabinCrewRest"}
                equipment = []
                for header, code in (("AED Location", "AED"), ("M5 Location", "M5"), ("RESUS Location", "RES"), ("RESTRAINT Location", "RESTRAINT"), ("FE Location", "FE"), ("WEX Location", "WEX")):
                    location = get_value(row, headers, header)
                    if location is not None and str(location).strip():
                        equipment.append({"code": code, "location": str(location).strip()})
                summary = {
                    "airfile": airfile, "variant": variant, "family": family, "manufacturer": manufacturer,
                    "configName": str(get_value(row, headers, "Configuration") or f"{len(classes)} Class"),
                    "classCount": len(classes), "classes": classes, "seatBreakdown": breakdown,
                    "totalSeats": get_value(row, headers, "Total Passenger Seats"),
                    "crew": {
                        "legalMinimum": get_value(row, headers, "Legal Minimum Crew"),
                        "requiredSeats": list(range(1, int(get_value(row, headers, "Legal Minimum Crew") or 0) + 1)),
                        "totalCrewSeats": get_value(row, headers, "Crew Seats"),
                        "standardCrewCompliment": get_value(row, headers, "Normal Crew Complement"),
                        "spareCrewSeats": spare_seats(get_value(row, headers, "Number of Spare Crew Seats"), get_value(row, headers, "Location of Spare Crew Seats")),
                    },
                    "includesRestFacilities": bool(rest_types), "restTypes": rest_types,
                    "flightCrewRest": next((code for code in rest_types if rest_lookup[code] == "flightCrewRest"), None),
                    "cabinCrewRest": next((code for code in rest_types if rest_lookup[code] == "cabinCrewRest"), None),
                    "emergencyEquipmentSummary": equipment,
                }
            else:
                summary = {"airfile": airfile, "variant": variant, "family": family, "manufacturer": manufacturer, "configName": "Shorthaul", "classCount": 2, "classes": ["J", "M"], "seatBreakdown": None, "totalSeats": get_value(row, headers, "Seats"), "crew": None, "includesRestFacilities": False, "restTypes": [], "flightCrewRest": None, "cabinCrewRest": None, "emergencyEquipmentSummary": []}
            summaries[haul].append(summary)
    workbook.close()
    return summaries


def update_aircraft_file(project_root: Path, summaries: dict[str, list[dict]]) -> None:
    aircraft_path = project_root / "data" / "aircraft.js"
    assignments = []
    longhaul_codes, shorthaul_codes = [], []
    for haul in ("longhaul", "shorthaul"):
        codes = longhaul_codes if haul == "longhaul" else shorthaul_codes
        for summary in summaries[haul]:
            code = summary["airfile"]
            codes.append(code)
            selector_sub = f'{summary["variant"]} · {summary["configName"]}' if haul == "longhaul" else f'{summary["variant"]} · {summary["totalSeats"]} seats'
            generated = {
                "code": "SH Airbus" if haul == "shorthaul" and summary["manufacturer"] == "Airbus" else code,
                "airfile": code, "haul": haul, "fullName": summary["variant"], "shortName": summary["family"],
                "family": summary["family"], "variant": summary["variant"], "manufacturer": summary["manufacturer"],
                "configName": summary["configName"], "classCount": summary["classCount"], "classes": summary["classes"],
                "includesRestFacilities": summary["includesRestFacilities"], "restTypes": summary["restTypes"],
                "flightCrewRest": summary["flightCrewRest"], "cabinCrewRest": summary["cabinCrewRest"],
                "totalSeats": summary["totalSeats"], "seatBreakdown": summary["seatBreakdown"],
                "crew": summary["crew"], "emergencyEquipmentSummary": summary["emergencyEquipmentSummary"],
                "dataFile": f"{code}.js" if haul == "longhaul" else None,
                "dataPath": f"data/aircraft/{code}.js" if haul == "longhaul" else None,
                "briefingTitle": f'{summary["variant"]} Briefing',
                "selectorLabel": code,
                "selectorSubLabel": selector_sub,
            }
            assignments.append(f"globalThis.AIRCRAFT[{json.dumps(code)}] = {json.dumps(generated, ensure_ascii=False, indent=2)};")
    all_codes = longhaul_codes + shorthaul_codes
    block = "/* Generated from the fleet workbook by scripts/generate-aircraft-registrations.py. */\n"
    block += "globalThis.AIRCRAFT = {};\n\n" + AIRFILE_MARKER_START + "\n"
    block += "// Generated aircraft summaries share a single source: the fleet workbook.\n"
    block += "\n".join(assignments) + "\n"
    block += "globalThis.AIRCRAFT_ORDER_LONGHAUL = " + json.dumps(longhaul_codes) + ";\n"
    block += "globalThis.AIRCRAFT_ORDER_SHORTHAUL = " + json.dumps(shorthaul_codes) + ";\n"
    block += "globalThis.AIRCRAFT_ORDER = " + json.dumps(all_codes) + ";\n"
    block += "globalThis.AIRFILE_ORDER = " + json.dumps(all_codes) + ";\n"
    block += AIRFILE_MARKER_END + "\n"
    aircraft_path.write_text(block, encoding="utf-8", newline="\n")


def remove_shared_summary_from_aor(project_root: Path, summaries: dict[str, list[dict]]) -> None:
    """Keep workbook-owned aircraft summary data in aircraft.js, not duplicated in AOR files."""
    for summary in summaries["longhaul"]:
        path = project_root / "data" / "aircraft" / f'{summary["airfile"]}.js'
        if not path.exists():
            continue
        source = path.read_text(encoding="utf-8")
        source = re.sub(r'(?m)^\s{2}(?:"variantNotes"|variantNotes):.*?,\r?\n', "", source)
        source = re.sub(r'(?m)^\s{2}(?:"aircraftName"|aircraftName):.*?,\r?\n', "", source)
        source = re.sub(r'(?m)^\s{2}(?:"configName"|configName):.*?,\r?\n', "", source)
        source = re.sub(r'(?ms)^\s{2}(?:"config"|config):\s*\{.*?^\s{2}\},\r?\n', "", source)
        source = re.sub(r'(?ms)^\s{2}(?:"crew"|crew):\s*\{.*?^\s{2}\},\r?\n', "", source)
        source = re.sub(r'(?ms)^[ \t]{4}(?:"emergencyEquipmentSummary"|emergencyEquipmentSummary):[ \t]*\[.*?^[ \t]{4}\],[ \t]*\r?\n', "", source)
        source = re.sub(r'(?m)^[ \t]{4}(?:"emergencyEquipmentSummary"|emergencyEquipmentSummary):[ \t]*\[\],[ \t]*\r?\n', "", source)
        path.write_text(source, encoding="utf-8", newline="\n")


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]
    default_workbook = project_root.parent / SOURCE_NAME
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workbook", nargs="?", type=Path, default=default_workbook)
    parser.add_argument("--output", type=Path, default=project_root / "data" / "aircraft-registrations.js")
    args = parser.parse_args()
    if not args.workbook.is_file():
        raise SystemExit(f"Workbook not found: {args.workbook}")

    records = load_registration_records(args.workbook)
    summaries = read_type_summaries(args.workbook)
    update_aircraft_file(project_root, summaries)
    remove_shared_summary_from_aor(project_root, summaries)
    registrations = list(records)
    output = f'''/* Generated from the BA fleet register. Run scripts/generate-aircraft-registrations.py to refresh. */
globalThis.AIRCRAFT_REGISTRATION_SOURCE = Object.freeze({{
  file: {json.dumps(SOURCE_NAME)},
  asOf: {json.dumps(SOURCE_AS_OF)},
  registrationCount: {len(records)}
}});

globalThis.AIRCRAFT_REGISTRATIONS = Object.freeze({json.dumps(records, ensure_ascii=False, indent=2)});
globalThis.AIRCRAFT_REGISTRATION_ORDER = Object.freeze({json.dumps(registrations, ensure_ascii=False, indent=2)});

globalThis.getAircraftByRegistration = function (value) {{
  const compact = String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const candidates = compact.startsWith("G") ? [compact, compact.slice(1)] : [compact];
  const registration = candidates.find((candidate) => globalThis.AIRCRAFT_REGISTRATIONS[candidate]);
  if (!registration) return null;
  const record = globalThis.AIRCRAFT_REGISTRATIONS[registration];
  return {{ ...record, aircraft: globalThis.AIRCRAFT?.[record.airfile] || null }};
}};
'''
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(output, encoding="utf-8", newline="\n")
    print(f"Wrote {len(records)} registrations and summaries for {len(summaries['longhaul']) + len(summaries['shorthaul'])} aircraft types")


if __name__ == "__main__":
    main()
