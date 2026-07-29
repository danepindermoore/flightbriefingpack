const baFdpData = (() => {
  // ---------- helpers ----------
  function toMinutes(hhmm) {
    if (typeof hhmm === "number") return hhmm;
    const parts = String(hhmm).split(":");
    if (parts.length !== 2) return null;
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return (h * 60) + m;
  }

  function toHHMM(minutes) {
    if (minutes == null || minutes < 0) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }

  function inBand(value, start, end) {
    // supports overnight bands
    if (start <= end) return value >= start && value <= end;
    return value >= start || value <= end;
  }

  function getSectorIndex(sectors, maxSupported) {
    if (sectors <= 0) return -1;
    if (sectors <= 2) return 0;
    if (sectors > maxSupported) return -1;
    return sectors - 2;
  }

  function lookupBandValue(bands, timeMinutes, sectors, maxSupportedSectors) {
    const sectorIndex = getSectorIndex(sectors, maxSupportedSectors);
    if (sectorIndex === -1) return null;

    for (let i = 0; i < bands.length; i++) {
      const row = bands[i];
      if (inBand(timeMinutes, row[0], row[1])) {
        const value = row[2 + sectorIndex];
        return value == null ? null : value;
      }
    }
    return null;
  }

  function lookupCabinRest(extendedFdpMinutes, restClass) {
    const classIndex = Number(restClass) - 1;
    if (classIndex < 0 || classIndex > 2) return null;

    for (let i = 0; i < table5.length; i++) {
      const row = table5[i];
      if (extendedFdpMinutes >= row[0] && extendedFdpMinutes <= row[1]) {
        return row[2 + classIndex];
      }
    }
    return null;
  }

  function normalizeCode(value) {
    return String(value || "").trim().toUpperCase();
  }

  function normalizeFleet(value) {
    return String(value || "").trim().toUpperCase();
  }

  function normalizeTerminal(value) {
    return String(value || "").trim().toUpperCase();
  }

  // ---------- raw compact tables ----------
  //
  // Format for table2/table4 rows:
  // [startMinute, endMinute, sectors1to2, sectors3, sectors4, sectors5, sectors6, sectors7, sectors8, sectors9, sectors10]
  //
  // unused columns on table4 are omitted because table4 only supports up to 5 sectors:
  // [startMinute, endMinute, sectors1to2, sectors3, sectors4, sectors5]
  //
  // all times stored in minutes

  const table2 = [
    [360, 809, 780, 750, 720, 690, 660, 630, 600, 570, 540],   // 0600-1329
    [810, 839, 765, 735, 705, 675, 645, 615, 585, 555, 540],   // 1330-1359
    [840, 869, 750, 720, 690, 660, 630, 600, 570, 540, 540],   // 1400-1429
    [870, 899, 735, 705, 675, 645, 615, 585, 555, 540, 540],   // 1430-1459
    [900, 929, 720, 690, 660, 630, 600, 570, 540, 540, 540],   // 1500-1529
    [930, 959, 705, 675, 645, 615, 585, 555, 540, 540, 540],   // 1530-1559
    [960, 989, 690, 660, 630, 600, 570, 540, 540, 540, 540],   // 1600-1629
    [990, 1019, 675, 645, 615, 585, 555, 540, 540, 540, 540],  // 1630-1659
    [1020, 299, 660, 630, 600, 570, 540, 540, 540, 540, 540],  // 1700-0459
    [300, 314, 720, 690, 660, 630, 600, 570, 540, 540, 540],   // 0500-0514
    [315, 329, 735, 705, 675, 645, 615, 585, 555, 540, 540],   // 0515-0529
    [330, 344, 750, 720, 690, 660, 630, 600, 570, 540, 540],   // 0530-0544
    [345, 359, 765, 735, 705, 675, 645, 615, 585, 555, 540]    // 0545-0559
  ];

  // Table 3 is fixed by sector count only
  // [sectors1to2, sectors3, sectors4, sectors5, sectors6, sectors7, sectors8]
  const table3 = [660, 630, 600, 570, 540, 540, 540];

  const table4 = [
    [360, 374, null, null, null, null],  // 0600-0614
    [375, 389, 795, 765, 735, 705],      // 0615-0629
    [390, 404, 810, 780, 750, 720],      // 0630-0644
    [405, 419, 825, 795, 765, 735],      // 0645-0659
    [420, 809, 840, 810, 780, 750],      // 0700-1329
    [810, 839, 825, 795, 765, null],     // 1330-1359
    [840, 869, 810, 780, 750, null],     // 1400-1429
    [870, 899, 795, 765, 735, null],     // 1430-1459
    [900, 929, 780, 750, 720, null],     // 1500-1529
    [930, 959, 765, null, null, null],   // 1530-1559
    [960, 989, 750, null, null, null],   // 1600-1629
    [990, 1019, 735, null, null, null],  // 1630-1659
    [1020, 1049, 720, null, null, null], // 1700-1729
    [1050, 1079, 705, null, null, null], // 1730-1759
    [1080, 1109, 690, null, null, null], // 1800-1829
    [1110, 1139, 675, null, null, null], // 1830-1859
    [1140, 239, null, null, null, null], // 1900-0359
    [240, 254, null, null, null, null],  // 0400-0414
    [255, 269, null, null, null, null],  // 0415-0429
    [270, 284, null, null, null, null],  // 0430-0444
    [285, 299, null, null, null, null],  // 0445-0459
    [300, 314, null, null, null, null],  // 0500-0514
    [315, 329, null, null, null, null],  // 0515-0529
    [330, 344, null, null, null, null],  // 0530-0544
    [345, 359, null, null, null, null]   // 0545-0559
  ];

  // Table 5 rows:
  // [extendedFdpFromMinutes, extendedFdpToMinutes, class1, class2, class3]
  const table5 = [
    [0, 870, 90, 90, 90],         // up to 14:30
    [871, 900, 105, 120, 140],    // 14:31-15:00
    [901, 930, 120, 140, 160],    // 15:01-15:30
    [931, 960, 135, 160, 180],    // 15:31-16:00
    [961, 990, 155, 180, null],   // 16:01-16:30
    [991, 1020, 180, 205, null],  // 16:31-17:00
    [1021, 1050, 205, null, null],// 17:01-17:30
    [1051, 1080, 230, null, null] // 17:31-18:00
  ];

  // ---------- report times ----------
  // Cabin crew only, based on screenshot supplied by user.
  // terminal values use T3 / T5 exactly as shown in the source table.
  // Where no terminal split exists, terminal is stored as "N/A".

  const cabinCrewReportTimes = [
    { dep: "LHR", haul: "LH", fleet: "777/787/A350", terminal: "T5", minutes: 100 },
    { dep: "LHR", haul: "LH", fleet: "777/787/A350", terminal: "T3", minutes: 110 },

    { dep: "LHR", haul: "LH", fleet: "A380", terminal: "T5", minutes: 115 },
    { dep: "LHR", haul: "LH", fleet: "A380", terminal: "T3", minutes: 125 },

    { dep: "LHR", haul: "SH", fleet: "A380", terminal: "T3", minutes: 85 },

    { dep: "LHR", haul: "SH", fleet: "AIRBUS_SINGLE_AISLE", terminal: "T5", minutes: 80 },
    { dep: "LHR", haul: "SH", fleet: "AIRBUS_SINGLE_AISLE", terminal: "T3", minutes: 90 },

    { dep: "LGW", haul: "LH", fleet: "777", terminal: "N/A", minutes: 100 }
  ];

  const awayFromBaseDutyReportRules = {
    LH: 75,
    SH: 60
  };

  function getCabinCrewReportTime({ dep, haul, fleet, terminal }) {
    const depCode = normalizeCode(dep);
    const haulCode = normalizeCode(haul);
    const fleetCode = normalizeFleet(fleet);
    const terminalCode = normalizeTerminal(terminal || "N/A");

    const match = cabinCrewReportTimes.find(row =>
      row.dep === depCode &&
      row.haul === haulCode &&
      row.fleet === fleetCode &&
      row.terminal === terminalCode
    );

    if (!match) {
      return {
        found: false,
        minutes: null,
        time: null
      };
    }

    return {
      found: true,
      minutes: match.minutes,
      time: toHHMM(match.minutes)
    };
  }

  function getAwayFromBaseDutyReportMinutes(haul) {
    const haulCode = normalizeCode(haul);
    return awayFromBaseDutyReportRules[haulCode] ?? null;
  }

  function getAwayFromBaseDutyReportTime(haul) {
    const minutes = getAwayFromBaseDutyReportMinutes(haul);
    return minutes == null
      ? { found: false, minutes: null, time: null }
      : { found: true, minutes, time: toHHMM(minutes) };
  }

  // ---------- public API ----------
  return {
    meta: {
      source: "OM A Section 7 Tables 2, 3, 4 and 5",
      notes: [
        "Table 2 = Maximum Daily FDP - Acclimatised Crew Members",
        "Table 3 = Maximum Daily FDP - Crew Members in an Unknown State of Acclimatisation",
        "Table 4 = Maximum Daily FDP with Extension",
        "Table 5 = Minimum Required In-flight Rest for Cabin Crew Members",
        "Report time table added for cabin crew only, based on supplied Heathrow/Gatwick report-time table"
      ]
    },

    raw: {
      table2,
      table3,
      table4,
      table5,
      cabinCrewReportTimes,
      awayFromBaseDutyReportRules
    },

    utils: {
      toMinutes,
      toHHMM
    },

    getTable2MaxFdp(startTimeHHMM, sectors) {
      const mins = toMinutes(startTimeHHMM);
      if (mins == null) return null;
      const result = lookupBandValue(table2, mins, sectors, 10);
      return result == null ? null : {
        minutes: result,
        time: toHHMM(result)
      };
    },

    getTable3MaxFdp(sectors) {
      const index = getSectorIndex(sectors, 8);
      if (index === -1) return null;
      const result = table3[index];
      return result == null ? null : {
        minutes: result,
        time: toHHMM(result)
      };
    },

    getTable4MaxFdp(startTimeHHMM, sectors) {
      const mins = toMinutes(startTimeHHMM);
      if (mins == null) return null;
      const result = lookupBandValue(table4, mins, sectors, 5);
      if (result == null) {
        return {
          allowed: false,
          minutes: null,
          time: null
        };
      }
      return {
        allowed: true,
        minutes: result,
        time: toHHMM(result)
      };
    },

    getTable5CabinCrewRest(maxExtendedFdpHHMM, restClass) {
      const mins = toMinutes(maxExtendedFdpHHMM);
      if (mins == null) return null;

      const result = lookupCabinRest(mins, restClass);
      if (result == null) {
        return {
          allowed: false,
          minutes: null,
          time: null
        };
      }

      return {
        allowed: true,
        minutes: result,
        time: toHHMM(result)
      };
    },

    getCabinCrewReportTime,

    getAwayFromBaseDutyReportMinutes,

    getAwayFromBaseDutyReportTime
  };
})();