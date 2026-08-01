/*
=========================================================
Flight Briefing Pack
Shared Framework
Version: 2.0.0
=========================================================

Responsibilities

✓ FBP namespace
✓ Framework version
✓ Cache busting
✓ Theme management
✓ Version badge
✓ Global initialisation

=========================================================
*/

(function () {

    "use strict";

    window.FBP = window.FBP || {};

    //-----------------------------------------------------
    // Framework
    //-----------------------------------------------------

    FBP.version = "2.0.0";

    FBP.cacheVersion = "v4";

    //-----------------------------------------------------
    // Configuration
    //-----------------------------------------------------

    const storageKey = "fbp-theme";

    //-----------------------------------------------------
    // Cache Busting
    //-----------------------------------------------------

    function bust(url) {

        return url.split("?")[0] +

            "?v=" +

            FBP.cacheVersion;

    }

    FBP.refreshAssets = function () {

        document

            .querySelectorAll('link[href*="fbp-shared.css"]')

            .forEach(link => {

                link.href = bust(link.href);

            });

    };

    //-----------------------------------------------------
    // Theme
    //-----------------------------------------------------

    FBP.setTheme = function (mode) {

        if (mode === "light") {

            document.body.classList.add("light-mode");

        }

        else {

            document.body.classList.remove("light-mode");

            mode = "dark";

        }

        localStorage.setItem(

            storageKey,

            mode

        );

        const toggle =

            document.querySelector(

                "[data-fbp-theme-toggle]"

            );

        if (toggle) {

            toggle.textContent =

                mode === "light"

                    ? "Dark mode"

                    : "Light mode";

        }

    };

    FBP.getTheme = function () {

        return document.body.classList.contains(

            "light-mode"

        )

            ? "light"

            : "dark";

    };

    FBP.initTheme = function () {

        const saved =

            localStorage.getItem(storageKey)

            || "dark";

        FBP.setTheme(saved);

        const toggle =

            document.querySelector(

                "[data-fbp-theme-toggle]"

            );

        if (toggle) {

            toggle.addEventListener(

                "click",

                () => {

                    FBP.setTheme(

                        FBP.getTheme() === "light"

                            ? "dark"

                            : "light"

                    );

                }

            );

        }

    };

    //-----------------------------------------------------
    // Version Badge
    //-----------------------------------------------------

    FBP.injectVersion = function () {

        const version =

            document.body.dataset.fbpVersion ||

            FBP.version;

        const badge =

            document.createElement("div");

        badge.className = "fbp-version";

        badge.textContent = version;

        document.body.appendChild(

            badge

        );

    };

    //-----------------------------------------------------
    // Initialise
    //-----------------------------------------------------

    FBP.init = function () {

        FBP.refreshAssets();

        FBP.initTheme();

        FBP.injectVersion();

    };

    //-----------------------------------------------------

    document.addEventListener(

        "DOMContentLoaded",

        FBP.init

    );

})();