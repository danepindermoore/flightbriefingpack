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

const IS_FEATURE_PAGE = /\/(FDP|briefing|iCal|MyDocuments)(\/|$)/i.test(
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
        id: "briefing",
        text: "MyAircraft",
        href: BASE + "briefing/index.html"
    },

    {
        id: "fdp",
        text: "MyBriefing",
        href: BASE + "FDP/index.html",
        adminOnly: true
    },

    {
        id: "documents",
        text: "MyDocuments",
        href: BASE + "MyDocuments/index.html"
    },
    {
        id: "ical",
        text: "MyRoster",
        href: BASE + "iCal/index.html",
        adminOnly: true
    }

];

    const ADMIN_ACCESS_KEY = "fbpAdminAccess";
    function hasAdminAccess(){try{return sessionStorage.getItem(ADMIN_ACCESS_KEY)==="granted"}catch{return false}}
    function visibleNavigationItems(){return NAV_ITEMS.filter(item=>!item.adminOnly||hasAdminAccess())}
    //-----------------------------------------------------
    // Create Navigation
    //-----------------------------------------------------

    FBP.createNavigation = function (activePage = "") {

        const nav = document.createElement("nav");

        nav.className = "fbp-subnav";

        visibleNavigationItems().forEach(item => {

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

        return visibleNavigationItems();

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
