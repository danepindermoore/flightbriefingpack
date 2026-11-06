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
✓ Dark appearance
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
    // Initialise
    //-----------------------------------------------------

    FBP.init = function () {

        FBP.refreshAssets();


    };

    //-----------------------------------------------------

    document.addEventListener(

        "DOMContentLoaded",

        FBP.init

    );

})();
