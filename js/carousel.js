/*
    APX Cloud Gaming
    v0.4

    HOME CAROUSEL
*/


import {
    APXState,
    setSelectedGameIndex,
    lockNavigation,
    unlockNavigation
}
from "./state.js";


import {
    APX_GAMES,
    getGameByIndex,
    normalizeGameIndex,
    getNextGameIndex,
    getPreviousGameIndex
}
from "./games.js";


import {
    setFocusTarget,
    trackFocusDuringAnimation
}
from "./focus.js";


let carouselElement = null;

let cardElements = [];

let navigationTimer = null;

const NAVIGATION_DURATION = 720;


/* ---------------------------------------
   INITIALIZE
--------------------------------------- */

export function initCarousel() {

    carouselElement =
        document.getElementById(
            "gameCarousel"
        );

    if (!carouselElement) {

        console.warn(
            "[APX] #gameCarousel not found."
        );

        return;
    }

    renderCarousel();

    updateCarousel({
        animate: false,
        updateFocus: true
    });
}


/* ---------------------------------------
   RENDER
--------------------------------------- */

export function renderCarousel() {

    if (!carouselElement) {
        return;
    }

    carouselElement.innerHTML = "";

    cardElements = [];

    APX_GAMES.forEach(
        (game, index) => {

            const card =
                document.createElement(
                    "button"
                );

            card.type = "button";

            card.className =
                "game-card";

            card.dataset.index =
                String(index);

            card.dataset.gameId =
                game.id;

            card.dataset.apxFocus =
                "true";

            card.setAttribute(
                "aria-label",
                game.title
            );


            /* ---------------------------
               ART
            --------------------------- */

            const artwork =
                document.createElement(
                    "div"
                );

            artwork.className =
                "game-card-art";


            if (game.cardImage) {

                artwork.style.backgroundImage =
                    `url("${game.cardImage}")`;

                artwork.classList.add(
                    "has-image"
                );
            }


            /* ---------------------------
               FALLBACK
            --------------------------- */

            const fallback =
                document.createElement(
                    "div"
                );

            fallback.className =
                "game-card-fallback";

            fallback.dataset.accent =
                game.accent || "blue";


            const fallbackTitle =
                document.createElement(
                    "span"
                );

            fallbackTitle.textContent =
                game.shortTitle ||
                game.title;

            fallback.appendChild(
                fallbackTitle
            );


            /* ---------------------------
               LABEL
            --------------------------- */

            const label =
                document.createElement(
                    "div"
                );

            label.className =
                "game-card-label";

            label.textContent =
                game.title;


            artwork.appendChild(
                fallback
            );

            card.appendChild(
                artwork
            );

            card.appendChild(
                label
            );


            /* ---------------------------
               CLICK
            --------------------------- */

            card.addEventListener(
                "click",
                () => {

                    selectGame(
                        index,
                        {
                            source: "pointer"
                        }
                    );
                }
            );


            /* ---------------------------
               POINTER
            --------------------------- */

            card.addEventListener(
                "pointerenter",
                () => {

                    if (
                        index ===
                        APXState.selectedGameIndex
                    ) {

                        setFocusTarget(
                            card,
                            {
                                track: true,
                                duration: 300
                            }
                        );
                    }
                }
            );


            carouselElement.appendChild(
                card
            );

            cardElements.push(
                card
            );
        }
    );
}


/* ---------------------------------------
   SELECT GAME
--------------------------------------- */

export function selectGame(
    index,
    options = {}
) {

    if (
        APXState.navigationLocked
    ) {
        return;
    }

    const normalized =
        normalizeGameIndex(index);

    const changed =
        normalized !==
        APXState.selectedGameIndex;

    setSelectedGameIndex(
        normalized
    );


    updateCarousel({
        animate: changed,
        updateFocus: true
    });


    dispatchSelectionChange(
        options.source || "system"
    );
}


/* ---------------------------------------
   NEXT
--------------------------------------- */

export function selectNextGame(
    source = "keyboard"
) {

    selectGame(
        getNextGameIndex(
            APXState.selectedGameIndex
        ),
        {
            source
        }
    );
}


/* ---------------------------------------
   PREVIOUS
--------------------------------------- */

