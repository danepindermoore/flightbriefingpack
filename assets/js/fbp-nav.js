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

const IS_FEATURE_PAGE = /\/(FDP|briefing|iCal|Time Calculator)(\/|$)/i.test(
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
        text: "Briefing & AORs",
        href: BASE + "briefing/index.html"
    },

    {
        id: "aors",
        text: "BA AORs",
        href: BASE + "Service%20Documents/Briefing_Pack_Redirection.pdf",
    },

    {
        id: "time-calculator",
        text: "Time Calculator",
        href: BASE + "Time%20Calculator/index.html"
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

            if (item.inProgress) {

                link.dataset.functionalityInProgress = "true";

            }

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

    document.addEventListener("click", event => {

        const link = event.target instanceof Element
            ? event.target.closest("a[data-functionality-in-progress]")
            : null;

        if (!link) return;

        event.preventDefault();

        window.alert("Functionality in progress");

    });

})();
