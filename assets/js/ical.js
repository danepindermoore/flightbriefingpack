    const MONTHS = {
      JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
      JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
    };

    const RANKS = ["CCW", "IFL", "IFM"];

    const airportByCode = {
      LHR: { code: "LHR", timeZone: "Europe/London" },
      LGW: { code: "LGW", timeZone: "Europe/London" },
      ...(typeof baDestinations !== "undefined" ? Object.fromEntries(baDestinations.map(a => [a.code, a])) : {})
    };

    function parseISODateParts(isoDate) {
      const [y, m, d] = String(isoDate).split("-").map(Number);
      return { y, m, d };
    }

    function zonedLocalToUtcMs(isoDate, hhmm, timeZone) {
      const { y, m, d } = parseISODateParts(isoDate);
      const hh = Number(String(hhmm).slice(0, 2));
      const mm = Number(String(hhmm).slice(2, 4));

      const utcGuess = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).formatToParts(utcGuess);

      const get = (type) => parts.find(p => p.type === type)?.value;
      const actualY = Number(get("year"));
      const actualM = Number(get("month"));
      const actualD = Number(get("day"));
      const actualH = Number(get("hour"));
      const actualMin = Number(get("minute"));

      const desiredDay = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
      const actualDay = Math.floor(Date.UTC(actualY, actualM - 1, actualD) / 86400000);
      const deltaMinutes = ((desiredDay - actualDay) * 1440) + ((hh * 60 + mm) - (actualH * 60 + actualMin));

      return utcGuess.getTime() + (deltaMinutes * 60000);
    }

    function zonedLocalRangeToUtc(isoDate, startHHMM, endHHMM, timeZone) {
      const startUtcMs = zonedLocalToUtcMs(isoDate, startHHMM, timeZone);
      let endUtcMs = zonedLocalToUtcMs(isoDate, endHHMM, timeZone);
      if (endUtcMs <= startUtcMs) endUtcMs += 86400000;
      return { startUtcMs, endUtcMs };
    }

    const STORAGE_KEYS = {
      importHistory: "rosterCalendar.importHistory.v16",
      lastParsed: "rosterCalendar.lastParsed.v16",
      preferredCalendar: "rosterCalendar.preferredCalendar.v16",
      contractType: "rosterCalendar.contractType.v1",
      firstPTDate: "rosterCalendar.firstPTDate.v1"
    };

    const state = {
      rawText: "",
      rosterYear: null,
      events: [],
      futureDuties: [],
      filteredEvents: [],
      lastExportedEvents: [],
      importHistory: loadImportHistory(),
      dayBlocks: []
    };

    const els = {
      pdfFile: document.getElementById("pdfFile"),
      fileName: document.getElementById("fileName"),
      openCrewlinkBtn: document.getElementById("openCrewlinkBtn"),
      crewlinkFlow: document.getElementById("crewlinkFlow"),
      pastedRosterText: document.getElementById("pastedRosterText"),
      statusBox: document.getElementById("statusBox"),
      statTotal: document.getElementById("statTotal"),
      refreshBtn: document.getElementById("refreshBtn"),      
      downloadBtn: document.getElementById("downloadBtn"),
      clearHistoryBtn: document.getElementById("clearHistoryBtn"),
      previewBody: document.getElementById("previewBody"),
      searchBox: document.getElementById("searchBox"),
      typeFilter: document.getElementById("typeFilter"),
      debugRawText: document.getElementById("debugRawText"),
      debugBlocks: document.getElementById("debugBlocks"),
      contractType: document.getElementById("contractType"),
      firstPTDate: document.getElementById("firstPTDate"),
      futureDutiesContainer: document.getElementById("futureDutiesContainer"),
      addFutureDutyBtn: document.getElementById("addFutureDutyBtn"),
      noFutureDuties: document.getElementById("noFutureDuties"),
    };

    function getPdfjsLib() {
      if (!window.pdfjsLib) {
        throw new Error("PDF engine failed to load. Refresh the page and try again.");
      }
      return window.pdfjsLib;
    }

init();

function init() {

    populateContractTypes();

    loadContractSettings();

    els.contractType.addEventListener(
        "change",
        saveContractSettings
    );

    els.firstPTDate.addEventListener(
        "change",
        saveContractSettings
    );

    els.pdfFile.addEventListener("change", () => {

        const file = els.pdfFile.files[0];

        if (!file) {

            els.fileName.textContent =
                "No file selected";

            return;

        }

        els.fileName.textContent = file.name;

        setStatus(
            "Roster selected. Click 'Upload' to process.",
            "info"
        );

    });


els.refreshBtn.addEventListener(
    "click",
    handleParseClick
);

    els.openCrewlinkBtn.addEventListener(
        "click",
        openCrewlink
    );

    els.addFutureDutyBtn.addEventListener(
        "click",
        addFutureDutyCard
    );

}

function populateContractTypes() {

    els.contractType.innerHTML = "";

    for (const [key, contract] of Object.entries(BA_CONTRACT_TYPES)) {

        const option = document.createElement("option");

        option.value = key;
        option.textContent = contract.label;

        els.contractType.appendChild(option);

    }

}