export function selectPreviousGame(
    source = "keyboard"
) {

    selectGame(
        getPreviousGameIndex(
            APXState.selectedGameIndex
        ),
        {
            source
        }
    );
}


/* ---------------------------------------
   UPDATE CAROUSEL
--------------------------------------- */

export function updateCarousel(
    options = {}
) {

    const {
        animate = true,
        updateFocus = true
    } = options;


    const selectedIndex =
        APXState.selectedGameIndex;


    cardElements.forEach(
        (card, index) => {

            const offset =
                getRelativeOffset(
                    index,
                    selectedIndex
                );


            card.dataset.offset =
                String(offset);


            card.classList.toggle(
                "selected",
                offset === 0
            );


            card.classList.toggle(
                "near",
                Math.abs(offset) === 1
            );


            card.classList.toggle(
                "far",
                Math.abs(offset) >= 2
            );


            card.setAttribute(
                "aria-selected",
                offset === 0
                    ? "true"
                    : "false"
            );


            /*
                CSS handles the actual
                translate/scale animation.

                JS only tells CSS where
                each card belongs.
            */

            card.style.setProperty(
                "--card-offset",
                String(offset)
            );
        }
    );


    updateCarouselTransform();


    const selectedCard =
        getSelectedCardElement();


    if (
        selectedCard &&
        updateFocus
    ) {

        setFocusTarget(
            selectedCard,
            {
                track: animate,
                duration:
                    NAVIGATION_DURATION + 100
            }
        );


        if (animate) {

            trackFocusDuringAnimation(
                selectedCard,
                NAVIGATION_DURATION + 100
            );
        }
    }


    if (animate) {
        temporarilyLockNavigation();
    }
}


/* ---------------------------------------
   CAROUSEL TRANSFORM
--------------------------------------- */

function updateCarouselTransform() {

    if (!carouselElement) {
        return;
    }

    carouselElement.style.setProperty(
        "--selected-index",
        String(
            APXState.selectedGameIndex
        )
    );
}


/* ---------------------------------------
   RELATIVE OFFSET
--------------------------------------- */

function getRelativeOffset(
    cardIndex,
    selectedIndex
) {

    const total =
        APX_GAMES.length;

    let difference =
        cardIndex - selectedIndex;


    /*
        Wrap around so navigating from
        the last card to the first card
        still feels continuous.
    */

    if (
        difference > total / 2
    ) {
        difference -= total;
    }


    if (
        difference < -total / 2
    ) {
        difference += total;
    }


    return difference;
}


/* ---------------------------------------
   TEMP NAVIGATION LOCK
--------------------------------------- */

function temporarilyLockNavigation() {

    lockNavigation();


    if (navigationTimer) {

        clearTimeout(
            navigationTimer
        );
    }


    navigationTimer =
        setTimeout(
            () => {

                unlockNavigation();

                navigationTimer = null;

            },
            180
        );
}


/* ---------------------------------------
   SELECTED ELEMENT
--------------------------------------- */

export function getSelectedCardElement() {

    return (
        cardElements[
            APXState.selectedGameIndex
        ] || null
    );
}


/* ---------------------------------------
   SELECTED GAME
--------------------------------------- */

export function getSelectedGame() {

    return getGameByIndex(
        APXState.selectedGameIndex
    );
}


/* ---------------------------------------
   SELECT BY ID
--------------------------------------- */

export function selectGameById(
    gameId,
    source = "system"
) {

    const index =
        APX_GAMES.findIndex(
            game =>
                game.id === gameId
        );


    if (index === -1) {

        console.warn(
            `[APX] Unknown game: ${gameId}`
        );

        return false;
    }


    selectGame(
        index,
        {
            source
        }
    );


    return true;
}


/* ---------------------------------------
   SELECTION EVENT
--------------------------------------- */

function dispatchSelectionChange(
    source
) {

    const game =
        getSelectedGame();


    window.dispatchEvent(
        new CustomEvent(
            "apx:gamechange",
            {
                detail: {
                    game,
                    index:
                        APXState.selectedGameIndex,
                    source
                }
            }
        )
    );
}


/* ---------------------------------------
   REFRESH
--------------------------------------- */

export function refreshCarousel() {

    updateCarousel({
        animate: false,
        updateFocus: true
    });
}
