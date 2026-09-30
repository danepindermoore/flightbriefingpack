#!/usr/bin/env python3
"""Generate the static registration lookup from the BA fleet workbook.

Requires openpyxl for this maintenance script only. The website itself loads
the generated JavaScript and does not need Python or an Excel parser.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from openpyxl import load_workbook


SOURCE_NAME = "British_Airways_Fleet_September_2026_Registrations.xlsx"
SOURCE_AS_OF = "2026-09"
REGISTRATION_SHEETS = (
    ("Longhaul Registrations", "longhaul"),
    ("Shorthaul Registrations", "shorthaul"),
)
AIRFILE_MARKER_START = "// BEGIN GENERATED AIRFILE DATA"
AIRFILE_MARKER_END = "// END GENERATED AIRFILE DATA"


def yes_no(value: object) -> bool | None:
    if value is None or str(value).strip() == "":
        return None
    normalized = str(value).strip().casefold()
    if normalized in {"yes", "y", "true", "1"}:
        return True
    if normalized in {"no", "n", "false", "0"}:
        return False
    raise ValueError(f"Unexpected yes/no value: {value!r}")


def normalise_header(value: object) -> str:
    return " ".join(str(value or "").strip().casefold().split())


def get_value(row: tuple, headers: dict[str, int], name: str, *aliases: str):
    for candidate in (name, *aliases):
        index = headers.get(normalise_header(candidate))
        if index is not None:
            return row[index] if index < len(row) else None
    return None


def get_cabin_value(row: tuple, headers: dict[str, int], cabin_name: str):
    for header, index in headers.items():
        if header.endswith(cabin_name):
            return row[index] if index < len(row) else None
    return None


def load_registration_records(workbook_path: Path) -> dict[str, dict]:
    workbook = load_workbook(workbook_path, read_only=True, data_only=True)
    records: dict[str, dict] = {}

    for sheet_name, haul in REGISTRATION_SHEETS:
        sheet = workbook[sheet_name]
        rows = sheet.iter_rows(values_only=True)
        next(rows)  # title row
        header_row = next(rows)
        headers = {normalise_header(value): i for i, value in enumerate(header_row) if value is not None}

        for row in rows:
            registration = get_value(row, headers, "Registration")
            if registration is None or not str(registration).strip():
                continue

            registration = str(registration).strip().upper()
            if registration in records:
                raise ValueError(f"Duplicate registration found across workbook sheets: {registration}")

            record = {
                "registration": registration,
                "haul": haul,
                "baseSection": get_value(row, headers, "Base / section", "Base / Section"),
                "aircraftVariant": get_value(row, headers, "Aircraft / variant", "Aircraft / Variant"),
                "flightDeck": get_value(row, headers, "Flight Deck"),
                "airfile": str(get_value(row, headers, "Airfile") or "").strip(),
                "mtow": get_value(row, headers, "MTOW"),
                "seatCount": get_value(row, headers, "Seats"),
                "wifiEnabled": yes_no(get_value(row, headers, "Wi-Fi enabled")),
                "starlinkEnabled": yes_no(get_value(row, headers, "Starlink enabled")),
                "livery": get_value(row, headers, "Livery"),
                "newShorthaulSeat": yes_no(get_value(row, headers, "New SH seat")),
                "xlOverheadBins": yes_no(get_value(row, headers, "XL overhead bins")),
                "sourceNotes": get_value(row, headers, "Comments / source notes"),
            }

            if not record["airfile"]:
                raise ValueError(f"No Airfile code for registration {registration}")

            # Longhaul sheet columns contain extra type and cabin information.
            if haul == "longhaul":
                record["flightCrewBunks"] = yes_no(get_value(row, headers, "FC Bunks"))
                record["cabinCrewBunks"] = yes_no(get_value(row, headers, "CC Bunks"))
                record["seatBreakdown"] = {
                    "first": get_cabin_value(row, headers, "first"),
                    "clubWorld": get_cabin_value(row, headers, "club world"),
                    "worldTravellerPlus": get_cabin_value(row, headers, "world traveller plus"),
                    "worldTraveller": get_cabin_value(row, headers, "world traveller"),
                }
                record["product"] = get_value(row, headers, "Product")
                record["catering"] = get_value(row, headers, "Catering")

            records[registration] = record

    return records


def read_type_summaries(workbook_path: Path) -> dict[str, list[dict]]:
    workbook = load_workbook(workbook_path, read_only=True, data_only=True)
    summaries: dict[str, list[dict]] = {"longhaul": [], "shorthaul": []}

    for sheet_name, haul in (("Long Haul", "longhaul"), ("Short Haul", "shorthaul")):
        sheet = workbook[sheet_name]
        rows = sheet.iter_rows(values_only=True)
        header_row = None
        for candidate in rows:
            if any(normalise_header(value) == "airfile" for value in candidate if value is not None):
                header_row = candidate
                break
        if header_row is None:
            raise ValueError(f"No Airfile header found in worksheet {sheet_name!r}")
        headers = {normalise_header(value): i for i, value in enumerate(header_row) if value is not None}

        for row in rows:
            airfile = get_value(row, headers, "Airfile")
            if airfile is None or not str(airfile).strip():
                continue

            variant = str(get_value(row, headers, "Aircraft / Variant", "Aircraft / variant") or "").strip()
            family_match = re.search(r"[AB]\d{3}", variant.upper())
            family = family_match.group(0) if family_match else variant
            manufacturer = "Airbus" if family.startswith("A") else "Boeing" if family.startswith("B") else "Unknown"
            record = {
                "airfile": str(airfile).strip(),
                "variant": variant,
                "family": family,
                "manufacturer": manufacturer,
                "flightDeck": get_value(row, headers, "Flight Deck"),
                "mtow": get_value(row, headers, "MTOW"),
                "totalSeats": get_value(row, headers, "Seats"),
            }

            if haul == "longhaul":
                class_columns = (
                    ("first", "First", "F"),
                    ("clubWorld", "club world", "CW"),
                    ("worldTravellerPlus", "world traveller plus", "WTP"),
                    ("worldTraveller", "world traveller", "WT"),
                )
                seat_breakdown = {}
                classes = []
                for property_name, header_part, cabin_code in class_columns:
                    value = get_cabin_value(row, headers, header_part)
                    seat_breakdown[property_name] = value
                    if isinstance(value, (int, float)) and value > 0:
                        classes.append(cabin_code)

                flight_bunks = yes_no(get_value(row, headers, "FC Bunks"))
                cabin_bunks = yes_no(get_value(row, headers, "CC Bunks"))
                rest_types = []
                if flight_bunks:
                    rest_types.append("OFCR" if manufacturer == "Airbus" else "FCRC")
                if cabin_bunks:
                    rest_types.append("OFAR" if manufacturer == "Airbus" else "CCRC")

                record.update({
                    "configName": f"{len(classes)} Class",
                    "classCount": len(classes),
                    "classes": classes,
                    "seatBreakdown": seat_breakdown,
                    "includesRestFacilities": bool(rest_types),
                    "restTypes": rest_types,
                    "flightCrewRest": rest_types[0] if flight_bunks else None,
                    "cabinCrewRest": rest_types[-1] if cabin_bunks else None,
                    "product": get_value(row, headers, "Product"),
                })
            else:
                record.update({
                    "configName": "Shorthaul",
                    "classCount": None,
                    "classes": [],
                    "seatBreakdown": None,
                    "includesRestFacilities": None,
                    "restTypes": [],
                    "flightCrewRest": None,
                    "cabinCrewRest": None,
                    "product": None,
                })

            summaries[haul].append(record)

    return summaries


def generated_airfile_record(record: dict, haul: str) -> dict:
    airfile = record["airfile"]
    family = record["family"]
    short_name = family
    if family.startswith("A"):
        code = "SH Airbus" if haul == "shorthaul" else airfile
    else:
        code = airfile

    seat_text = f'{record["totalSeats"]} seats' if record["totalSeats"] is not None else ""
    selector_sub_label = record["variant"]
    if haul == "longhaul":
        selector_sub_label = f'{record["variant"]} · {record["configName"]}'
    elif seat_text:
        selector_sub_label = f'{record["variant"]} · {seat_text}'

    rest_summary = "Includes " + " + ".join(record["restTypes"]) if record["restTypes"] else None
    notes = [rest_summary] if rest_summary else []
    if record.get("product"):
        notes.append(f'Product: {record["product"]}')
    if haul == "shorthaul":
        notes.append("Cabin-class split is not listed in the fleet register.")

    return {
        "code": code,
        "airfile": airfile,
        "haul": haul,
        "fullName": record["variant"],
        "shortName": short_name,
        "family": family,
        "variant": record["variant"],
        "manufacturer": record["manufacturer"],
        "configName": record["configName"],
        "classCount": record["classCount"],
        "classes": record["classes"],
        "includesRestFacilities": record["includesRestFacilities"],
        "restTypes": record["restTypes"],
        "flightCrewRest": record["flightCrewRest"],
        "cabinCrewRest": record["cabinCrewRest"],
        "dataFile": None,
        "dataPath": None,
        "briefingTitle": f'{record["variant"]} Briefing',
        "selectorLabel": airfile,
        "selectorSubLabel": selector_sub_label,
        "flightDeck": record["flightDeck"],
        "mtow": record["mtow"],
        "totalSeats": record["totalSeats"],
        "seatBreakdown": record["seatBreakdown"],
        "notes": notes,
    }


def update_aircraft_file(project_root: Path, summaries: dict[str, list[dict]]) -> None:
    aircraft_path = project_root / "data" / "aircraft.js"
    source = aircraft_path.read_text(encoding="utf-8")
    marker_start = source.find(AIRFILE_MARKER_START)
    marker_end = source.find(AIRFILE_MARKER_END)
    if (marker_start == -1) != (marker_end == -1):
        raise ValueError("Generated Airfile section has only one marker; refusing to overwrite aircraft.js")
    if marker_start != -1:
        marker_end += len(AIRFILE_MARKER_END)
        base_source = source[:marker_start] + source[marker_end:]
    else:
        base_source = source

    base_keys = set(re.findall(r'^\s*"([^"]+)"\s*:\s*\{', base_source, re.MULTILINE))
    generated_records = {}
    for haul in ("longhaul", "shorthaul"):
        for record in summaries[haul]:
            if record["airfile"] not in base_keys:
                generated_records[record["airfile"]] = generated_airfile_record(record, haul)

    longhaul_codes = [record["airfile"] for record in summaries["longhaul"]]
    shorthaul_codes = [record["airfile"] for record in summaries["shorthaul"]]
    all_codes = longhaul_codes + shorthaul_codes

    block = "\n\n" + AIRFILE_MARKER_START + "\n"
    block += "// Missing type records are derived from the workbook; detailed cabin-layout files remain separate.\n"
    block += "Object.assign(globalThis.AIRCRAFT, " + json.dumps(generated_records, ensure_ascii=False, indent=2) + ");\n"
    block += "globalThis.AIRCRAFT_ORDER_LONGHAUL = " + json.dumps(longhaul_codes, ensure_ascii=False, indent=2) + ";\n"
    block += "globalThis.AIRCRAFT_ORDER_SHORTHAUL = " + json.dumps(shorthaul_codes, ensure_ascii=False, indent=2) + ";\n"
    block += "globalThis.AIRFILE_ORDER = " + json.dumps(all_codes, ensure_ascii=False, indent=2) + ";\n"
    block += AIRFILE_MARKER_END + "\n"

    # Keep generated data after the curated type records and existing selector list.
    base_source = base_source.rstrip() + block
    aircraft_path.write_text(base_source, encoding="utf-8", newline="\n")


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

    ordered_registrations = list(records)
    output = """/* Generated from the BA fleet register. Run scripts/generate-aircraft-registrations.py to refresh. */
globalThis.AIRCRAFT_REGISTRATION_SOURCE = Object.freeze({
  file: %s,
  asOf: %s,
  registrationCount: %d
});

globalThis.AIRCRAFT_REGISTRATIONS = Object.freeze(%s);
globalThis.AIRCRAFT_REGISTRATION_ORDER = Object.freeze(%s);

globalThis.getAircraftByRegistration = function (value) {
  const compact = String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const candidates = compact.startsWith("G") ? [compact, compact.slice(1)] : [compact];
  const registration = candidates.find((candidate) => globalThis.AIRCRAFT_REGISTRATIONS[candidate]);
  if (!registration) return null;

  const record = globalThis.AIRCRAFT_REGISTRATIONS[registration];
  return {
    ...record,
    aircraft: globalThis.AIRCRAFT?.[record.airfile] || null
  };
};
""" % (
        json.dumps(SOURCE_NAME),
        json.dumps(SOURCE_AS_OF),
        len(records),
        json.dumps(records, ensure_ascii=False, indent=2),
        json.dumps(ordered_registrations, ensure_ascii=False, indent=2),
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(output, encoding="utf-8", newline="\n")
    print(f"Wrote {len(records)} registrations to {args.output}")


if __name__ == "__main__":
    main()
