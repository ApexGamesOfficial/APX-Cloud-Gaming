/* =========================================================
   APX v0.41
   NAVIGATION SYSTEM

   Pages:
   Home
   Store
   Friends
   APX AI
   Chat

   Handles:
   - Mouse / touch
   - Keyboard
   - Home carousel navigation
   - Quick APX AI shortcut
   - Store -> Home game selection
   - Universal APX focus handoff
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
   CONSTANTS
========================================================= */

const VALID_PAGES = [
    "home",
    "store",
    "friends",
    "apx-ai",
    "chat"
];


let initialized = false;


/* =========================================================
   HELPERS
========================================================= */

function isTypingTarget(target) {

    if (!target) {
        return false;
    }


    const tag =
        target.tagName?.toLowerCase();


    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable === true
    );

}


function getPageButtons() {

    return Array.from(
        document.querySelectorAll(
            "[data-apx-page]"
        )
    );

}


function getScreens() {

    return Array.from(
        document.querySelectorAll(
            "[data-apx-screen]"
        )
    );

}


function normalizePage(page) {

    /*
       Temporary backwards compatibility.

       APX v0.41 officially uses "apx-ai".
    */

    if (page === "ai") {
        return "apx-ai";
    }


    return page;

}


/* =========================================================
   PAGE UI
========================================================= */

