/*
=========================================================
Flight Briefing Pack
Shared Navigation
Version: 2.0.0
=========================================================

Responsibilities

✓ Build the main navigation
✓ Highlight the active page

=========================================================
*/

(function () {

    "use strict";

    //-----------------------------------------------------
    // Navigation Items
    //-----------------------------------------------------

const IS_ROOT =
    location.pathname.endsWith("/") ||
    location.pathname.endsWith("/index.html") ||
    !location.pathname.includes("/FDP/") &&
    !location.pathname.includes("/briefing/") &&
    !location.pathname.includes("/iCal/");

const BASE = IS_ROOT ? "" : "../";

const NAV_ITEMS = [

    {
        id: "home",
        text: "Home",
        href: BASE
    },

    {
        id: "ical",
        text: "iCal",
        href: BASE + "iCal/"
    },

    {
        id: "fdp",
        text: "FDP",
        href: BASE + "FDP/"
    },

    {
        id: "briefing",
        text: "Briefing",
        href: BASE + "briefing/"
    }

];

    //-----------------------------------------------------
    // Create Navigation
    //-----------------------------------------------------

    FBP.createNavigation = function (activePage = "") {

        const nav = document.createElement("nav");

        nav.className = "fbp-subnav";

        NAV_ITEMS.forEach(item => {

            const link = document.createElement("a");

            link.href = item.href;

            link.textContent = item.text;

            if (item.id === activePage) {

                link.classList.add("active");

            }

            nav.appendChild(link);

        });

        return nav;

    };

    //-----------------------------------------------------
    // Helpers
    //-----------------------------------------------------

    FBP.getNavigationItems = function () {

        return [...NAV_ITEMS];

    };

})();