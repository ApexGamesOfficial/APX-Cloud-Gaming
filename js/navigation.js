/*
    APX Cloud Gaming
    v0.4

    SYSTEM NAVIGATION
*/

import {
    APXState,
    setActivePage,
    setInputMode
}
from "./state.js";

import {
    selectNextGame,
    selectPreviousGame,
    getSelectedCardElement
}
from "./carousel.js";

import {
    setFocusTarget,
    refreshFocusFrame
}
from "./focus.js";


let initialized = false;


/* ---------------------------------------
   INPUT HELPERS
--------------------------------------- */

function isTyping() {

    const element =
        document.activeElement;

    if (!element) {
        return false;
    }

    return (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA" ||
        element.isContentEditable
    );
}


/* ---------------------------------------
   KEYBOARD
--------------------------------------- */

function handleKeyDown(event) {

    if (isTyping()) {
        return;
    }

    setInputMode("keyboard");


    /*
        HOME CAROUSEL
    */

    if (
        APXState.activePage === "home" &&
        window.scrollY <
            window.innerHeight * 0.55
    ) {

        if (event.key === "ArrowRight") {

            event.preventDefault();

            selectNextGame(
                "keyboard"
            );

            return;
        }


        if (event.key === "ArrowLeft") {

            event.preventDefault();

            selectPreviousGame(
                "keyboard"
            );

            return;
        }


        if (event.key === "Enter") {

            const selected =
                getSelectedCardElement();

            if (selected) {
                selected.click();
            }

            return;
        }
    }


    /*
        QUICK APX AI

        A will eventually summon the
        bottom-left APX AI assistant.

        We broadcast the request here
        instead of putting AI code inside
        navigation.js.
    */

    if (
        event.key.toLowerCase() === "a" &&
        APXState.activePage !== "apx-ai"
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
        ESCAPE / BACK
    */

    if (event.key === "Escape") {

        window.dispatchEvent(
            new CustomEvent(
                "apx:back"
            )
        );
    }
}


/* ---------------------------------------
   POINTER INPUT
--------------------------------------- */

function handlePointerDown() {

    setInputMode("pointer");
}


/* ---------------------------------------
   NAVIGATION BUTTONS
--------------------------------------- */

function handleNavClick(event) {

    const navItem =
        event.target.closest(
            "[data-apx-page]"
        );

    if (!navItem) {
        return;
    }


    const page =
        navItem.dataset.apxPage;

    if (!page) {
        return;
    }


    navigateToPage(
        page,
        {
            source: "pointer"
        }
    );
}


/* ---------------------------------------
   NAVIGATE PAGE
--------------------------------------- */

export function navigateToPage(
    page,
    options = {}
) {

    const previousPage =
        APXState.activePage;


    if (
        !page ||
        previousPage === page
    ) {

        updateNavigationUI();

        return;
    }


    setActivePage(page);


    updateNavigationUI();


    window.dispatchEvent(
        new CustomEvent(
            "apx:pagechange",
            {
                detail: {
                    page,
                    previousPage,
                    source:
                        options.source ||
                        "system"
                }
            }
        )
    );


    requestAnimationFrame(
        () => {

            const activeNav =
                document.querySelector(
                    `[data-apx-page="${page}"]`
                );

            if (activeNav) {

                setFocusTarget(
                    activeNav,
                    {
                        track: true,
                        duration: 450
                    }
                );
            }

            refreshFocusFrame();
        }
    );
}


/* ---------------------------------------
   UPDATE NAV UI
--------------------------------------- */

export function updateNavigationUI() {

    const navItems =
        document.querySelectorAll(
            "[data-apx-page]"
        );


    navItems.forEach(
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

            } else {

                item.removeAttribute(
                    "aria-current"
                );
            }
        }
    );
}


/* ---------------------------------------
   PAGE REQUESTS
--------------------------------------- */

export function openHome() {

    navigateToPage(
        "home",
        {
            source: "system"
        }
    );
}


export function openFriends() {

    navigateToPage(
        "friends",
        {
            source: "system"
        }
    );
}


export function openAPXAI() {

    navigateToPage(
        "apx-ai",
        {
            source: "system"
        }
    );
}


export function openChat() {

    navigateToPage(
        "chat",
        {
            source: "system"
        }
    );
}


/* ---------------------------------------
   SCROLL NAVIGATION
--------------------------------------- */

function handleScroll() {

    /*
        The Welcome/Game Hub system will
        eventually react to this.

        For now we simply keep the
        universal focus frame accurate.
    */

    requestAnimationFrame(
        refreshFocusFrame
    );
}


/* ---------------------------------------
   INITIALIZE
--------------------------------------- */

export function initNavigation() {

    if (initialized) {
        return;
    }

    initialized = true;


    document.addEventListener(
        "keydown",
        handleKeyDown
    );


    document.addEventListener(
        "pointerdown",
        handlePointerDown
    );


    document.addEventListener(
        "click",
        handleNavClick
    );


    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );


    updateNavigationUI();
}