function updatePageUI(page) {

    const normalizedPage =
        normalizePage(page);


    getScreens().forEach(
        screen => {

            const active =
                screen.dataset.apxScreen ===
                normalizedPage;


            screen.hidden =
                !active;


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


    getPageButtons().forEach(
        button => {

            const buttonPage =
                normalizePage(
                    button.dataset.apxPage
                );


            const active =
                buttonPage ===
                normalizedPage;


            button.classList.toggle(
                "active",
                active
            );


            if (active) {

                button.setAttribute(
                    "aria-current",
                    "page"
                );

            }

            else {

                button.removeAttribute(
                    "aria-current"
                );

            }

        }
    );

}


/* =========================================================
   PAGE FOCUS
========================================================= */

function focusCurrentPage(page) {

    const normalizedPage =
        normalizePage(page);


    window.setTimeout(
        () => {

            /*
               HOME:
               return focus to selected carousel card.
            */

            if (
                normalizedPage ===
                "home"
            ) {

                const selected =
                    getSelectedCard?.() ||
                    document.querySelector(
                        ".game-card.selected"
                    );


                if (selected) {

                    setFocusTarget(
                        selected,
                        {
                            track: true,
                            duration: 800
                        }
                    );

                }


                refreshFocus?.();

                return;

            }


            /*
               OTHER PAGES:
               use first available focusable APX element.
            */

            const screen =
                document.querySelector(
                    `[data-apx-screen="${normalizedPage}"]`
                );


            if (!screen) {
                return;
            }


            const target =
                screen.querySelector(
                    "[data-apx-focus]:not([disabled])"
                );


            if (target) {

                setFocusTarget(
                    target,
                    {
                        track: true,
                        duration: 500
                    }
                );

            }

            else {

                refreshFocus?.();

            }

        },
        90
    );

}


/* =========================================================
   NAVIGATE
========================================================= */

export function navigateToPage(
    page,
    options = {}
) {

    const normalizedPage =
        normalizePage(page);


    if (
        !VALID_PAGES.includes(
            normalizedPage
        )
    ) {

        console.warn(
            `[APX] Unknown page: ${page}`
        );

        return false;

    }


    setActivePage(
        normalizedPage
    );


    updatePageUI(
        normalizedPage
    );


    window.dispatchEvent(
        new CustomEvent(
            "apx:pagechange",
            {
                detail: {
                    page:
                        normalizedPage,

                    source:
                        options.source ||
                        "navigation"
                }
            }
        )
    );


    if (
        options.scroll !== false
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


    focusCurrentPage(
        normalizedPage
    );


    return true;

}


/* =========================================================
   NAV BUTTON CLICK
========================================================= */

function handleNavClick(event) {

    const button =
        event.currentTarget;


    const page =
        normalizePage(
            button.dataset.apxPage
        );


    if (!page) {
        return;
    }


    setInputMode?.(
        "pointer"
    );


    navigateToPage(
        page,
        {
            source:
                "nav-click"
        }
    );

}


/* =========================================================
   HOME CAROUSEL CHECK
========================================================= */

function homeCarouselIsActive() {

    if (
        APXState.activePage !==
        "home"
    ) {
        return false;
    }


    /*
       Once the user scrolls substantially into the lower
       dashboard/hub, arrows should not unexpectedly move
       the top carousel.
    */

    return (
        window.scrollY <
        window.innerHeight * .55
    );

}


/* =========================================================
   CAROUSEL MOVEMENT
========================================================= */

function moveCarousel(direction) {

    if (
        !homeCarouselIsActive()
    ) {
        return false;
    }


    if (direction === "next") {

        selectNextGame?.();

    }

    else {

        selectPreviousGame?.();

    }


    window.setTimeout(
        () => {

            const selected =
                getSelectedCard?.() ||
                document.querySelector(
                    ".game-card.selected"
                );


            if (selected) {

                setFocusTarget(
                    selected,
                    {
                        track: true,
                        duration: 850
                    }
                );

            }

        },
        20
    );


    return true;

}


/* =========================================================
   ENTER / ACTIVATE
========================================================= */

function activateCurrentTarget() {

    const active =
        document.activeElement;


    /*
       Native button/link activation.
    */

    if (
        active &&
        active !== document.body &&
        (
            active.matches?.(
                "button, a, [role='button']"
            )
        )
    ) {

        active.click();

        return;

    }


    /*
       HOME fallback:
       trigger the main action for the selected game.
    */

    if (
        APXState.activePage ===
        "home"
    ) {

        const primary =
            document.getElementById(
                "primaryAction"
            );


        if (
            primary &&
            !primary.disabled
        ) {

            primary.click();

        }

    }

}


/* =========================================================
   QUICK APX AI
========================================================= */

function requestQuickAI() {

    window.dispatchEvent(
        new CustomEvent(
            "apx:quickai"
        )
    );

}


/* =========================================================
   KEYBOARD
========================================================= */

function handleKeyDown(event) {

    const target =
        event.target;


    const typing =
        isTypingTarget(
            target
        );


    /*
       ESCAPE
    */

    if (
        event.key === "Escape"
    ) {

        event.preventDefault();


        window.dispatchEvent(
            new CustomEvent(
                "apx:back"
            )
        );


        return;

    }


    /*
       Never hijack normal typing controls.
    */

    if (typing) {
        return;
    }


    setInputMode?.(
        "keyboard"
    );


    /*
       QUICK AI

       A = Quick APX AI when not typing and when the
       dedicated APX AI page is not already open.
    */

    if (
        event.key.toLowerCase() ===
        "a" &&
        APXState.activePage !==
        "apx-ai"
    ) {

        event.preventDefault();

        requestQuickAI();

        return;

    }


    /*
       HOME CAROUSEL
    */

    if (
        event.key ===
        "ArrowRight"
    ) {

        if (
            moveCarousel(
                "next"
            )
        ) {

            event.preventDefault();

        }


        return;

    }


    if (
        event.key ===
        "ArrowLeft"
    ) {

        if (
            moveCarousel(
                "previous"
            )
        ) {

            event.preventDefault();

        }


        return;

    }


    /*
       ENTER
    */

    if (
        event.key === "Enter"
    ) {

        event.preventDefault();

        activateCurrentTarget();

    }

}


/* =========================================================
   POINTER MODE
========================================================= */

function handlePointerDown() {

    setInputMode?.(
        "pointer"
    );

}


/* =========================================================
   STORE -> HOME

   store.js dispatches apx:storegame.

   navigation.js handles the page change + carousel
   selection. app.js then synchronizes the selected UI.

========================================================= */

function handleStoreGame(event) {

    const detail =
        event.detail ||
        {};


    const gameId =
        typeof detail === "string"
            ? detail
            : (
                detail.gameId ||
                detail.id ||
                detail.game?.id
            );


    if (!gameId) {
        return;
    }


    /*
       Select before showing Home so the carousel is already
       aimed at the correct title when Home becomes visible.
    */

    selectGameById?.(
        gameId
    );


    navigateToPage(
        "home",
        {
            source:
                "store-game"
        }
    );


    window.setTimeout(
        () => {

            const selected =
                getSelectedCard?.() ||
                document.querySelector(
                    ".game-card.selected"
                );


            if (selected) {

                setFocusTarget(
                    selected,
                    {
                        track: true,
                        duration: 850
                    }
                );

            }

        },
        100
    );

}


/* =========================================================
   FOCUS TRACKING
========================================================= */

function handleFocusIn(event) {

    const target =
        event.target?.closest?.(
            "[data-apx-focus]"
        );


    if (!target) {
        return;
    }


    setFocusTarget(
        target,
        {
            track: true,
            duration: 500
        }
    );

}


/* =========================================================
   POINTER HOVER
========================================================= */

function handlePointerOver(event) {

    const target =
        event.target?.closest?.(
            "[data-apx-focus]"
        );


    if (!target) {
        return;
    }


    if (
        target.closest(
            "[hidden]"
        )
    ) {
        return;
    }


    setFocusTarget(
        target,
        {
            track: true,
            duration: 500
        }
    );

}


/* =========================================================
   RESIZE / SCROLL
========================================================= */

function handleViewportChange() {

    refreshFocus?.();

}


/* =========================================================
   BIND NAV BUTTONS
========================================================= */

function bindNavigationButtons() {

    getPageButtons().forEach(
        button => {

            /*
               Prevent accidental duplicate listeners if
               initNavigation() is ever called again.
            */

            if (
                button.dataset
                    .apxNavigationBound ===
                "true"
            ) {
                return;
            }


            button.dataset.apxNavigationBound =
                "true";


            button.addEventListener(
                "click",
                handleNavClick
            );

        }
    );

}


/* =========================================================
   INITIAL PAGE
========================================================= */

function initializePageState() {

    let page =
        normalizePage(
            APXState.activePage
        );


    if (
        !VALID_PAGES.includes(
            page
        )
    ) {

        page =
            "home";

    }


    setActivePage(
        page
    );


    updatePageUI(
        page
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

export function initNavigation() {

    if (initialized) {

        bindNavigationButtons();

        initializePageState();

        refreshFocus?.();

        return;

    }


    initialized =
        true;


    bindNavigationButtons();


    document.addEventListener(
        "keydown",
        handleKeyDown
    );


    document.addEventListener(
        "pointerdown",
        handlePointerDown,
        {
            passive: true
        }
    );


    document.addEventListener(
        "focusin",
        handleFocusIn
    );


    document.addEventListener(
        "pointerover",
        handlePointerOver,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        handleViewportChange,
        {
            passive: true
        }
    );


    window.addEventListener(
        "scroll",
        handleViewportChange,
        {
            passive: true
        }
    );


    window.addEventListener(
        "apx:storegame",
        handleStoreGame
    );


    initializePageState();


    console.log(
        "[APX] v0.41 navigation ready."
    );

}


/* =========================================================
   PUBLIC HELPERS
========================================================= */

export function getActivePage() {

    return normalizePage(
        APXState.activePage
    );

}


export function isOnPage(page) {

    return (
        normalizePage(
            APXState.activePage
        ) ===
        normalizePage(page)
    );

}


export function refreshNavigation() {

    bindNavigationButtons();

    initializePageState();

    refreshFocus?.();

}
