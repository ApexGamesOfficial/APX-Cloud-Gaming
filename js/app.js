/*
    APX Cloud Gaming
    v0.4

    SYSTEM BOOTSTRAP

    This is the main entry point for APX.
    index.html will load ONLY this file as a module.
*/


/* ---------------------------------------
   CORE SYSTEMS
--------------------------------------- */

import {
    APXState,
    getAPXState
}
from "./state.js";


import {
    APX_GAMES,
    getGameByIndex,
    isWelcomeCard
}
from "./games.js";


import {
    initFocusSystem,
    setFocusTarget,
    refreshFocusFrame,
    hideFocusFrame
}
from "./focus.js";


import {
    initCarousel,
    getSelectedCardElement,
    getSelectedGame,
    refreshCarousel
}
from "./carousel.js";


import {
    initNavigation,
    updateNavigationUI,
    navigateToPage
}
from "./navigation.js";


/* ---------------------------------------
   BOOT STATE
--------------------------------------- */

let APXBooted = false;


/* ---------------------------------------
   DOM HELPERS
--------------------------------------- */

function getElement(id) {
    return document.getElementById(id);
}


/* ---------------------------------------
   CLOCK
--------------------------------------- */

function updateClock() {

    const timeElement =
        getElement("systemTime");

    const dateElement =
        getElement("systemDate");


    const now =
        new Date();


    if (timeElement) {

        timeElement.textContent =
            now.toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );
    }


    if (dateElement) {

        dateElement.textContent =
            now.toLocaleDateString(
                [],
                {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                }
            );
    }
}


/* ---------------------------------------
   SELECTED ITEM INFORMATION
--------------------------------------- */

function updateSelectedItemUI(game) {

    if (!game) {
        return;
    }


    const title =
        getElement("selectedGameTitle");

    const description =
        getElement(
            "selectedGameDescription"
        );

    const developer =
        getElement(
            "selectedGameDeveloper"
        );

    const status =
        getElement(
            "selectedGameStatus"
        );


    if (title) {
        title.textContent =
            game.title;
    }


    if (description) {
        description.textContent =
            game.description || "";
    }


    if (developer) {
        developer.textContent =
            game.developer || "";
    }


    if (status) {
        status.textContent =
            game.status || "";
    }


    /*
        Welcome gets slightly different
        terminology than actual games.
    */

    document.body.classList.toggle(
        "welcome-selected",
        isWelcomeCard(game)
    );


    document.body.dataset.selectedItem =
        game.id;
}


/* ---------------------------------------
   BACKGROUND
--------------------------------------- */

function updateBackground(game) {

    if (!game) {
        return;
    }


    const current =
        getElement("apxBackgroundCurrent");

    const next =
        getElement("apxBackgroundNext");


    if (!current || !next) {
        return;
    }


    /*
        If the selected item has artwork,
        crossfade to it.
    */

    if (game.backgroundImage) {

        next.style.backgroundImage =
            `url("${game.backgroundImage}")`;

        next.classList.add("visible");


        window.setTimeout(
            () => {

                current.style.backgroundImage =
                    next.style.backgroundImage;

                next.classList.remove(
                    "visible"
                );

            },
            650
        );

    } else {

        /*
            Prototype fallback backgrounds.

            CSS will use the selected item's
            ID to create the theme.
        */

        current.style.backgroundImage = "";
        next.style.backgroundImage = "";

        next.classList.remove("visible");
    }
}


/* ---------------------------------------
   ACTION BUTTONS
--------------------------------------- */

function updateActionButtons(game) {

    const primary =
        getElement("primaryAction");

    const secondary =
        getElement("secondaryAction");


    if (!game) {
        return;
    }


    if (isWelcomeCard(game)) {

        if (primary) {
            primary.textContent =
                "Explore APX";
        }

        if (secondary) {
            secondary.textContent =
                "System Info";
        }

        return;
    }


    if (primary) {

        if (game.playable) {

            primary.textContent =
                "Play on APX";

            primary.disabled = false;

        } else {

            primary.textContent =
                game.status ||
                "Unavailable";

            primary.disabled = true;
        }
    }


    if (secondary) {

        secondary.textContent =
            "Game Info";

        secondary.disabled = false;
    }
}


/* ---------------------------------------
   GAME CHANGE
--------------------------------------- */

function handleGameChange(event) {

    const game =
        event.detail?.game ||
        getSelectedGame();


    if (!game) {
        return;
    }


    updateSelectedItemUI(game);

    updateBackground(game);

    updateActionButtons(game);


    /*
        Other modules such as welcome.js,
        cloud.js and apx-ai.js can listen
        to the exact same event later.
    */
}


/* ---------------------------------------
   PAGE CHANGE
--------------------------------------- */

function handlePageChange(event) {

    const page =
        event.detail?.page ||
        APXState.activePage;


    const pages =
        document.querySelectorAll(
            "[data-apx-screen]"
        );


    pages.forEach(
        screen => {

            const active =
                screen.dataset.apxScreen ===
                page;


            screen.classList.toggle(
                "active",
                active
            );


            screen.setAttribute(
                "aria-hidden",
                active
                    ? "false"
                    : "true"
            );
        }
    );


    document.body.dataset.apxPage =
        page;


    /*
        Returning Home restores the
        selected carousel focus.
    */

    if (page === "home") {

        requestAnimationFrame(
            () => {

                refreshCarousel();

                const selected =
                    getSelectedCardElement();

                if (selected) {

                    setFocusTarget(
                        selected,
                        {
                            track: true,
                            duration: 550
                        }
                    );
                }
            }
        );

    } else {

        /*
            navigation.js will move focus
            toward the active nav item.
        */

        refreshFocusFrame();
    }
}


