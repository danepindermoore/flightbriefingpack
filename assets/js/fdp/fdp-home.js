/**
 * Flight Briefing Pack
 * FDP Homepage
 */

document.addEventListener("DOMContentLoaded", () => {

    FBP.createPage({
        activePage: "fdp",
        title: "FDP Calculator",
        subtitle: "Choose the correct calculator for your operation. Longhaul and shorthaul now run as separate tools so each page stays cleaner, simpler and easier to use.",
        microline: "Built for BA crew.",
        feedbackSubject: "Feedback for FDP Calculator"
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("fdp-grid");

    if (!grid) return;

    grid.innerHTML = FDP_CALCULATORS.map(calc => `
        <a class="fdp-choice" href="${calc.url}">
            <span class="fdp-choice-badge">${calc.badge}</span>
            <h2>${calc.title}</h2>
            <p>${calc.description}</p>
            <span class="fdp-choice-cta">${calc.button}</span>
        </a>
    `).join("");
});