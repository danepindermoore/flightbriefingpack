globalThis.AOR_351 = {
  aircraftCode: "351",
  aircraftName: "A350",
  configName: "3 Class",
  diagram: {
    image: "../assets/aircraft/351.png",
    viewBox: { width: 380, height: 818 },
    fuselageClipPath: "M190 10 C180 18 172 34 167 58 L157 102 Q153 116 153 136 V684 Q153 728 173 746 Q181 752 190 753 Q199 752 207 746 Q227 728 227 684 V136 Q227 116 223 102 L213 58 C208 34 200 18 190 10 Z",
    aorAreaIds: {
      "Club Kitchen / D2L to AFT CW Cabin AE side": ["cw-left-aft"],
      "FWD WTP to D3L AB side and 2 x Toilets at D3L": ["wtp-left", "wt-left-forward"],
      "D3L to D4L ABC side, CCRC and 1 x Toilet at D4L": ["wt-left"],
      "CW Galley, FCRC and 1 x Toilet AFT of the Flight Deck": ["front-galley"],
      "D1R to D2R FK side and 1 x Toilet at D2R": ["cw-right-full"],
      "FWD WTP JK side to D3R and 2 x Toilets at D3R": ["wtp-right", "wt-right-forward"],
      "WT Galley and 1 x Toilet at D4R": ["aft-galley"],
      "D2R to AFT CW cabin FK side": ["cw-right-aft"],
      "D1L to D2L and 1 x Toilet at D2L": ["cw-left-forward"],
      "D3R to D4R": ["wt-right"]
    },
    aorShapes: {
      "front-galley": "M165 67 Q158 82 154 118 L226 118 Q222 82 215 67 Z",
      "cw-left-forward": "M156 116 C154 156 152 218 153 266 L173 268 L174 279 Q181 282 188 280 L189 117 Z",
      "cw-right-full": "M189 117 L189 266 L190 280 Q197 282 204 279 L204 268 L224 266 C225 218 223 156 222 116 Z",
      "cw-left-aft": "M153 267 L173 269 L174 280 Q181 283 188 281 L189 342 L158 342 Q154 339 153 329 Z",
      "cw-right-aft": "M204 267 L224 267 C225 292 225 320 225 342 L189 342 L189 281 Q197 283 203 280 Z",
      "wtp-left": "M154 342 C153 369 153 405 154 432 L187.5 432 L187.5 342 Z",
      "wtp-right": "M187.5 342 L187.5 432 L226 432 C227 405 227 369 226 342 Z",
      "wt-left-forward": "M154 432 C154 458 154 484 155 508 L187.5 508 L187.5 432 Z",
      "wt-right-forward": "M187.5 432 L187.5 508 L225 508 C226 484 226 458 226 432 Z",
      // Keep No. 4 as one continuous custom path, including the marked door
      // pocket and left toilet while stopping before the grey galley.
      "wt-left": "M153 508 L190 508 L190 678 Q190 684 184 688 L166 689 L181 689 L181 700 Q181 708 170 714 L170 725 Q170 728 166 728 Q161 728 160 724 L157 713 Q157 708 155 704 L153 689 Z",
      "wt-right": "M187.5 508 L187.5 689 L221 689 C225 635 225 559 225 508 Z",
      // No. 8 follows No. 4's boundary without covering any of its area.
      "aft-galley": "M181 689 L198 689 L198 684 Q198 679 202 679 L212 679 Q216 679 216 684 L216 689 Q220 711 210 731 Q203 742 190 742 Q177 742 170 731 L170 714 Q181 708 181 700 Z"
    },
    demoPoints: {
      10: [174, 128], 5: [204, 153], 12: [172, 199], 6: [205, 221],
      2: [174, 302], 9: [203, 302], 3: [172, 362], 7: [203, 444],
      4: [174, 520], 11: [204, 520]
    },
    positionPanels: {
      1: { x: 16, y: 32, w: 116, h: 62 }, 10: { x: 16, y: 103, w: 114, h: 61 },
      2: { x: 16, y: 269, w: 114, h: 64 }, 3: { x: 16, y: 498, w: 114, h: 64 },
      4: { x: 16, y: 684, w: 114, h: 64 }, 11: { x: 16, y: 752, w: 114, h: 62 },
      5: { x: 252, y: 31, w: 114, h: 64 }, 6: { x: 252, y: 269, w: 114, h: 64 },
      9: { x: 252, y: 342, w: 114, h: 64 }, 7: { x: 252, y: 498, w: 114, h: 64 },
      8: { x: 252, y: 684, w: 114, h: 64 }, 12: { x: 252, y: 752, w: 114, h: 62 }
    }
  },
  variantNotes: "FCRC and CCRC",
  config: {
    clubWorld: 56,
    worldTravellerPlus: 56,
    worldTraveller: 219,
    totalSeats: 331
  },
  crew: {
    legalMinimum: 8,
    requiredSeats: [1, 2, 3, 4, 5, 6, 7, 8],
    totalCrewSeats: 13,
    standardCrewCompliment: 12,
    spareCrewSeats: [
      {
        seat: "D1L",
        facing: "FWD",
        note: "Spare crew seat"
      }
    ]
  },
  importantInfo: {
    emergencyEquipmentSummary: [
      { code: "AED", location: "D2R" },
      { code: "M5", location: "D2R" },
      { code: "RES", location: "D2R" },
      { code: "FE", location: "All RHD + D4L" },
      { code: "WEX", location: "D2R + D3R" }
    ],
    notes: [
      "WTP Pre-Take Off Service is delivered by the the No. 4 and No. 11.",
      "If No. 3 is GCC position, IFR to be allocated to No. 11."
    ]
  },
  positions: [
    {
      number: 1,
      title: "SCCM",
      role: "IFM",
      displayTitle: "No 1 - SCCM - IFM",
      service: {
        summary: "Overall responsibility for all cabins, works in CW cabin serving 1AE-7AE",
        cabin: ["CW"]
      },
      seating: {
        seat: "D1L",
        descriptor: "Inboard",
        facing: "AFT",
        full: "D1L: Inboard AFT Facing"
      },
      doorResponsibility: "D1L",
      demo: {
        position: null,
        pointsOut: []
      },
      aor: {
        hasAor: false,
        area: null
      },
      rest: "2nd Rest",
      additionalResponsibilities: [
        "Check the spare crew seat at D1L FWD Facing",
        "Boarding responsibility alongside number 3",
        "Responsible for all cabin PAs"
      ],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "PO", qty: 1, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "EW", qty: 2, locationType: "area" },
        { code: "MP", qty: 1, locationType: "area" },
        { code: "P.H2O", qty: 1, locationType: "area" },
        { code: "ELT", qty: 1, locationType: "area" },
        { code: "NC", qty: 3, locationType: "area" },
        { code: "S EXT", qty: 10, locationType: "area" }
      ]
    },
    {
      number: 2,
      title: "GCC 1",
      role: null,
      displayTitle: "No 2 - GCC 1",
      service: {
        summary: "Works in CW cabin serving 17AE-8AE",
        cabin: ["CW"]
      },
      seating: {
        seat: "D2L",
        descriptor: null,
        facing: "AFT",
        full: "D2L: AFT Facing"
      },
      doorResponsibility: "D2L",
      demo: {
        position: "Front of AFT Club World cabin AE side",
        pointsOut: ["D3LR", "D2LR"]
      },
      aor: {
        hasAor: true,
        area: "Club Kitchen / D2L to AFT CW Cabin AE side"
      },
      rest: "1st Rest",
      additionalResponsibilities: [],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "PO", qty: 4, locationType: "area" },
        { code: "TO", qty: 3, locationType: "area" }
      ]
    },
    {
      number: 3,
      title: "GCC 2",
      role: null,
      displayTitle: "No 3 - GCC 2",
      service: {
        summary: "Works in WTP & WT cabin serving AB side",
        cabin: ["WTP", "WT"]
      },
      seating: {
        seat: "D3L",
        descriptor: null,
        facing: "AFT",
        full: "D3L: AFT Facing"
      },
      doorResponsibility: "D3L",
      demo: {
        position: "Front of WTP cabin AB side",
        pointsOut: ["D3LR", "D2LR"]
      },
      aor: {
        hasAor: true,
        area: "FWD WTP to D3L AB side and 2 x Toilets at D3L"
      },
      rest: "2nd Rest",
      additionalResponsibilities: [
        "Boarding responsibility alongside number 1",
        "InFlight Retail (IFR)",
        "If GCC position 2 is allocated to number 3 then IFR is reallocated to number 11"
      ],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "PO", qty: 3, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "EXT", qty: 10, locationType: "area" },
        { code: "SP", qty: 2, locationType: "area" },
        { code: "LJ", qty: 10, locationType: "area" },
        { code: "EXT", qty: 5, locationType: "area" },
        { code: "ILJ", qty: 10, locationType: "area" },
        { code: "LCO", qty: 3, locationType: "area" }
      ]
    },
    {
      number: 4,
      title: "ASCCM",
      role: "IFL",
      displayTitle: "No 4 - ASCCM - IFL",
      service: {
        summary: "Overall responsibility for WT & WTP cabins, works in WT cabin or operates the WT Galley, WTP Pre-Take Off Service JK side",
        cabin: ["WT", "WTP"]
      },
      seating: {
        seat: "D4L",
        descriptor: "Outboard",
        facing: "FWD",
        full: "D4L: Outboard FWD Facing"
      },
      doorResponsibility: "D4L",
      demo: {
        position: "Adjacent to D3L",
        pointsOut: ["D4LR", "D3LR"]
      },
      aor: {
        hasAor: true,
        area: "D3L to D4L ABC side, CCRC and 1 x Toilet at D4L"
      },
      rest: "1st Rest",
      additionalResponsibilities: [
        "Remember SEP equipment in the CCRC"
      ],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "PO", qty: 2, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "ET", qty: 2, locationType: "ccrc" },
        { code: "PBE", qty: 2, locationType: "ccrc" },
        { code: "FG", qty: 1, locationType: "ccrc" },
        { code: "FE", qty: 1, locationType: "ccrc" },
        { code: "PO", qty: 1, locationType: "ccrc" },
        { code: "MRT", qty: 1, locationType: "ccrc" }
      ]
    },
    {
      number: 5,
      title: null,
      role: null,
      displayTitle: "No 5",
      service: {
        summary: "Operates the CW Galley, responsible for the Flight Crew service",
        cabin: ["CW"]
      },
      seating: {
        seat: "D1R",
        descriptor: null,
        facing: "FWD",
        full: "D1R: FWD Facing"
      },
      doorResponsibility: "D1R",
      demo: {
        position: "Row 4FK",
        pointsOut: ["D2LR", "D1LR"]
      },
      aor: {
        hasAor: true,
        area: "CW Galley, FCRC and 1 x Toilet AFT of the Flight Deck"
      },
      rest: "2nd Rest",
      additionalResponsibilities: [
        "Remember SEP equipment in the FCRC",
        "Responsible for covering D1LR when aircraft is on the ground",
        "Has boarding responsibility when D1L is being used for boarding"
      ],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "PO", qty: 1, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "SP", qty: 2, locationType: "area" },
        { code: "FE", qty: 1, locationType: "area" },
        { code: "M2", qty: 2, locationType: "area" },
        { code: "ET", qty: 1, locationType: "fcrc" },
        { code: "PBE", qty: 2, locationType: "fcrc" },
        { code: "FG", qty: 1, locationType: "fcrc" },
        { code: "FE", qty: 1, locationType: "fcrc" },
        { code: "MRT", qty: 1, locationType: "fcrc" }
      ]
    },
    {
      number: 6,
      title: null,
      role: null,
      displayTitle: "No 6",
      service: {
        summary: "Works in CW cabin serving 17FK - 8FK",
        cabin: ["CW"]
      },
      seating: {
        seat: "D2R",
        descriptor: null,
        facing: "AFT",
        full: "D2R: AFT Facing"
      },
      doorResponsibility: "D2R",
      demo: {
        position: "Row 9FK",
        pointsOut: ["D2LR", "D1LR"]
      },
      aor: {
        hasAor: true,
        area: "D1R to D2R FK side and 1 x Toilet at D2R"
      },
      rest: "1st Rest",
      additionalResponsibilities: [
        "Responsible for covering D2LR when aircraft is on the ground if no-one is stationed at D2L for boarding"
      ],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "PO", qty: 3, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "SP", qty: 2, locationType: "area" },
        { code: "WEX", qty: 1, locationType: "area" },
        { code: "WCH", qty: 1, locationType: "area" },
        { code: "AED", qty: 1, locationType: "area" },
        { code: "M5", qty: 1, locationType: "area" },
        { code: "RES", qty: 1, locationType: "area" },
        { code: "PRM", qty: 1, locationType: "area" }
      ]
    },
    {
      number: 7,
      title: "GCC 3",
      role: null,
      displayTitle: "No 7 - GCC 3",
      service: {
        summary: "Works in WT cabin serving HJK side",
        cabin: ["WT"]
      },
      seating: {
        seat: "D3R",
        descriptor: null,
        facing: "AFT",
        full: "D3R: AFT Facing"
      },
      doorResponsibility: "D3R",
      demo: {
        position: "Front of FWD WT cabin HJK side",
        pointsOut: ["D3LR", "D2LR"]
      },
      aor: {
        hasAor: true,
        area: "FWD WTP JK side to D3R and 2 x Toilets at D3R"
      },
      rest: "1st Rest",
      additionalResponsibilities: [
        "Responsible for Community Fund / Flying Start Charity Collection",
        "Responsible for covering D3LR when aircraft is on the ground"
      ],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "PO", qty: 4, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "WEX", qty: 1, locationType: "area" },
        { code: "LCO", qty: 9, locationType: "area" },
        { code: "FE", qty: 1, locationType: "area" },
        { code: "EXT", qty: 5, locationType: "area" },
        { code: "ILJ", qty: 10, locationType: "area" }
      ]
    },
    {
      number: 8,
      title: null,
      role: null,
      displayTitle: "No 8",
      service: {
        summary: "Operates the WT & WTP Galley, responsibility for PAs or PRAs",
        cabin: ["WT", "WTP"]
      },
      seating: {
        seat: "D4R",
        descriptor: "Outboard",
        facing: "FWD",
        full: "D4R: Outboard FWD Facing"
      },
      doorResponsibility: "D4R",
      demo: {
        position: null,
        pointsOut: []
      },
      aor: {
        hasAor: true,
        area: "WT Galley and 1 x Toilet at D4R"
      },
      rest: "2nd Rest",
      additionalResponsibilities: [
        "Responsible for covering D4LR when aircraft is on the ground"
      ],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "SP", qty: 2, locationType: "area" },
        { code: "JEM", qty: 1, locationType: "area" },
        { code: "ELT", qty: 1, locationType: "area" },
        { code: "MP", qty: 1, locationType: "area" },
        { code: "RK", qty: 2, locationType: "area" },
        { code: "M2", qty: 2, locationType: "area" }
      ]
    },
    {
      number: 9,
      title: null,
      role: null,
      displayTitle: "No 9",
      service: {
        summary: "Works in WTP & WT cabin serving JK side",
        cabin: ["WTP", "WT"]
      },
      seating: {
        seat: "D2R",
        descriptor: null,
        facing: "FWD",
        full: "D2R: FWD Facing"
      },
      doorResponsibility: null,
      demo: {
        position: "Front of AFT Club World cabin FK side",
        pointsOut: ["D3LR", "D2LR"]
      },
      aor: {
        hasAor: true,
        area: "D2R to AFT CW cabin FK side"
      },
      rest: "1st Rest",
      additionalResponsibilities: [],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "FE", qty: 1, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" }
      ]
    },
    {
      number: 10,
      title: "GCC 4",
      role: null,
      displayTitle: "No 10 - GCC 4",
      service: {
        summary: "Works in CW cabin serving 1FK - 7FK",
        cabin: ["CW"]
      },
      seating: {
        seat: "D1L",
        descriptor: "Outboard",
        facing: "AFT",
        full: "D1L: Outboard AFT Facing"
      },
      doorResponsibility: null,
      demo: {
        position: "Row 1AE",
        pointsOut: ["D2LR", "D1LR"]
      },
      aor: {
        hasAor: true,
        area: "D1L to D2L and 1 x Toilet at D2L"
      },
      rest: "2nd Rest",
      additionalResponsibilities: [],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "ILJ", qty: 5, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" }
      ]
    },
    {
      number: 11,
      title: null,
      role: null,
      displayTitle: "No 11",
      service: {
        summary: "Works in WT cabin serving ABC side, WTP Pre-Take Off Service AB side",
        cabin: ["WT", "WTP"]
      },
      seating: {
        seat: "D4L",
        descriptor: "Inboard",
        facing: "FWD",
        full: "D4L: Inboard FWD Facing"
      },
      doorResponsibility: null,
      demo: {
        position: "Adjacent to D3R",
        pointsOut: ["D4LR", "D3LR"]
      },
      aor: {
        hasAor: true,
        area: "D3R to D4R"
      },
      rest: "1st Rest",
      additionalResponsibilities: [
        "If GCC position 2 is allocated to number 3 then IFR responsibility is reallocated to number 11"
      ],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "DEM", qty: 1, locationType: "area" },
        { code: "FE", qty: 1, locationType: "area" }
      ]
    },
    {
      number: 12,
      title: null,
      role: null,
      displayTitle: "No 12",
      service: {
        summary: "Works in WT cabin serving HJK side, assists with CW cabin pre-departure service",
        cabin: ["WT", "CW"]
      },
      seating: {
        seat: "D4R",
        descriptor: "Inboard",
        facing: "FWD",
        full: "D4R: Inboard FWD Facing"
      },
      doorResponsibility: null,
      demo: {
        position: "Row 7AE",
        pointsOut: ["D2LR", "D1LR"]
      },
      aor: {
        hasAor: false,
        area: null
      },
      rest: "2nd Rest",
      additionalResponsibilities: [],
      equipmentChecks: [
        { code: "ET", qty: 1, locationType: "seat" },
        { code: "HVT", qty: 1, locationType: "seat" },
        { code: "PBE", qty: 1, locationType: "seat" },
        { code: "LJ", qty: 1, locationType: "seat" },
        { code: "FG", qty: 1, locationType: "seat" },
        { code: "MRT", qty: 1, locationType: "seat" },
        { code: "FE", qty: 1, locationType: "area" },
        { code: "DEM", qty: 1, locationType: "area" }
      ]
    }
  ]
};
