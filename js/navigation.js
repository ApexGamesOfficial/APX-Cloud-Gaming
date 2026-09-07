/* =========================================================
   APX v0.41
   NAVIGATION SYSTEM

   Pages:
   - Home
   - Store
   - Friends
   - APX AI
   - Chat

   Also controls:
   - Home carousel keyboard navigation
   - Pointer / keyboard input mode
   - Quick APX AI shortcut
   - Back / Escape
   - Store -> Home game navigation
========================================================= */

import {
    APXState,
    setActivePage,
    setInputMode
} from "./state.js";


import {
    selectNextGame,
    selectPreviousGame,
    selectGameById,
    getSelectedCard
} from "./carousel.js";


import {
    setFocusTarget,
    refreshFocus
} from "./focus.js";


/* =========================================================
   HELPERS
========================================================= */

function isTyping() {

    const element =
        document.activeElement;


    if (!element) {
        return false;
    }


    const tag =
        element.tagName?.toLowerCase();


    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
    );

}


function isHomeCarouselArea() {

    return (
        APXState.activePage === "home" &&
        window.scrollY <
            window.innerHeight * 0.55
    );

}


/* =========================================================
   PAGE ELEMENTS
========================================================= */

function getPageElements() {

    return document.querySelectorAll(
        "[data-apx-screen]"
    );

}


function getNavigationItems() {

    return document.querySelectorAll(
        "[data-apx-page]"
    );

}


/* =========================================================
   NAVIGATION UI
========================================================= */

export function updateNavigationUI() {

    getNavigationItems()
        .forEach(
            item => {

                const active =
                    item.dataset.apxPage ===
                    APXState.activePage;


                item.classList.toggle(
                    "active",
                    active
                );


                if (active) {

                    item.setAttribute(
                        "aria-current",
                        "page"
                    );

                }
                else {

                    item.removeAttribute(
                        "aria-current"
                    );

                }

            }
        );


    document.body.dataset.apxPage =
        APXState.activePage;

}


/* =========================================================
   SCREEN VISIBILITY
========================================================= */

function updateScreenVisibility() {

    getPageElements()
        .forEach(
            screen => {

                const screenName =
                    screen.dataset.apxScreen;


                const active =
                    screenName ===
                    APXState.activePage;


                screen.hidden =
                    !active;


                screen.classList.toggle(
                    "active",
                    active
                );

            }
        );

}


/* =========================================================
   NAVIGATE
========================================================= */

export function navigateToPage(
    page,
    options = {}
) {

    const validPages =
        [
            "home",
            "store",
            "friends",
            "ai",
            "chat"
        ];


    if (
        !validPages.includes(
            page
        )
    ) {

        console.warn(
            `[APX] Unknown page: ${page}`
        );

        return;

    }


    setActivePage(
        page
    );


    updateScreenVisibility();

    updateNavigationUI();


    /*
       Home should return to the top unless another APX
       system specifically requests otherwise.
    */

    if (
        page === "home" &&
        options.preserveScroll !== true
    ) {

        window.scrollTo(
            {
                top: 0,
                behavior:
                    options.instant
                        ? "auto"
                        : "smooth"
            }
        );

    }


    /*
       Non-Home pages behave like full APX screens.
    */

    if (
        page !== "home"
    ) {

        window.scrollTo(
            {
                top: 0,
                behavior:
                    options.instant
                        ? "auto"
                        : "smooth"
            }
        );

    }


    window.dispatchEvent(
        new CustomEvent(
            "apx:pagechange",
            {
                detail: {
                    page
                }
            }
        )
    );


    /*
       Give the new screen one frame to render before
       recalculating the detached focus frame.
    */

    requestAnimationFrame(
        () => {

            refreshFocus();

        }
    );

}


/* =========================================================
   PAGE SHORTCUTS
========================================================= */

export function openHome() {

    navigateToPage(
        "home"
    );

}


export function openStore() {

    navigateToPage(
        "store"
    );

}


export function openFriends() {

    navigateToPage(
        "friends"
    );

}


export function openAPXAI() {

    navigateToPage(
        "ai"
    );

}


export function openChat() {

    navigateToPage(
        "chat"
    );

}


/* =========================================================
   ACTIVE NAV FOCUS
========================================================= */

