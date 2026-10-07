(function () {
  "use strict";

  const form = document.getElementById("aircraftLookupForm");
  const input = document.getElementById("aircraftRegistration");
  const message = document.getElementById("lookupMessage");
  const results = document.getElementById("aircraftResults");
  const title = document.getElementById("aircraftResultTitle");
  const source = document.getElementById("aircraftSource");
  const registrationDetails = document.getElementById("registrationDetails");
  const typeDetails = document.getElementById("typeDetails");

  const labelOverrides = {
    registration: "Registration",
    baseSection: "Fleet Section",
    flightDeck: "Flight Deck Code",
    airfile: "Airfile Code",
    mtow: "Maximum Take-Off Weight (kg)",
    seatCount: "Total Passenger Seats",
    wifiType: "Wi-Fi Type",
    newShorthaulSeat: "New Shorthaul Seat",
    xlOverheadBins: "XL Overhead Bins",
    sourceNotes: "Source Notes",
    flightCrewBunks: "Flight Crew Bunks",
    cabinCrewBunks: "Cabin Crew Bunks",
    seatBreakdown: "Seat Breakdown",
    fullName: "Aircraft Type",
    shortName: "Short Name",
    family: "Aircraft Family",
    variant: "Aircraft Variant",
    manufacturer: "Manufacturer",
    configName: "Cabin Configuration",
    classCount: "Number of Cabin Classes",
    classes: "Cabin Classes",
    includesRestFacilities: "Rest Facilities Included",
    restTypes: "Rest Facility Types",
    flightCrewRest: "Flight Crew Rest Facility",
    cabinCrewRest: "Cabin Crew Rest Facility",
    firstProduct: "First Product",
    clubWorldProduct: "Club World Product",
    catering: "Catering"
  };

  const cabinClassNames = {
    F: "F",
    J: "J",
    CW: "J",
    CE: "J",
    W: "W",
    WTP: "W",
    M: "M",
    WT: "M",
    ET: "M"
  };

  const productNames = {
    Tango: "New First 'Tango' Seat",
    "Club Suite": "Club Suite",
    Stretch: "Club 'Ying Yang' Seat",
    First: "First Suite (No Doors)",
    "First Suite": "First Suite (with Doors)"
  };

  function humanize(key) {
    return labelOverrides[key] || key
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/^./, character => character.toUpperCase());
  }

  function formatValue(value, key, haul) {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (key === "classes" && Array.isArray(value)) {
      const cabins = [...new Set(value.map(code => cabinClassNames[String(code).toUpperCase()] || String(code)))];
      return cabins.join(", ");
    }
    if (key === "seatBreakdown" && value && typeof value === "object") {
      if (haul === "shorthaul") return "";
      const cabinLabels = { first: "F", clubWorld: "CW", worldTravellerPlus: "WTP", worldTraveller: "WT" };
      return Object.entries(cabinLabels)
        .filter(([cabin, label]) => Number(value[cabin]) > 0 && label)
        .map(([cabin, label]) => `${label}: ${value[cabin]}`)
        .join(" · ");
    }
    if (["product", "firstProduct", "clubWorldProduct"].includes(key) && haul === "longhaul") {
      return String(value).split("/").map(part => productNames[part.trim()] || part.trim()).join(" / ");
    }
    if (Array.isArray(value)) return value.length ? value.join(", ") : "None listed";
    if (value && typeof value === "object") {
      return Object.entries(value)
        .filter(([, nestedValue]) => nestedValue !== null && nestedValue !== undefined && nestedValue !== "")
        .filter(([, nestedValue]) => typeof nestedValue !== "number" || nestedValue > 0)
        .map(([nestedKey, nestedValue]) => `${humanize(nestedKey)}: ${formatValue(nestedValue, nestedKey, haul)}`)
        .join(" · ");
    }
    if (key === "mtow" && typeof value === "number") return value.toLocaleString("en-GB");
    return String(value);
  }

  function renderDetails(container, record, hiddenKeys = [], haul = null) {
    container.replaceChildren();
    const hidden = new Set(hiddenKeys);
    const entries = Object.entries(record || {}).filter(([key, value]) =>
      !hidden.has(key) && value !== null && value !== undefined && value !== "" &&
      !(["product", "firstProduct", "clubWorldProduct"].includes(key) && haul !== "longhaul") &&
      !(key === "seatBreakdown" && haul === "shorthaul")
    );

    entries.forEach(([key, value]) => {
      const row = document.createElement("div");
      row.className = "aircraft-detail-row";

      const label = document.createElement("dt");
      label.textContent = humanize(key);

      const detail = document.createElement("dd");
      detail.textContent = formatValue(value, key, haul);
      if (!detail.textContent) return;

      row.append(label, detail);
      container.appendChild(row);
    });
  }

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
  }

  function findAircraft(registration) {
    const records = globalThis.AIRCRAFT_REGISTRATIONS || {};
    const aircraftTypes = globalThis.AIRCRAFT || {};
    const record = records[registration];

    if (!record) {
      results.hidden = true;
      showMessage(`No aircraft registration found for ${registration}. Check the registration and try again.`, true);
      input.focus();
      input.select();
      return;
    }

    const type = aircraftTypes[record.airfile] || {};
    title.textContent = `${record.registration} — ${type.fullName || "Aircraft"}`;
    source.textContent = globalThis.AIRCRAFT_REGISTRATION_SOURCE?.asOf
      ? `Fleet registration data current as of ${globalThis.AIRCRAFT_REGISTRATION_SOURCE.asOf}.`
      : "Fleet registration data.";

    renderDetails(registrationDetails, record, ["haul", "airfile", "flightCrewBunks", "cabinCrewBunks"], record.haul);
    renderDetails(typeDetails, type, ["dataFile", "dataPath", "briefingTitle", "selectorLabel", "selectorSubLabel", "flightCrewRest", "cabinCrewRest", "includesRestFacilities", "restTypes", "crew", "emergencyEquipmentSummary", "firstProduct", "clubWorldProduct", "notes"], record.haul);
    results.hidden = false;
    showMessage("");
  }

  input.addEventListener("input", () => {
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    showMessage("");
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const registration = input.value.trim().toUpperCase();
    if (!registration) {
      results.hidden = true;
      showMessage("Enter an aircraft registration to search.", true);
      input.focus();
      return;
    }
    findAircraft(registration);
  });
})();
