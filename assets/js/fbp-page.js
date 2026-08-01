/*
=========================================================
Flight Briefing Pack
Page Builder
Version: 2.0.0
=========================================================

Responsibilities

✓ Builds the standard Flight Briefing Pack page
✓ Inserts the shared navigation
✓ Inserts the shared hero
✓ Leaves page-specific content untouched

=========================================================
*/

(function () {

    "use strict";

    /**
     * Creates the standard Flight Briefing Pack page.
     *
     * Required HTML:
     *
     * <main id="fbp-page">
     *     <!-- Your page-specific content -->
     * </main>
     *
     * @param {Object} options
     */

    FBP.createPage = function (options = {}) {

        const {

            container = "#fbp-page",

            title = "",

            subtitle = "",

            microline = "",

            feedbackText = "Feedback",

            feedbackEmail = "u155573@ba.com",

            feedbackSubject = "Flight Briefing Pack Feedback",

            activePage = ""

        } = options;

        const page = document.querySelector(container);

        if (!page) {

            console.error(
                `FBP.createPage(): Container "${container}" not found.`
            );

            return;

        }

        //--------------------------------------------------
        // Create shared components
        //--------------------------------------------------

        const navigation = FBP.createNavigation(activePage);

        const shell = FBP.createShell({

            title,

            subtitle,

            microline,

            feedbackText,

            feedbackEmail,

            feedbackSubject

        });

        //--------------------------------------------------
        // Insert into page
        //--------------------------------------------------

        page.prepend(
            navigation,
            shell
        );

    };

})();