/* ---------------------------------------
   PRIMARY ACTION
--------------------------------------- */

function handlePrimaryAction() {

    const game =
        getSelectedGame();


    if (!game) {
        return;
    }


    /*
        WELCOME
    */

    if (isWelcomeCard(game)) {

        window.dispatchEvent(
            new CustomEvent(
                "apx:openwelcome"
            )
        );

        return;
    }


    /*
        GAME

        IMPORTANT:
        This does NOT pretend real cloud
        streaming exists yet.
    */

    if (!game.playable) {
        return;
    }


    window.dispatchEvent(
        new CustomEvent(
            "apx:sessionrequest",
            {
                detail: {
                    game
                }
            }
        )
    );
}


/* ---------------------------------------
   SECONDARY ACTION
--------------------------------------- */

function handleSecondaryAction() {

    const game =
        getSelectedGame();


    if (!game) {
        return;
    }


    if (isWelcomeCard(game)) {

        window.dispatchEvent(
            new CustomEvent(
                "apx:systeminfo"
            )
        );

        return;
    }


    window.dispatchEvent(
        new CustomEvent(
            "apx:gameinfo",
            {
                detail: {
                    game
                }
            }
        )
    );
}


/* ---------------------------------------
   QUICK APX AI REQUEST
--------------------------------------- */

function handleQuickAIRequest() {

    /*
        apx-ai.js will replace this
        temporary hook.

        We deliberately do NOT fake a
        Gemini response here.
    */

    console.log(
        "[APX] Quick APX AI requested."
    );


    document.body.classList.add(
        "quick-ai-requested"
    );


    window.setTimeout(
        () => {

            document.body.classList.remove(
                "quick-ai-requested"
            );

        },
        800
    );
}


/* ---------------------------------------
   BACK REQUEST
--------------------------------------- */

function handleBackRequest() {

    /*
        Future overlays will get first
        chance to intercept this event.

        For now, non-Home pages return
        to Home.
    */

    if (
        APXState.activePage !== "home"
    ) {

        navigateToPage(
            "home",
            {
                source: "back"
            }
        );
    }
}


/* ---------------------------------------
   BUTTON EVENTS
--------------------------------------- */

function bindSystemButtons() {

    const primary =
        getElement("primaryAction");

    const secondary =
        getElement("secondaryAction");


    if (primary) {

        primary.addEventListener(
            "click",
            handlePrimaryAction
        );
    }


    if (secondary) {

        secondary.addEventListener(
            "click",
            handleSecondaryAction
        );
    }
}


/* ---------------------------------------
   SYSTEM EVENTS
--------------------------------------- */

function bindSystemEvents() {

    window.addEventListener(
        "apx:gamechange",
        handleGameChange
    );


    window.addEventListener(
        "apx:pagechange",
        handlePageChange
    );


    window.addEventListener(
        "apx:quickai",
        handleQuickAIRequest
    );


    window.addEventListener(
        "apx:back",
        handleBackRequest
    );
}


/* ---------------------------------------
   INITIAL UI
--------------------------------------- */

function initializeUI() {

    const game =
        getGameByIndex(
            APXState.selectedGameIndex
        );


    updateSelectedItemUI(game);

    updateBackground(game);

    updateActionButtons(game);

    updateNavigationUI();


    document.body.dataset.apxPage =
        APXState.activePage;


    document.body.dataset.apxVersion =
        APXState.version;
}


/* ---------------------------------------
   BOOT FOCUS
--------------------------------------- */

function initializeStartingFocus() {

    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    const selected =
                        getSelectedCardElement();


                    if (selected) {

                        setFocusTarget(
                            selected,
                            {
                                track: true,
                                duration: 700
                            }
                        );

                    } else {

                        hideFocusFrame();
                    }
                }
            );
        }
    );
}


/* ---------------------------------------
   DEVELOPMENT INFO
--------------------------------------- */

function printBootInfo() {

    console.log(
        "%c APX Cloud Gaming ",
        "background:#087cff;color:white;font-weight:bold;padding:5px 10px;border-radius:5px;"
    );


    console.log(
        `[APX] Version ${APXState.version}`
    );


    console.log(
        `[APX] ${APX_GAMES.length} home items loaded.`
    );


    console.log(
        "[APX] System state:",
        getAPXState()
    );
}


/* ---------------------------------------
   BOOT
--------------------------------------- */

export function bootAPX() {

    if (APXBooted) {
        return;
    }


    APXBooted = true;


    document.documentElement.classList.add(
        "apx-booting"
    );


    /*
        1. Focus engine
    */

    initFocusSystem();


    /*
        2. Carousel
    */

    initCarousel();


    /*
        3. Navigation
    */

    initNavigation();


    /*
        4. System buttons/events
    */

    bindSystemButtons();

    bindSystemEvents();


    /*
        5. Initial screen
    */

    initializeUI();


    /*
        6. Clock
    */

    updateClock();

    window.setInterval(
        updateClock,
        1000
    );


    /*
        7. Starting focus
    */

    initializeStartingFocus();


    /*
        8. Boot complete
    */

    requestAnimationFrame(
        () => {

            document.documentElement.classList.remove(
                "apx-booting"
            );

            document.documentElement.classList.add(
                "apx-ready"
            );
        }
    );


    printBootInfo();
}


/* ---------------------------------------
   START APX
--------------------------------------- */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        bootAPX,
        {
            once: true
        }
    );

} else {

    bootAPX();
}
