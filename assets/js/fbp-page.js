/*
=========================================================
Flight Briefing Pack
Page Builder
Version: 2.2.0
=========================================================

Responsibilities

✓ Builds the standard Flight Briefing Pack page
✓ Inserts the shared navigation
✓ Inserts the shared hero
✓ Supports multiple page layouts
✓ Supports moving page-specific content
✓ Safe to initialise multiple times
✓ Leaves page-specific content untouched

=========================================================
*/

(function () {

    "use strict";

    FBP.createPage = function (options = {}) {

        const {

            container = "main",

            contentSelector = null,

            layout = "standard",

            title = "",

            subtitle = "",

            microline = "",

            feedbackText = "Feedback",

            feedbackEmail = "u155573@ba.com",

            feedbackSubject = "Flight Briefing Pack Feedback",

            activePage = ""

        } = options;

        //--------------------------------------------------
        // Locate page container
        //--------------------------------------------------

        const page = document.querySelector(container);

        if (!page) {

            console.error(
                `FBP.createPage(): Container "${container}" not found.`
            );

            return;

        }

        //--------------------------------------------------
        // Locate page-specific content
        //--------------------------------------------------

        const content = contentSelector
            ? document.querySelector(contentSelector)
            : null;

        //--------------------------------------------------
        // Prevent duplicate initialisation
        //--------------------------------------------------

        page.querySelector(".fbp-subnav")?.remove();
        page.querySelector(".fbp-hero")?.remove();

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
        // Apply page layout
        //--------------------------------------------------

        page.classList.forEach(className => {

            if (className.startsWith("fbp-layout-")) {

                page.classList.remove(className);

            }

        });

        page.classList.add(`fbp-layout-${layout}`);

        //--------------------------------------------------
        // Insert shared UI
        //--------------------------------------------------

        page.prepend(
            navigation,
            shell
        );

        //--------------------------------------------------
        // Move page-specific content if required
        //--------------------------------------------------

        if (content && content.parentElement !== page) {

            page.appendChild(content);

        }

    };

})();