function addFutureDutyCard() {

    els.noFutureDuties.style.display = "none";

    const card = document.createElement("div");

    card.className = "future-duty-card";

card.futureDuty = {

    type: "ANNUAL_LEAVE",

    startDate: "",

    endDate: "",

    wrapDays: "NONE"

};

   card.innerHTML = `

    <div class="future-duty-header">

        <strong>Future Duty</strong>

        <button
            type="button"
            class="future-duty-delete danger">

            Delete

        </button>

    </div>

    <label>Duty Type</label>

    <select class="future-duty-type"></select>

    <div class="future-duty-fields"></div>
`;


els.futureDutiesContainer.appendChild(card);


populateFutureDutyTypes(card.querySelector(".future-duty-type"));

card.futureDuty.type =
    card.querySelector(".future-duty-type").value;

renderFutureDutyFields(card);


updateWrapDayState(card);


card.querySelector(".future-duty-type").addEventListener("change", event => {

    card.futureDuty.type = event.target.value;


    renderFutureDutyFields(card);

    updateWrapDayState(card);

});



card.addEventListener("change", event => {



 if (
    event.target.classList.contains(
        "future-duty-date"
    )
) {

    card.futureDuty.startDate =
        event.target.value;
const endDateInput =
    card.querySelector(".future-duty-end-date");

if (endDateInput) {

    endDateInput.min = event.target.value;

    endDateInput.value = event.target.value;

    card.futureDuty.endDate = event.target.value;

}

    updateWrapDayState(card);

}


if (
    event.target.classList.contains(
        "future-duty-end-date"
    )
) {

    card.futureDuty.endDate =
        event.target.value;

    updateWrapDayState(card);

}

if (
    event.target.classList.contains(
        "future-duty-wrap-days"
    )
) {

    card.futureDuty.wrapDays =
        event.target.value;

    console.log(card.futureDuty);

}

if (
    event.target.classList.contains(
        "future-duty-days"
    )
) {

    card.futureDuty.days =
        Number(event.target.value);

    updateWrapDayState(card);

    console.log(card.futureDuty);

}
});

card.querySelector(".future-duty-delete").addEventListener(
    "click",
    () => {

        card.remove();

        if (
            !els.futureDutiesContainer.querySelector(
                ".future-duty-card"
            )
        ) {

            els.noFutureDuties.style.display = "";

        }

    }
);

}


function populateFutureDutyTypes(select) {

    select.innerHTML = "";

    const duties = Object.entries(
        BA_FUTURE_DUTY_TYPES
    ).sort(
        (a, b) => a[1].sortOrder - b[1].sortOrder
    );

    for (const [key, duty] of duties) {

        const option = document.createElement("option");

        option.value = key;
        option.textContent = duty.label;

        select.appendChild(option);

    }

}



function createDateField() {

    return `
        <label>Start Date</label>
        <input type="date" class="future-duty-date">`;

}


function createEndDateField() {

    return `
        <label>End Date</label>

        <input
            type="date"
            class="future-duty-end-date"
        >
    `;

}

function createWrapDaysField() {

    return `
        <label>Wrap Days</label>

        <select class="future-duty-wrap-days">

            <option value="BEFORE">
                Two Wrap Days Before
            </option>

            <option value="AFTER">
                Two Wrap Days After
            </option>

            <option value="BOTH">
                One Wrap Day Either Side
            </option>

            <option value="NONE" selected>
                No Wrap Days
            </option>

        </select>
    `;

}


function renderFutureDutyFields(card) {

    const dutyType =
        card.querySelector(".future-duty-type").value;

    const duty =
        BA_FUTURE_DUTY_TYPES[dutyType];

    const container =
        card.querySelector(".future-duty-fields");

let html = createDateField();

if (duty.supportsDateRange) {

    html += createEndDateField();

}
if (duty.supportsWrapDays) {

    html += createWrapDaysField();

}

    container.innerHTML = html;



}


function calculateLeaveDays(startDate, endDate) {

    if (!startDate || !endDate) {

        return 0;

    }



    const start = new Date(startDate);

    const end = new Date(endDate);

    const milliseconds =
        end - start;

    const days =
        Math.floor(
            milliseconds / 86400000
        ) + 1;

    return Math.max(days, 0);

}

function buildFutureDuties() {

    state.futureDuties = [];

    document
        .querySelectorAll(".future-duty-card")
        .forEach(card => {

            state.futureDuties.push({

                ...card.futureDuty

            });

        });

}


function addWrapDay(events, baseDate, offsetDays) {

    const date = new Date(baseDate);

    date.setDate(date.getDate() + offsetDays);

    events.push({

        type: "all_day_duty",

        title: "OFF DUTY",

        location: "",

        date: formatLocalDate(date),

        dayKey: formatLocalDate(date),

        allDay: true,

        crew: [],

        notes: "",

        startLocal: null,

        endLocal: null,

        importStatus: "generated",

        fingerprint:
            `future_off_duty|${formatLocalDate(date)}`,

        uidBase:
            `future_off_duty|${formatLocalDate(date)}`,

        source: "generated"

    });

}


function generateFutureDutyEvents() {

    const events = [];

    document
        .querySelectorAll(".future-duty-card")
        .forEach(card => {

            const duty = card.futureDuty;

            if (
                duty.type !== "ANNUAL_LEAVE" ||
                !duty.startDate ||
                !duty.endDate
            ) {

                return;

            }

            const current = new Date(duty.startDate);

            const end = new Date(duty.endDate);

            while (current <= end) {

                events.push({

                    type: "all_day_duty",

                    title: "ANNUAL LEAVE",

                    location: "",

                    date: formatLocalDate(current),

                    dayKey: formatLocalDate(current),

                    allDay: true,

                    crew: [],

                    notes: "",

                    startLocal: null,

                    endLocal: null,

                    importStatus: "generated",

                    fingerprint:
                        `future_leave|${formatLocalDate(current)}`,

                    uidBase:
                        `future_leave|${formatLocalDate(current)}`,

                    source: "generated"

                });

                current.setDate(current.getDate() + 1);

            }

if (duty.wrapDays === "BEFORE") {

    addWrapDay(events, duty.startDate, -2);

    addWrapDay(events, duty.startDate, -1);

}

if (duty.wrapDays === "AFTER") {

    addWrapDay(events, duty.endDate, 1);

    addWrapDay(events, duty.endDate, 2);

}

if (duty.wrapDays === "BOTH") {

    addWrapDay(events, duty.startDate, -1);

    addWrapDay(events, duty.endDate, 1);

}

        });

    return events;

}


function removeDuplicateGeneratedEvents(events) {

    const seen = new Set();

    return events.filter(event => {

        const key =
            `${event.type}|${event.date}|${event.title}`;

        if (seen.has(key)) {

            return false;

        }

        seen.add(key);

        return true;

    });

}


function updateWrapDayState(card) {

    const wrapField =
        card.querySelector(".future-duty-wrap-days");

    if (!wrapField) {

        return;

    }

    const days =
        calculateLeaveDays(
            card.futureDuty.startDate,
            card.futureDuty.endDate
        );

    if (days >= 5) {

        wrapField.disabled = false;

    }
    else {

        wrapField.value = "NONE";

        wrapField.disabled = true;

        card.futureDuty.wrapDays = "NONE";

    }

}




