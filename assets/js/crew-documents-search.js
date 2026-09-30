(function () {
  "use strict";

  const input = document.getElementById("search");
  const results = document.getElementById("searchResults");

  if (!input || !results || typeof crewDocuments === "undefined") return;

  function renderResults() {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();

    if (!query) return;

    const matches = crewDocuments.filter((item) => {
      const searchable = [
        item.aircraft,
        item.code,
        item.variant,
        ...(item.documents || []).map((document) => document.title)
      ].filter(Boolean).join(" ").toLowerCase();

      return searchable.includes(query);
    }).slice(0, 12);

    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = "No matching documents found.";
      results.append(empty);
      return;
    }

    matches.forEach((item) => {
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = item.page;

      const name = document.createElement("span");
      name.textContent = `${item.aircraft} · ${item.code}${item.variant ? ` · ${item.variant}` : ""}`;

      const detail = document.createElement("small");
      detail.textContent = "Open documents";

      link.append(name, detail);
      results.append(link);
    });
  }

  input.addEventListener("input", renderResults);
})();
