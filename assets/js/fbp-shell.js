/*
=========================================================
Flight Briefing Pack
Shared Page Shell
Version: 2.0.0
=========================================================

Responsibilities

✓ Creates the shared page hero
✓ Displays page title
✓ Displays page subtitle
✓ Displays optional microline
✓ Creates feedback button

=========================================================
*/

(function () {

    "use strict";

    /**
     * Creates the Flight Briefing Pack page shell.
     *
     * @param {Object} options
     * @returns {HTMLElement}
     */

    FBP.createShell = function (options = {}) {

        const {

            title = "",

            subtitle = "",

            microline = "",

            feedbackText = "Feedback",

            feedbackEmail = "u155573@ba.com",

            feedbackSubject = "Flight Briefing Pack Feedback"

        } = options;

        const hero = document.createElement("section");

        hero.className = "fbp-hero";

        hero.innerHTML = `

<div class="fbp-aircraft-bg" aria-hidden="true">

<svg viewBox="0 0 1200 360" xmlns="http://www.w3.org/2000/svg">

<g opacity="0.9" transform="translate(390 74) scale(1.12)">

<path d="M566.5 95.5C550.4 96.5 508.9 97.8 456 99.8L337 178.5H283L359 99.2C307.4 101.3 247.4 104.2 184 107.6L117 156H74L122.5 108.8C74.1 111.5 34.3 114.2 11.8 116.5C4.7 117.2 0 123.5 0 130.6C0 137.8 5 144.1 12.1 144.8C34.8 147.1 74.7 149.7 122.7 152.4L74 199H117L184.6 153.5C248.3 156.9C308.3 159.9 359.7 162L283 239.5H337L456.3 161.4C509.2 163.4 550.5 164.8 566.5 165.8C582.1 166.8 595 154.6 595 139.1V122.2C595 106.7 582 94.5 566.5 95.5Z" fill="currentColor"/>

</g>

</svg>

</div>

<div class="fbp-topbar">

    <div class="fbp-page-heading">

        <h1 class="fbp-title">${title}</h1>

        ${subtitle ? `
        <p class="fbp-subtitle">
            ${subtitle}
        </p>
        ` : ""}

        ${microline ? `
        <p class="fbp-microline">
            ${microline}
        </p>
        ` : ""}

    </div>

    <div class="fbp-toolbar">

        <a
            class="fbp-button"
            href="mailto:${feedbackEmail}?subject=${encodeURIComponent(feedbackSubject)}">

            ${feedbackText}

        </a>

    </div>

</div>

`;

        return hero;

    };

})();