function saveContractSettings() {

    localStorage.setItem(
        STORAGE_KEYS.contractType,
        els.contractType.value
    );

    localStorage.setItem(
        STORAGE_KEYS.firstPTDate,
        els.firstPTDate.value
    );

}
function loadContractSettings() {

    const saved = localStorage.getItem(
        STORAGE_KEYS.contractType
    );

    if (saved && BA_CONTRACT_TYPES[saved]) {

        els.contractType.value = saved;

    }

const savedPTDate = localStorage.getItem(
    STORAGE_KEYS.firstPTDate
);

if (savedPTDate) {

    els.firstPTDate.value = savedPTDate;

}

}

function openCrewlink() {

    els.crewlinkFlow.classList.remove("hidden");

    window.open(
        "https://crewlink.baplc.com/ccroster/displayroster.do",
        "_blank"
    );

}

    function setStatus(message, kind = "") {
      els.statusBox.className = "status" + (kind ? " " + kind : "");
      els.statusBox.textContent = message;
    }

    async function handleParseClick() {
      const file = els.pdfFile.files[0];
      if (!file) {
        setStatus("Choose a roster PDF first.", "warn");
        return;
      }


      try {
        setStatus("Reading PDF and extracting roster text…");
        const rawText = await extractRawTextFromPDF(file);
        processRosterText(rawText);
      } catch (err) {
        console.error(err);
        setStatus("Something went wrong while parsing the PDF.\n\n" + (err?.message || String(err)), "err");
      }
    }



    function handleParseTextClick() {
      const rawText = els.pastedRosterText.value.trim();
      if (!rawText) {
        setStatus("Paste roster text first.", "warn");
        return;
      }

      try {
        setStatus("Reading pasted roster text…");
        processRosterText(rawText);
      } catch (err) {
        console.error(err);
        setStatus("Something went wrong while parsing the pasted roster text.\n\n" + (err?.message || String(err)), "err");
      }
    }

function findPTSeedDate(events = state.events) {

    // 1. User entered a PT date manually

    if (els.firstPTDate.value) {
        return new Date(els.firstPTDate.value + "T00:00:00");
    }

    // 2. Look through parsed roster events

    for (const event of events) {

        if (!event.allDay) continue;

        const title = (event.title || "").toUpperCase();

        if (
            title.includes("PT TIME NON WORKING")
        ) {

            return new Date(event.date + "T00:00:00");

        }

    }

    // 3. Nothing found

    return null;

}

function generateFuturePTBlocks() {

    const seed = findPTSeedDate();

    if (!seed) {
        return [];
    }

    const contract =
        BA_CONTRACT_TYPES[els.contractType.value];

    if (!contract) {
        return [];
    }

    const blocks = [];

    const endDate = new Date(seed);

    endDate.setMonth(endDate.getMonth() + 12);

    let current = new Date(seed);

    while (current <= endDate) {

        const start = new Date(current);

        const end = new Date(current);


        end.setDate(
    end.getDate() + contract.offDays - 1
);


blocks.push({
    start,
    end,
    type: "pt_non_working",
    source: "generated",
    contractType: els.contractType.value,
    dutyCode: contract.dutyCode
});

        current.setDate(
            current.getDate() + contract.cycleDays
        );

    }

    return blocks;

}