function focusActiveNavigationItem() {

    const active =
        document.querySelector(
            `[data-apx-page="${APXState.activePage}"]`
        );


    if (!active) {

        return;

    }


    setFocusTarget(
        active
    );

}


/* =========================================================
   HOME CAROUSEL KEYBOARD
========================================================= */

function handleHomeCarouselKey(
    event
) {

    if (
        !isHomeCarouselArea()
    ) {

        return false;

    }


    if (
        event.key === "ArrowLeft"
    ) {

        event.preventDefault();


        setInputMode(
            "keyboard"
        );


        selectPreviousGame(
            "keyboard"
        );


        return true;

    }


    if (
        event.key === "ArrowRight"
    ) {

        event.preventDefault();


        setInputMode(
            "keyboard"
        );


        selectNextGame(
            "keyboard"
        );


        return true;

    }


    if (
        event.key === "Enter"
    ) {

        const selected =
            getSelectedCard();


        if (!selected) {

            return false;

        }


        event.preventDefault();


        selected.click();


        return true;

    }


    return false;

}


/* =========================================================
   GLOBAL KEYBOARD
========================================================= */

function handleKeyboard(
    event
) {

    if (
        isTyping()
    ) {

        return;

    }


    setInputMode(
        "keyboard"
    );


    if (
        handleHomeCarouselKey(
            event
        )
    ) {

        return;

    }


    /*
       Universal Quick APX AI.

       Full APX AI page doesn't trigger the Quick AI overlay.
    */

    if (
        event.key.toLowerCase() === "a" &&
        APXState.activePage !== "ai"
    ) {

        event.preventDefault();


        window.dispatchEvent(
            new CustomEvent(
                "apx:quickai"
            )
        );


        return;

    }


    /*
       Escape / controller-back equivalent.
    */

    if (
        event.key === "Escape"
    ) {

        window.dispatchEvent(
            new CustomEvent(
                "apx:back"
            )
        );

    }

}


/* =========================================================
   POINTER INPUT
========================================================= */

function handlePointerDown() {

    setInputMode(
        "pointer"
    );

}


/* =========================================================
   NAV ITEM CLICK
========================================================= */

function handleNavigationClick(
    event
) {

    const target =
        event.target.closest(
            "[data-apx-page]"
        );


    if (!target) {

        return;

    }


    const page =
        target.dataset.apxPage;


    if (!page) {

        return;

    }


    navigateToPage(
        page
    );

}


/* =========================================================
   STORE -> HOME GAME

   store.js dispatches this when the user opens a title.

   We return Home and select the matching carousel card.
========================================================= */

function handleStoreGame(
    event
) {

    const gameId =
        event.detail?.gameId;


    if (!gameId) {

        return;

    }


    navigateToPage(
        "home",
        {
            instant: true
        }
    );


    /*
       Wait for Home to become visible before moving the
       carousel and focus frame.
    */

    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    selectGameById(
                        gameId,
                        "store"
                    );

                }
            );

        }
    );

}


/* =========================================================
   PAGE CHANGE FOCUS
========================================================= */

function handlePageFocus(
    event
) {

    const page =
        event.detail?.page;


    if (!page) {

        return;

    }


    requestAnimationFrame(
        () => {

            if (
                page === "home"
            ) {

                const selected =
                    getSelectedCard();


                if (selected) {

                    setFocusTarget(
                        selected,
                        {
                            track: true,
                            duration: 800
                        }
                    );

                }


                return;

            }


            focusActiveNavigationItem();

        }
    );

}


/* =========================================================
   SCROLL
========================================================= */

function handleScroll() {

    refreshFocus();

}


/* =========================================================
   BIND NAVIGATION
========================================================= */

function bindNavigationEvents() {

    document.addEventListener(
        "keydown",
        handleKeyboard
    );


    document.addEventListener(
        "pointerdown",
        handlePointerDown,
        {
            passive: true
        }
    );


    document.addEventListener(
        "click",
        handleNavigationClick
    );


    window.addEventListener(
        "apx:storegame",
        handleStoreGame
    );


    window.addEventListener(
        "apx:pagechange",
        handlePageFocus
    );


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

export function initNavigation() {

    bindNavigationEvents();


    updateScreenVisibility();

    updateNavigationUI();


    console.log(
        "[APX] Navigation ready."
    );

}
