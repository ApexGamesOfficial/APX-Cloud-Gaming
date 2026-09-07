/* =========================================================
   APX v0.41
   STORE

   APX Store interface.

   v0.41:
   - Reads game data from games.js
   - Shows actual game entries only
   - Supports search
   - Shows APX compatibility accurately
   - Can jump from Store -> Home game card

   Future:
   - Real Apex Games catalog
   - Ownership
   - Library acquisition
   - Account entitlements
   - APX compatibility data
========================================================= */

import {
    getStoreGames,
    getGameById
} from "./games.js";


/* =========================================================
   STATE
========================================================= */

let storeQuery =
    "";

let storeInitialized =
    false;


/* =========================================================
   ELEMENT HELPERS
========================================================= */

function getElement(id) {

    return document.getElementById(
        id
    );

}


/* =========================================================
   STORE DATA
========================================================= */

export function getAPXStoreGames() {

    return getStoreGames();

}


function getFilteredStoreGames() {

    const games =
        getAPXStoreGames();


    const query =
        storeQuery
            .trim()
            .toLowerCase();


    if (!query) {

        return games;

    }


    return games.filter(
        game => {

            const searchable =
                [
                    game.title,
                    game.developer,
                    game.genre,
                    game.description,
                    game.status
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


            return searchable.includes(
                query
            );

        }
    );

}


/* =========================================================
   STORE CARD
========================================================= */

function createStoreCard(
    game
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "apx-store-card";


    card.dataset.gameId =
        game.id;


    card.dataset.apxFocus =
        "";


    card.tabIndex =
        0;


    const compatibility =
        game.apxCompatible
            ? "APX Ready"
            : game.status;


    const compatibilityClass =
        game.apxCompatible
            ? "ready"
            : "standard";


    const art =
        game.cardImage
            ? `
                <img
                    src="${game.cardImage}"
                    alt=""
                    class="apx-store-card-image"
                >
            `
            : `
                <div class="apx-store-card-fallback">
                    <span>
                        ${game.artTitle || game.title}
                    </span>
                </div>
            `;


    card.innerHTML =
        `
            <div class="apx-store-card-art">

                ${art}

                <div class="apx-store-card-overlay"></div>

                <span
                    class="
                        apx-store-status
                        ${compatibilityClass}
                    "
                >
                    ${compatibility}
                </span>

            </div>


            <div class="apx-store-card-copy">

                <span class="apx-store-developer">
                    ${game.developer || "Apex Games"}
                </span>

                <h3>
                    ${game.title}
                </h3>

                <p>
                    ${game.description || ""}
                </p>

                <div class="apx-store-card-footer">

                    <span>
                        ${game.genre || "Game"}
                    </span>

                    <button
                        class="apx-store-view"
                        type="button"
                        data-store-open="${game.id}"
                        data-apx-focus
                    >
                        View Game
                    </button>

                </div>

            </div>
        `;


    return card;

}


/* =========================================================
   EMPTY STATE
========================================================= */

function renderEmptyState(
    container
) {

    const empty =
        document.createElement(
            "div"
        );


    empty.className =
        "apx-store-empty";


    empty.innerHTML =
        `
            <span>
                STORE
            </span>

            <h3>
                No games found
            </h3>

            <p>
                Try searching for another title.
            </p>
        `;


    container.appendChild(
        empty
    );

}


/* =========================================================
   RENDER STORE
========================================================= */

export function renderAPXStore() {

    const container =
        getElement(
            "apxStoreGrid"
        );


    if (!container) {

        return;

    }


    const games =
        getFilteredStoreGames();


    container.innerHTML =
        "";


    if (!games.length) {

        renderEmptyState(
            container
        );

        return;

    }


    games.forEach(
        game => {

            container.appendChild(
                createStoreCard(
                    game
                )
            );

        }
    );


    bindStoreCardEvents();

}


/* =========================================================
   OPEN GAME

   The Store does NOT launch cloud streaming directly.

   It sends APX back Home and selects the matching game.
========================================================= */

function openStoreGame(
    gameId
) {

    const game =
        getGameById(
            gameId
        );


    if (!game) {

        return;

    }


    window.dispatchEvent(
        new CustomEvent(
            "apx:storegame",
            {
                detail: {
                    gameId:
                        game.id
                }
            }
        )
    );

}


/* =========================================================
   STORE CARD EVENTS
========================================================= */

function bindStoreCardEvents() {

    document
        .querySelectorAll(
            "[data-store-open]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        openStoreGame(
                            button.dataset.storeOpen
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            ".apx-store-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "dblclick",
                    () => {

                        openStoreGame(
                            card.dataset.gameId
                        );

                    }
                );


                card.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            event.preventDefault();


                            openStoreGame(
                                card.dataset.gameId
                            );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   SEARCH
========================================================= */

function handleStoreSearch(
    event
) {

    storeQuery =
        event.target.value || "";


    renderAPXStore();

}


export function clearStoreSearch() {

    storeQuery =
        "";


    const input =
        getElement(
            "apxStoreSearch"
        );


    if (input) {

        input.value =
            "";

    }


    renderAPXStore();

}


/* =========================================================
   STORE VISIBILITY EVENT

   navigation.js will control the actual APX screen.
   This simply makes sure Store content is current whenever
   Store is opened.
========================================================= */

function handlePageChange(
    event
) {

    if (
        event.detail?.page !==
        "store"
    ) {

        return;

    }


    renderAPXStore();

}


/* =========================================================
   BINDINGS
========================================================= */

function bindStoreEvents() {

    const search =
        getElement(
            "apxStoreSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            handleStoreSearch
        );

    }


    window.addEventListener(
        "apx:pagechange",
        handlePageChange
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

export function initAPXStore() {

    if (storeInitialized) {

        return;

    }


    storeInitialized =
        true;


    bindStoreEvents();

    renderAPXStore();


    console.log(
        "[APX] Store module ready."
    );

}
