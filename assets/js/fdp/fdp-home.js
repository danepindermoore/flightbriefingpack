/**
 * Flight Briefing Pack
 * FDP Homepage
 */

document.addEventListener("DOMContentLoaded", () => {

    FBP.createPage({
        activePage: "fdp",
        title: "MyBriefing",
        subtitle: "Choose the correct duty type from the options below.",
        feedbackText: "MyBriefing Feedback",
        feedbackSubject: "Feedback for MyBriefing"
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("fdp-grid");

    if (!grid) return;

    const aircraftIcon = () => `<svg viewBox="0 0 48 48" focusable="false">
        <path d="M24 4.5 27 18l13 8v3l-13-3.5L26 38l5 3v2l-7-2-7 2v-2l5-3-1-12.5L8 29v-3l13-8z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="m19 39 5 1.5 5-1.5" fill="none" stroke="#d7193f" stroke-width="2.7" stroke-linecap="round"/>
        <path d="m21.5 36.5 2.5 1 2.5-1" fill="none" stroke="#75b8df" stroke-width="2.7" stroke-linecap="round"/>
    </svg>`;

    grid.innerHTML = FDP_CALCULATORS.map((calc, index) => `
        <article class="fdp-choice" data-type="${calc.type}">
            <button class="fdp-choice-toggle" type="button" aria-expanded="false" aria-controls="fdp-details-${calc.type}">
                <span class="fdp-icon" aria-hidden="true">${aircraftIcon()}</span>
                <span class="fdp-choice-title">${calc.title}</span>
            </button>
            <div class="fdp-choice-details" id="fdp-details-${calc.type}" hidden>
                <p>${calc.description}</p>
                <a class="fdp-choice-cta" href="${calc.url}">${calc.button}<span aria-hidden="true"> →</span></a>
            </div>
        </article>
    `).join("");

    grid.querySelectorAll(".fdp-choice-toggle").forEach(toggle => {
        toggle.addEventListener("click", () => {
            const card = toggle.closest(".fdp-choice");
            const details = document.getElementById(toggle.getAttribute("aria-controls"));
            const expanded = toggle.getAttribute("aria-expanded") === "true";
            grid.querySelectorAll(".fdp-choice-toggle").forEach(other => {
                if (other === toggle) return;
                other.setAttribute("aria-expanded", "false");
                document.getElementById(other.getAttribute("aria-controls")).hidden = true;
                other.closest(".fdp-choice").classList.remove("is-expanded");
            });
            toggle.setAttribute("aria-expanded", String(!expanded));
            details.hidden = expanded;
            card.classList.toggle("is-expanded", !expanded);
        });
    });
});
