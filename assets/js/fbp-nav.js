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

const IS_FEATURE_PAGE = /\/(FDP|briefing|iCal|Crew Documents|Choks)(\/|$)/i.test(
    decodeURIComponent(location.pathname)
);

const BASE = IS_FEATURE_PAGE ? "../" : "";

const NAV_ITEMS = [

    {
        id: "home",
        text: "Home",
        href: BASE + "index.html"
    },

    {
        id: "ical",
        text: "iCal",
        href: BASE + "iCal/index.html"
    },

    {
        id: "fdp",
        text: "FDP",
        href: BASE + "FDP/index.html"
    },

    {
        id: "briefing",
        text: "Briefing",
        href: BASE + "briefing/index.html"
    },

    {
        id: "aors",
        text: "AORs",
        href: BASE + "Service%20Documents/Briefing_Pack_Redirection.pdf"
    },

    {
        id: "choks",
        text: "Time Calculator",
        href: BASE + "Choks/index.html"
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