function formatLocalDate(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

function generateFuturePTEvents() {

    const blocks = generateFuturePTBlocks();

    const events = [];

    for (const block of blocks) {

        const current = new Date(block.start);

        while (current <= block.end) {

           events.push({

    type: "all_day_duty",

    title: block.dutyCode,

    location: "",

    date: formatLocalDate(current),

    dayKey: formatLocalDate(current),

    allDay: true,

    crew: [],

    notes: "",

    startLocal: null,

    endLocal: null,

    importStatus: "generated",

    fingerprint:
        `all_day_duty|${formatLocalDate(current)}|${block.dutyCode}`,

    uidBase:
        `all_day_duty|${formatLocalDate(current)}|${block.dutyCode}`,

    dutyCode: block.dutyCode,

    source: "generated"

});

            current.setDate(current.getDate() + 1);

        }

    }

    return events;

}

    function processRosterText(rawText) {
      const cleanedText = normalizePdfText(rawText);
      const year = extractRosterYear(cleanedText);

      state.rawText = cleanedText;
      state.rosterYear = year;
      state.dayBlocks = splitIntoDayBlocks(cleanedText);

      els.debugRawText.value = cleanedText;
      els.debugBlocks.value = state.dayBlocks.map((b, i) => `--- BLOCK ${i + 1} ---\n${b}`).join("\n\n");

      if (!year) {
        setStatus("I couldn't detect the roster year from the roster text. Check the debug panel.", "err");
        return;
      }

      const parsed = parseRosterBlocks(state.dayBlocks, year);
      const generatedFutureDutyEvents = generateFutureDutyEvents();
      const filteredGeneratedFutureDutyEvents = generatedFutureDutyEvents.filter(generated => {

        return !parsed.some(real =>

            real.type === generated.type &&
            real.date === generated.date &&
            real.title === generated.title);

    });

      const uniqueGeneratedFutureDutyEvents = removeDuplicateGeneratedEvents(filteredGeneratedFutureDutyEvents);
      const generatedPTEvents = generateFuturePTEvents();
      const filteredGeneratedPTEvents = generatedPTEvents.filter(generated => {

    return !parsed.some(real =>

        real.type === generated.type &&        
        real.date === generated.date &&
        real.title === generated.title);

});

state.events = [
    ...parsed,
    ...filteredGeneratedPTEvents,
    ...uniqueGeneratedFutureDutyEvents
];

state.events.sort(compareEvents);

classifyEventsAgainstHistory(state.events) ;


localStorage.setItem(
    STORAGE_KEYS.lastParsed,
    JSON.stringify({
        rawText: cleanedText,
        year,
        events: state.events,
        dayBlocks: state.dayBlocks,
        savedAt: new Date().toISOString()
    })
);

updateStats();
renderPreview();
refreshExportButtons();

setStatus(
    "Roster parsed successfully.\n\n" +
    buildSummary(state.events),
    state.events.length ? "ok" : "warn");

}


   async function extractRawTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    disableStream: true,
    disableAutoFetch: true,
    disableRange: true
  });

  const pdf = await loadingTask.promise;
  const pages = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str || "").join(" \n "));
  }

  return pages.join("\n");
}

    function normalizePdfText(text) {
      let out = text
        .replace(/\u00A0/g, " ")
        .replace(/<PARSED TEXT FOR PAGE:[^>]+>/gi, " ")
        .replace(/Cabin Crew Roster/gi, " ")
        .replace(/CREWLINK PORTAL\s*\|\s*HOME\s*\|\s*HELP\s*\|\s*SIGNOUT\s*\|\s*PRINT/gi, " ")
        .replace(/For all training events please look on the IFCE intranet for further details\./gi, " ")
        .replace(/Planned block hours to the end of published roster are\s+\d+:\d+/gi, " ")
        .replace(/CONFIDENTIAL/gi, " ");

      for (const rank of RANKS) {
        out = out.replace(new RegExp(rank, "g"), ` ${rank} `);
      }

      return out
        .replace(/\s+\n/g, "\n")
        .replace(/\n\s+/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{2,}/g, "\n")
        .trim();
    }

    function extractRosterYear(text) {
      const m = text.match(/Roster for .*?(\d{1,2})\s+([A-Z]{3})\s+(\d{2})\s+onwards/i);
      if (m) return 2000 + Number(m[3]);

      const m2 = text.match(/\b(\d{2})\s+onwards\b/i);
      if (m2) return 2000 + Number(m2[1]);

      return inferRosterYearFromCurrentDate(text);
    }

    function inferRosterYearFromCurrentDate(text) {
      const monthsSeen = [...text.matchAll(/\b(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+\d{1,2}\s+([A-Z]{3})\b/gi)]
        .map(m => MONTHS[m[1].toUpperCase()])
        .filter(Boolean);

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (!monthsSeen.length) return currentYear;
      if (monthsSeen.includes(1) && currentMonth === 12) return currentYear + 1;
      if (monthsSeen.includes(12) && currentMonth === 1) return currentYear - 1;
      return currentYear;
    }

    function splitIntoDayBlocks(text) {
      const normalized = text.replace(/\n/g, " ").trim();
      const rawBlocks = normalized
        .split(/(?=(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+\d{1,2}\s+[A-Z]{3}\b)/g)
        .map(p => normalizeSpaces(p))
        .filter(Boolean);

      const merged = [];
      for (const block of rawBlocks) {
        if (!merged.length) {
          merged.push(block);
          continue;
        }

        const prev = merged[merged.length - 1];
        const prevEndsWithTo = /\bto$/i.test(prev);
        const prevEndsWithOpenParen = /\($/.test(prev);
        const currentIsBareDate = /^(MON|TUE|WED|THU|FRI|SAT|SUN)\s+\d{1,2}\s+[A-Z]{3}\)?$/i.test(block);

        if (prevEndsWithTo || prevEndsWithOpenParen || currentIsBareDate) {
          merged[merged.length - 1] = `${prev} ${block}`.replace(/\s+\)/g, ")").trim();
        } else {
          merged.push(block);
        }
      }

      return merged;
    }

    function parseRosterBlocks(blocks, baseYear) {
      const events = [];
      let currentMonth = null;
      let currentYear = baseYear;
      let activeCrew = [];
      let pendingReportHHMM = null;
      let pendingClear = null;

      for (const block of blocks) {
        const dayMatch = block.match(/^(MON|TUE|WED|THU|FRI|SAT|SUN)\s+(\d{1,2})\s+([A-Z]{3})\b(.*)$/i);
        if (!dayMatch) continue;

        const day = Number(dayMatch[2]);
        const monthAbbr = dayMatch[3].toUpperCase();
        const monthNum = MONTHS[monthAbbr];
        if (!monthNum) continue;

        if (currentMonth && monthNum < currentMonth) currentYear += 1;
        currentMonth = monthNum;

        const isoDate = `${currentYear}-${pad(monthNum)}-${pad(day)}`;
        const body = normalizeSpaces(dayMatch[4] || "");
        if (!body) continue;

        const rangeAllDay = parseAllDayRangeFromBlock(body, isoDate, currentYear, currentMonth);
        if (rangeAllDay.length) {
          events.push(...rangeAllDay);
          continue;
        }

        const singleAllDay = parseSingleAllDayFromBlock(body, isoDate);
        if (singleAllDay) {
          events.push(singleAllDay);
          continue;
        }

        if (/^REQUESTED BY CREW MEMBER$/i.test(body)) continue;
        if (/^Operating as\s+\w+$/i.test(body)) continue;

        const reportMatch = body.match(/Report at\s+(\d{4})\s+Local Time\s+([A-Z]{3})/i);
        if (reportMatch && ["LHR", "LGW"].includes(reportMatch[2].toUpperCase())) {
          pendingReportHHMM = reportMatch[1];
        }

        const clearMatch = body.match(
          /Clear at\s+(\d{4})(?:\s+\(\s*(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+\d{1,2}\s+[A-Z]{3}\))?\s+Local Time\s+(LHR|LGW)\b/i
        );
        if (clearMatch) {
          pendingClear = {
            time: clearMatch[1],
            base: clearMatch[2].toUpperCase()
          };
        }

        const crewInThisBlock = parseCrewNamesFromBlock(body);
        if (crewInThisBlock.length) {
          activeCrew = [...crewInThisBlock];
        }

        const timedDuties = parseTimedDutiesFromBlock(body, isoDate);
        if (timedDuties.length) events.push(...timedDuties);

        const flights = parseFlightsFromBlock(body, isoDate, pendingReportHHMM);

        if (flights.length) {
          for (let i = 0; i < flights.length; i++) {
            const flight = flights[i];
            const clearFlightIndex = pendingClear
              ? flights.map(f => f.to).lastIndexOf(pendingClear.base)
              : -1;
            const clearSuffix =
              pendingClear &&
              i === clearFlightIndex &&
              flight.to === pendingClear.base
                ? ` (Clear @ ${pendingClear.time} Local Time LHR)`
                : "";

            if (i === 0 && pendingReportHHMM) {
              flight.title = `${flight.from} - ${flight.to} (RPT @ ${pendingReportHHMM} Local Time LHR)${clearSuffix}`;
            } else {
              flight.title = `${flight.from} - ${flight.to}${clearSuffix}`;
            }

            const notes = [];

            if (flight.to !== "LHR" && flight.to !== "LGW" && flight.endUtcMs) {
              const staLocal = formatAirportLocalHHMM(flight.endUtcMs, flight.to);
              if (staLocal) {
                notes.push(`STA @ ${staLocal} local`);
              }
            }

            if (flight.fixedLinkMinutes != null) {
              notes.push(`Fixed Link - ${flight.fixedLinkMinutes} mins`);
            } else if (flight.fixedLink) {
              notes.push(`Fixed Link`);
            }

            if (activeCrew.length) {
              const crewNames = [...activeCrew];
              notes.push(crewNames.join(", "));
              flight.crew = crewNames;
            }

            flight.notes = notes.join("\n\n");
          }

          events.push(...flights);
          pendingReportHHMM = null;

          if (pendingClear && flights[flights.length - 1].to === pendingClear.base) {
            pendingClear = null;
            activeCrew = [];
          }
        }
      }

      const withDownroute = insertDownrouteEvents(events);

      for (const evt of withDownroute) finalizeEvent(evt);
      withDownroute.sort(compareEvents);
      return withDownroute;
    }

    function insertDownrouteEvents(events) {
      const sortedFlights = events
        .filter(e => e.type === "flight")
        .slice()
        .sort(compareEvents);

      const extra = [];

      for (let i = 0; i < sortedFlights.length - 1; i++) {
        const current = sortedFlights[i];
        const next = sortedFlights[i + 1];

        if (current.to !== next.from) continue;
        if (current.to === "LHR" || current.to === "LGW") continue;

        const endMs = new Date(current.endLocal).getTime();
        const startMs = new Date(next.startLocal).getTime();
        const gapMinutes = Math.round((startMs - endMs) / 60000);

        if (gapMinutes < 300) continue;

        const downrouteStart = new Date(endMs + 60000);
        const downrouteEnd = new Date(startMs - 60000);

        if (downrouteEnd.getTime() <= downrouteStart.getTime()) continue;

        extra.push({
          type: "downroute",
          title: `${current.to} (Downroute)`,
          location: current.to,
          date: current.date,
          allDay: false,
          startLocal: toLocalDateTimeString(downrouteStart),
          endLocal: toLocalDateTimeString(downrouteEnd),
          startUtcMs: endMs + 60000,
          endUtcMs: startMs - 60000,
          notes: formatDuration(gapMinutes),
          crew: []
        });
      }

      return [...events, ...extra];
    }

    function toLocalDateTimeString(dateObj) {
      return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    }

    function formatDuration(totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${pad(hours)}hrs ${pad(minutes)}mins`;
    }

function parseSingleAllDayFromBlock(body, isoDate) {

    const normalized = normalizeSpaces(body).toUpperCase();

    const rosterItem = BA_ROSTER_DATA[normalized];

    if (rosterItem && rosterItem.eventType === "allday") {
        return makeAllDayEvent(isoDate, rosterItem.calendarTitle);
    }

    return null;

}

   function parseAllDayRangeFromBlock(body, isoDate, currentYear, currentMonth) {

    const normalized = normalizeSpaces(body).toUpperCase();

    for (const [code, duty] of Object.entries(BA_ROSTER_DATA)) {

        if (duty.eventType !== "allday") continue;

        const regex = new RegExp(
            "^" +
            code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
            "\\s+TO\\s+(MON|TUE|WED|THU|FRI|SAT|SUN)\\s+(\\d{1,2})\\s+([A-Z]{3})$",
            "i"
        );

        const match = normalized.match(regex);

        if (match) {
            return buildAllDayRange(
                duty.calendarTitle,
                isoDate,
                match[2],
                match[3],
                currentYear,
                currentMonth
            );
        }

    }

    return [];

}

    function buildAllDayRange(title, startIsoDate, endDay, endMonthAbbr, currentYear, currentMonth) {
      const start = parseISODate(startIsoDate);
      const endMonth = MONTHS[endMonthAbbr.toUpperCase()];
      let endYear = currentYear;
      if (endMonth < currentMonth) endYear += 1;

      const endDate = new Date(endYear, endMonth - 1, Number(endDay));
      const out = [];
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());

      while (d <= endDate) {
        out.push(makeAllDayEvent(formatDateObject(d), title));
        d.setDate(d.getDate() + 1);
      }

      return out;
    }

    function parseTimedDutiesFromBlock(body, isoDate) {
      const duties = [];
      const regex = /([A-Z][A-Z0-9'&/ \-]+?)\s+(\d{4})\s+(\d{4})\s+Local Time\s+([A-Z]{3})/gi;
      let m;

      while ((m = regex.exec(body)) !== null) {
        const title = normalizeSpaces(m[1]);
        if (!title) continue;
        if (/^Report at$/i.test(title)) continue;
        if (/BA\d{1,4}/i.test(title)) continue;
        if (/^Operating as /i.test(title)) continue;
        if (/^REQUESTED BY CREW MEMBER$/i.test(title)) continue;

        const airportCode = (m[4] || "").toUpperCase();
        const tz = airportByCode[airportCode]?.timeZone || "Europe/London";
        const utcRange = zonedLocalRangeToUtc(isoDate, m[2], m[3], tz);

        duties.push({
          type: "timed_duty",
          title,
          location: airportCode || "",
          date: isoDate,
          allDay: false,
          startLocal: combineLocalDateTime(isoDate, m[2]),
          endLocal: resolveLocalEndDateTime(isoDate, m[2], m[3]),
          startUtcMs: utcRange.startUtcMs,
          endUtcMs: utcRange.endUtcMs,
          notes: "",
          crew: []
        });
      }

      return dedupeEvents(duties);
    }

    function parseFlightsFromBlock(body, isoDate, reportHHMM) {
      const flights = [];
      const regex = /(\d{4})\s+(BA\d{1,4})\s+([A-Z]{3})\s+([A-Z]{3})\s+(\d{4})(.*?)(?=(\d{4}\s+BA\d{1,4}\s+[A-Z]{3}\s+[A-Z]{3}\s+\d{4})|$)/gi;
      let m;

      while ((m = regex.exec(body)) !== null) {
        const depZ = m[1];
        const flightNo = m[2].toUpperCase();
        const from = m[3].toUpperCase();
        const to = m[4].toUpperCase();
        const arrZ = m[5];
        const tail = normalizeSpaces(m[6] || "");

        const dutyPeriodMatch = tail.match(/\b(\d{2}:\d{2})\b/);
        const fixedLinkMatch = tail.match(/\bFIX\s+(\d+)\s*mins\b/i);
        const hasFix = /\bFIX\b/i.test(tail);

        const title = reportHHMM
          ? `${from} - ${to} (RPT @ ${reportHHMM} Local Time LHR)`
          : `${from} - ${to}`;

        flights.push({
          type: "flight",
          title,
          location: flightNo,
          date: isoDate,
          allDay: false,
          startLocal: zHHMMOnDateToLondonLocal(isoDate, depZ),
          endLocal: zHHMMEndToLondonLocal(isoDate, depZ, arrZ),
          startUtcMs: zHHMMStartToUtcMs(isoDate, depZ),
          endUtcMs: zHHMMEndToUtcMs(isoDate, depZ, arrZ),
          notes: "",
          crew: [],
          flightNo,
          from,
          to,
          dutyPeriod: dutyPeriodMatch ? dutyPeriodMatch[1] : "",
          fixedLink: hasFix,
          fixedLinkMinutes: fixedLinkMatch ? Number(fixedLinkMatch[1]) : null
        });
      }

      return dedupeEvents(flights);
    }

    function parseCrewNamesFromBlock(body) {
      let cleaned = body
        .replace(/Report at\s+\d{4}\s+Local Time\s+[A-Z]{3}/gi, " ")
        .replace(/\d{4}\s+BA\d{1,4}\s+[A-Z]{3}\s+[A-Z]{3}\s+\d{4}\b[^A-Z]*/gi, " ")
        .replace(/Operating as\s+[A-Z]{2,}/gi, " ")
        .replace(/REQUESTED BY CREW MEMBER/gi, " ")
        .replace(/Clear at\s+\d{4}(?:\s+\(\s*(?:MON|TUE|WED|THU|FRI|SAT|SUN)\s+\d{1,2}\s+[A-Z]{3}\))?\s+Local Time\s+[A-Z]{3}/gi, " ")
        .replace(/Total duty hours[^A-Z]*/gi, " ")
        .replace(/FIX\s+\d+\s*mins/gi, " ")
        .replace(/\b\d{1,2}:\d{2}\b/g, " ");

      for (const rank of RANKS) {
        cleaned = cleaned.replace(new RegExp(rank, "g"), ` ${rank} `);
      }

      const tokens = normalizeSpaces(cleaned).split(" ").filter(Boolean);
      const crew = [];
      let nameParts = [];

      for (const token of tokens) {
        const upper = token.toUpperCase();

        if (RANKS.includes(upper)) {
          if (nameParts.length) {
            crew.push(toTitleCaseName(nameParts.join(" ")));
            nameParts = [];
          }
          continue;
        }

        if (/^[A-Z][A-Z'’\-]+$/.test(upper)) {
          nameParts.push(upper);
        } else {
          nameParts = [];
        }
      }

      return [...new Set(crew)];
    }

    function dedupeEvents(events) {
      const seen = new Set();
      return events.filter(evt => {
        const key = JSON.stringify([evt.type, evt.date, evt.title, evt.startLocal, evt.endLocal, evt.location || ""]);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    function finalizeEvent(evt) {
      evt.uidBase = buildUIDBase(evt);
      evt.dayKey = evt.date;
      evt.fingerprint = evt.uidBase;
    }

   function classifyEventsAgainstHistory(events) {

    const importedByDay = state.importHistory.byDay || {};

    for (const evt of events) {

        if (evt.source === "generated") {
            continue;
        }

        const dayItems = importedByDay[evt.date] || [];

        const sameExact = dayItems.includes(evt.fingerprint);

        if (sameExact) {
            evt.importStatus = "unchanged";
        } else if (dayItems.length > 0) {
            evt.importStatus = "changed";
        } else {
            evt.importStatus = "new";
        }
    }
}

    function buildSummary(events) {
      const total = events.length;
      const flightCount = events.filter(e => e.type === "flight").length;
      const downrouteCount = events.filter(e => e.type === "downroute").length;
      const timedDutyCount = events.filter(e => e.type === "timed_duty").length;
      const allDayCount = events.filter(e => e.type === "all_day_duty").length;

      return [
        `Parsed ${total} event${total === 1 ? "" : "s"}.`,
        `Flights: ${flightCount}`,
        `Downroute: ${downrouteCount}`,
        `Timed duties: ${timedDutyCount}`,
        `All-day duties: ${allDayCount}`,
        `Day blocks detected: ${state.dayBlocks.length}`
      ].join("\n");
    }

    function updateStats() {
      const total = state.events.length;
      els.statTotal.textContent = String(total);
    }

    function renderPreview() {
      const q = els.searchBox.value.trim().toLowerCase();
      const typeFilter = els.typeFilter.value;

      const filtered = state.events.filter(evt => {
        const matchesType = typeFilter === "all" ? true : evt.type === typeFilter;
        if (!matchesType) return false;

        if (!q) return true;

        const haystack = [
          evt.title,
          evt.location || "",
          evt.notes || "",
          evt.flightNo || "",
          evt.from || "",
          evt.to || "",
          evt.date || ""
        ].join(" ").toLowerCase();

        return haystack.includes(q);
      });

      state.filteredEvents = filtered;

      if (!filtered.length) {
        els.previewBody.innerHTML = `<tr><td colspan="8" class="small">No matching events.</td></tr>`;
        return;
      }

      const rows = filtered.map(evt => {
        const typeBadge = renderTypeBadge(evt.type);
        const statusText = renderStatusText(evt.importStatus);
        const notes = evt.notes ? escapeHtml(evt.notes).replace(/\n/g, "<br>") : "—";
        const start = evt.allDay ? "All day" : formatLocalDisplay(evt.startLocal);
        const end = evt.allDay ? "All day" : formatLocalDisplay(evt.endLocal);

        return `
          <tr>
            <td>${escapeHtml(formatDatePretty(evt.date))}</td>
            <td>${typeBadge}</td>
            <td>${escapeHtml(evt.title)}</td>
            <td>${escapeHtml(evt.location || "—")}</td>
            <td>${escapeHtml(start)}</td>
            <td>${escapeHtml(end)}</td>
            <td>${statusText}</td>
            <td>${notes}</td>
          </tr>
        `;
      }).join("");

      els.previewBody.innerHTML = rows;
    }

    function renderTypeBadge(type) {
      if (type === "flight") return `<span class="badge b-flight">Flight</span>`;
      if (type === "downroute") return `<span class="badge b-downroute">Downroute</span>`;
      if (type === "timed_duty") return `<span class="badge b-timed">Timed duty</span>`;
      if (type === "all_day_duty") return `<span class="badge b-allday">All-day duty</span>`;
      return `<span class="badge">Other</span>`;
    }

    function renderStatusText(status) {
      if (status === "new") return `<span class="state-new">New</span>`;
      if (status === "unchanged") return `<span class="state-unchanged">Unchanged</span>`;
      if (status === "changed") return `<span class="state-changed">Changed</span>`;
      return "";
    }

    function refreshExportButtons() {
      const hasEvents = state.events.length > 0;
      els.downloadBtn.disabled = !hasEvents;
    }

    function getExportCandidateEvents() {
      return [...state.events];
    }

    function downloadICS() {
      const events = getExportCandidateEvents();
      if (!events.length) {
        setStatus("There are no events matching the current export mode.", "warn");
        return;
      }

      const ics = buildICS(events);
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const calendarName = "Crew_Roster";

      const now = new Date();
      const stamp = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
        "_",
        pad(now.getHours()),
        pad(now.getMinutes())
      ].join("");

      const filename = `roster_${calendarName}_${stamp}.ics`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      refreshExportButtons();

      setStatus(
        `Downloaded ${events.length} event${events.length === 1 ? "" : "s"} as ${filename}.`,
        "ok"
      );
    }

    function foldICSLine(line) {
      const limit = 73;
      if (line.length <= limit) return [line];
      const out = [];
      let remaining = line;
      while (remaining.length > limit) {
        out.push(remaining.slice(0, limit));
        remaining = " " + remaining.slice(limit);
      }
      out.push(remaining);
      return out;
    }

    function buildICS(events) {
      const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Roster Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
      ];

      lines.push(...foldICSLine(`X-WR-CALNAME:${escapeICS("Crew Roster")}`));

      for (const evt of events) {
        lines.push("BEGIN:VEVENT");
        lines.push(...foldICSLine(`UID:${escapeICS(evt.uidBase)}@roster-calendar`));
        lines.push(...foldICSLine(`SUMMARY:${escapeICS(evt.title)}`));

        if (evt.location) {
          lines.push(...foldICSLine(`LOCATION:${escapeICS(evt.location)}`));
        }

        if (evt.allDay) {
          lines.push(`DTSTART;VALUE=DATE:${formatICSDate(evt.date)}`);
          lines.push(`DTEND;VALUE=DATE:${formatICSDate(nextDay(evt.date))}`);
        } else if (typeof evt.startUtcMs === "number" && typeof evt.endUtcMs === "number") {
          lines.push(`DTSTART:${formatICSDateTimeUTC(evt.startUtcMs)}`);
          lines.push(`DTEND:${formatICSDateTimeUTC(evt.endUtcMs)}`);
        } else {
          const fallbackStartUtcMs = new Date(evt.startLocal).getTime();
          const fallbackEndUtcMs = new Date(evt.endLocal).getTime();
          lines.push(`DTSTART:${formatICSDateTimeUTC(fallbackStartUtcMs)}`);
          lines.push(`DTEND:${formatICSDateTimeUTC(fallbackEndUtcMs)}`);
        }

        if (evt.notes) {
          lines.push(...foldICSLine(`DESCRIPTION:${escapeICS(evt.notes)}`));
        }

        lines.push(`DTSTAMP:${formatICSUtcNow()}`);
        lines.push("END:VEVENT");
      }

      lines.push("END:VCALENDAR");
      return lines.join("\r\n");
    }

    function clearImportHistory() {
      const ok = window.confirm("Clear the cached roster data on this device?");
      if (!ok) return;

      const fresh = { byDay: {}, updatedAt: new Date().toISOString() };
      saveImportHistory(fresh);
      localStorage.removeItem(STORAGE_KEYS.lastParsed);
      state.importHistory = fresh;
      state.events = [];
      state.dayBlocks = [];
      state.rawText = "";
      els.fileName.textContent = "No file selected";
      els.pastedRosterText.value = "";
      els.debugRawText.value = "";
      els.debugBlocks.value = "";
      updateStats();
      renderPreview();
      refreshExportButtons();
      setStatus("Cached roster data cleared on this device.", "warn");
    }

    function loadImportHistory() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.importHistory);
        if (!raw) return { byDay: {}, updatedAt: null };
        const parsed = JSON.parse(raw);
        return {
          byDay: parsed.byDay || {},
          updatedAt: parsed.updatedAt || null
        };
      } catch {
        return { byDay: {}, updatedAt: null };
      }
    }

    function saveImportHistory(history) {
      localStorage.setItem(STORAGE_KEYS.importHistory, JSON.stringify(history));
    }

    function buildUIDBase(evt) {
      if (evt.allDay) {
        return [evt.type, evt.date, normalizeUIDPart(evt.title)].join("|");
      }

      if (evt.type === "flight") {
        return [
          evt.type,
          evt.date,
          evt.flightNo || "",
          evt.from || "",
          evt.to || "",
          String(evt.startUtcMs || "")
        ].join("|");
      }

      return [
        evt.type,
        evt.date,
        normalizeUIDPart(evt.title),
        String(evt.startUtcMs || ""),
        String(evt.endUtcMs || "")
      ].join("|");
    }

    function makeAllDayEvent(date, title) {
      return {
        type: "all_day_duty",
        title,
        location: "",
        date,
        allDay: true,
        startLocal: null,
        endLocal: null,
        notes: "",
        crew: []
      };
    }

    function zHHMMOnDateToLondonLocal(isoDate, hhmmZ) {
      const dt = new Date(zHHMMStartToUtcMs(isoDate, hhmmZ));
      return londonDateTimeString(dt);
    }

    function zHHMMStartToUtcMs(isoDate, hhmmZ) {
      return new Date(`${isoDate}T${hhmmZ.slice(0,2)}:${hhmmZ.slice(2,4)}:00Z`).getTime();
    }

    function zHHMMEndToLondonLocal(isoDate, depHHMMZ, arrHHMMZ) {
      const dt = new Date(zHHMMEndToUtcMs(isoDate, depHHMMZ, arrHHMMZ));
      return londonDateTimeString(dt);
    }

    function zHHMMEndToUtcMs(isoDate, depHHMMZ, arrHHMMZ) {
      const depMinutes = hhmmToMinutes(depHHMMZ);
      const arrMinutes = hhmmToMinutes(arrHHMMZ);
      const depDate = parseISODate(isoDate);
      const arrDate = new Date(depDate.getFullYear(), depDate.getMonth(), depDate.getDate());

      if (arrMinutes < depMinutes) arrDate.setDate(arrDate.getDate() + 1);

      const yyyy = arrDate.getFullYear();
      const mm = pad(arrDate.getMonth() + 1);
      const dd = pad(arrDate.getDate());

      return new Date(`${yyyy}-${mm}-${dd}T${arrHHMMZ.slice(0,2)}:${arrHHMMZ.slice(2,4)}:00Z`).getTime();
    }

    function formatAirportLocalHHMM(utcMs, airportCode) {
      const airport = airportByCode[airportCode];
      if (!airport || !airport.timeZone) return "";

      return new Intl.DateTimeFormat("en-GB", {
        timeZone: airport.timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(new Date(utcMs));
    }

    function londonDateTimeString(dateObj) {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
      }).formatToParts(dateObj);

      const map = {};
      for (const p of parts) {
        if (p.type !== "literal") map[p.type] = p.value;
      }

      return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`;
    }

    function combineLocalDateTime(isoDate, hhmm) {
      return `${isoDate}T${hhmm.slice(0,2)}:${hhmm.slice(2,4)}:00`;
    }

    function resolveLocalEndDateTime(isoDate, startHHMM, endHHMM) {
      const start = hhmmToMinutes(startHHMM);
      const end = hhmmToMinutes(endHHMM);
      if (end < start) return `${nextDay(isoDate)}T${endHHMM.slice(0,2)}:${endHHMM.slice(2,4)}:00`;
      return `${isoDate}T${endHHMM.slice(0,2)}:${endHHMM.slice(2,4)}:00`;
    }

    function compareEvents(a, b) {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      const aStart = a.allDay ? "0000" : formatUIDDateTime(a.startLocal);
      const bStart = b.allDay ? "0000" : formatUIDDateTime(b.startLocal);
      if (aStart !== bStart) return aStart.localeCompare(bStart);
      return a.title.localeCompare(b.title);
    }

    function hhmmToMinutes(hhmm) {
      return Number(hhmm.slice(0,2)) * 60 + Number(hhmm.slice(2,4));
    }

    function formatICSDate(isoDate) {
      return isoDate.replace(/-/g, "");
    }

    function formatICSDateTimeLocal(isoDateTime) {
      return isoDateTime.replace(/[-:]/g, "").slice(0, 15);
    }

    function formatICSDateTimeUtc(utcMs) {
      const d = new Date(utcMs);
      return [
        d.getUTCFullYear(),
        pad(d.getUTCMonth() + 1),
        pad(d.getUTCDate()),
        "T",
        pad(d.getUTCHours()),
        pad(d.getUTCMinutes()),
        pad(d.getUTCSeconds()),
        "Z"
      ].join("");
    }

    function formatICSDateTimeUTC(utcMs) {
      const d = new Date(utcMs);
      return [
        d.getUTCFullYear(),
        pad(d.getUTCMonth() + 1),
        pad(d.getUTCDate()),
        "T",
        pad(d.getUTCHours()),
        pad(d.getUTCMinutes()),
        pad(d.getUTCSeconds()),
        "Z"
      ].join("");
    }

    function formatICSUtcNow() {
      const d = new Date();
      return [
        d.getUTCFullYear(),
        pad(d.getUTCMonth() + 1),
        pad(d.getUTCDate()),
        "T",
        pad(d.getUTCHours()),
        pad(d.getUTCMinutes()),
        pad(d.getUTCSeconds()),
        "Z"
      ].join("");
    }

    function formatUIDDateTime(isoDateTime) {
      return String(isoDateTime || "").replace(/[-:T]/g, "").slice(0, 12);
    }

    function nextDay(isoDate) {
      const d = parseISODate(isoDate);
      d.setDate(d.getDate() + 1);
      return formatDateObject(d);
    }

    function parseISODate(isoDate) {
      const [y, m, d] = isoDate.split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    function formatDateObject(d) {
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    function formatDatePretty(isoDate) {
      const d = parseISODate(isoDate);
      return d.toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }

    function formatLocalDisplay(isoDateTime) {
      const d = new Date(isoDateTime);
      return d.toLocaleString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }

    function normalizeSpaces(str) {
      return String(str || "").replace(/\s+/g, " ").trim();
    }

    function normalizeUIDPart(str) {
      return normalizeSpaces(str).toUpperCase();
    }

    function escapeICS(str) {
      return String(str || "")
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    }

    function escapeHtml(str) {
      return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function toTitleCaseName(name) {
      return name
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map(part => {
          if (part.includes("'") || part.includes("’")) {
            return part
              .split(/['’]/)
              .map(p => p ? p[0].toUpperCase() + p.slice(1) : p)
              .join("'");
          }
          if (part.includes("-")) {
            return part
              .split("-")
              .map(p => p ? p[0].toUpperCase() + p.slice(1) : p)
              .join("-");
          }
          return part[0].toUpperCase() + part.slice(1);
        })
        .join(" ");
    }
  


FBP.createPage({

    contentSelector: ".ical-wrap",

    title: "Roster → iCal",

    subtitle:
        "Use this app to upload your roster; either as a PDF or by copying the roster text from Crewlink. Then simply click 'Sync with iCal' to have your roster in your iCloud calendar. This app has been built by BA crew, for BA crew. If you have feedback, please click the feedback button at the top of this page.",

    feedbackEmail: "u155573@ba.com",

    feedbackSubject: "Feedback for iCal Roster Tool",

    feedbackButton: "iCal Feedback",

    activePage: "ical"

});
