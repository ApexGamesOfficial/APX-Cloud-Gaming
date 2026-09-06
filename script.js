/* =========================================================
   APX CLOUD GAMING
   v0.1 UI PROTOTYPE
========================================================= */


/* =========================================================
   GAMES

   Future:
   This should eventually come from the user's REAL
   Apex Games Library + cloud compatibility data.
========================================================= */

const APX_GAMES = [

    {
        id: "apex-demo",

        title: "Apex Demo",

        artTitle: "APEX DEMO",

        developer: "Apex Games",

        genre: "Action",

        description:
            "Enter the Apex Games ecosystem through the cloud with the official demonstration experience.",

        cloudReady: true,

        accent: "blue",

        lastPlayed: "Today",

        progress: "Ready to play"

    },


    {
        id: "project-unknown",

        title: "Project Unknown",

        artTitle: "PROJECT UNKNOWN",

        developer: "Apex Games",

        genre: "Adventure",

        description:
            "An upcoming Apex Games adventure currently in development.",

        cloudReady: true,

        accent: "dark",

        lastPlayed: "Not played",

        progress: "Coming Soon"

    }

];


let selectedGame =
    APX_GAMES[0];

let currentView =
    "home";


/* =========================================================
   ELEMENTS
========================================================= */

const bootScreen =
    document.getElementById("bootScreen");

const bootStatus =
    document.getElementById("bootStatus");

const hero =
    document.getElementById("hero");

const heroTitle =
    document.getElementById("heroTitle");

const heroDescription =
    document.getElementById("heroDescription");

const heroGenre =
    document.getElementById("heroGenre");

const heroPosition =
    document.getElementById("heroPosition");

const heroPlayButton =
    document.getElementById("heroPlayButton");

const heroDetailsButton =
    document.getElementById("heroDetailsButton");

const continueGames =
    document.getElementById("continueGames");

const cloudGames =
    document.getElementById("cloudGames");

const libraryGrid =
    document.getElementById("libraryGrid");

const recentList =
    document.getElementById("recentList");

const detailsPanel =
    document.getElementById("detailsPanel");

const detailsClose =
    document.getElementById("detailsClose");

const detailsTitle =
    document.getElementById("detailsTitle");

const detailsDescription =
    document.getElementById("detailsDescription");

const detailsDeveloper =
    document.getElementById("detailsDeveloper");

const detailsGenre =
    document.getElementById("detailsGenre");

const detailsPlayButton =
    document.getElementById("detailsPlayButton");

const sessionOverlay =
    document.getElementById("sessionOverlay");

const sessionTitle =
    document.getElementById("sessionTitle");

const sessionStatus =
    document.getElementById("sessionStatus");

const sessionDescription =
    document.getElementById("sessionDescription");

const sessionSpinner =
    document.getElementById("sessionSpinner");

const cancelSession =
    document.getElementById("cancelSession");

const searchButton =
    document.getElementById("searchButton");

const searchOverlay =
    document.getElementById("searchOverlay");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");


/* =========================================================
   BOOT
========================================================= */

async function startAPX() {

    const statuses = [

        "Starting APX",

        "Connecting to Apex Games",

        "Loading your cloud library",

        "APX Ready"

    ];


    for (
        let index = 0;
        index < statuses.length;
        index++
    ) {

        bootStatus.textContent =
            statuses[index];

        await wait(
            index === statuses.length - 1
                ? 350
                : 480
        );

    }


    bootScreen.classList.add(
        "complete"
    );

    document.body.classList.remove(
        "booting"
    );

    document.body.classList.add(
        "ready"
    );

}


/* =========================================================
   WAIT
========================================================= */

function wait(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================================
   CARD HTML
========================================================= */

function createGameCard(game) {

    const selected =
        game.id === selectedGame.id
            ? "selected"
            : "";

    const dark =
        game.accent === "dark"
            ? "dark"
            : "";


    return `

        <article
            class="game-card ${dark} ${selected}"
            data-game-id="${game.id}"
            tabindex="0"
        >

            <div class="game-card-art">

                <strong>
                    ${game.artTitle}
                </strong>

            </div>


            <div class="game-card-overlay">

                <span>
                    APX READY
                </span>

                <h3>
                    ${game.title}
                </h3>

            </div>

        </article>

    `;

}


/* =========================================================
   RENDER GAMES
========================================================= */

function renderGames() {

    const cloudReadyGames =
        APX_GAMES.filter(
            game =>
                game.cloudReady
        );


    continueGames.innerHTML =
        cloudReadyGames
            .slice(0, 2)
            .map(createGameCard)
            .join("");


    cloudGames.innerHTML =
        cloudReadyGames
            .map(createGameCard)
            .join("");


    libraryGrid.innerHTML =
        cloudReadyGames
            .map(createGameCard)
            .join("");


    bindGameCards();

}


/* =========================================================
   RECENT
========================================================= */

function renderRecent() {

    recentList.innerHTML =
        APX_GAMES
            .map(
                game => `

                    <article class="recent-item">

                        <div class="recent-art">
                            ${game.artTitle}
                        </div>

                        <div class="recent-copy">

                            <h3>
                                ${game.title}
                            </h3>

                            <p>
                                ${game.lastPlayed}
                                ·
                                ${game.progress}
                            </p>

                        </div>

                    </article>

                `
            )
            .join("");

}


/* =========================================================
   GAME SELECT
========================================================= */

function selectGame(gameId) {

    const game =
        APX_GAMES.find(
            item =>
                item.id === gameId
        );


    if (!game) {
        return;
    }


    selectedGame =
        game;


    updateHero();

    renderGames();

}


/* =========================================================
   HERO
========================================================= */

function updateHero() {

    heroTitle.textContent =
        selectedGame.title;

    heroDescription.textContent =
        selectedGame.description;

    heroGenre.textContent =
        selectedGame.genre;


    const index =
        APX_GAMES.findIndex(
            game =>
                game.id === selectedGame.id
        );


    heroPosition.textContent =
        `${String(index + 1).padStart(2, "0")} / ${String(APX_GAMES.length).padStart(2, "0")}`;


    hero.classList.toggle(
        "dark",
        selectedGame.accent === "dark"
    );

}


/* =========================================================
   BIND GAME CARDS
========================================================= */

function bindGameCards() {

    document
        .querySelectorAll(
            ".game-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        selectGame(
                            card.dataset.gameId
                        );

                        switchView(
                            "home"
                        );

                    }
                );


                card.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            card.click();

                        }

                    }
                );

            }
        );

}


/* =========================================================
   NAVIGATION
========================================================= */

function switchView(viewName) {

    currentView =
        viewName;


    document
        .querySelectorAll(".view")
        .forEach(
            view =>
                view.classList.remove(
                    "active"
                )
        );


    document
        .querySelector(
            `#${viewName}View`
        )
        ?.classList.add(
            "active"
        );


    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.view === viewName
                );

            }
        );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   DETAILS
========================================================= */

function openDetails() {

    detailsTitle.textContent =
        selectedGame.title;

    detailsDescription.textContent =
        selectedGame.description;

    detailsDeveloper.textContent =
        selectedGame.developer;

    detailsGenre.textContent =
        selectedGame.genre;


    detailsPanel.classList.add(
        "open"
    );

    detailsPanel.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeDetailsPanel() {

    detailsPanel.classList.remove(
        "open"
    );

    detailsPanel.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   CLOUD SESSION

   UI PROTOTYPE ONLY.

   No actual remote gaming server exists yet.
========================================================= */

async function launchSession() {

    closeDetailsPanel();


    sessionOverlay.hidden =
        false;

    sessionTitle.textContent =
        selectedGame.title;


    sessionSpinner.hidden =
        false;

    cancelSession.hidden =
        false;


    const states = [

        [
            "Checking your Apex Games Library...",
            "Confirming this title is available for APX."
        ],

        [
            "Finding an APX server...",
            "Searching for an available cloud gaming session."
        ],

        [
            "Preparing your session...",
            "Getting your cloud environment ready."
        ]

    ];


    for (const state of states) {

        if (
            sessionOverlay.hidden
        ) {
            return;
        }


        sessionStatus.textContent =
            state[0];

        sessionDescription.textContent =
            state[1];


        await wait(850);

    }


    if (
        sessionOverlay.hidden
    ) {
        return;
    }


    sessionSpinner.hidden =
        true;


    sessionStatus.textContent =
        "APX Cloud Streaming isn't connected yet.";

    sessionDescription.textContent =
        "This is the APX v0.1 interface prototype. Real cloud gaming servers and streaming will be connected in a future version.";


    cancelSession.textContent =
        "Return to APX";

}


/* =========================================================
   SEARCH
========================================================= */

function openSearch() {

    searchOverlay.hidden =
        false;

    searchInput.value =
        "";

    renderSearchResults(
        APX_GAMES
    );


    setTimeout(
        () =>
            searchInput.focus(),
        50
    );

}


function closeSearchOverlay() {

    searchOverlay.hidden =
        true;

}


function renderSearchResults(games) {

    if (
        games.length === 0
    ) {

        searchResults.innerHTML =
            `

                <div class="recent-item">

                    <div class="recent-copy">

                        <h3>
                            No games found
                        </h3>

                        <p>
                            Try another search.
                        </p>

                    </div>

                </div>

            `;

        return;

    }


    searchResults.innerHTML =
        games
            .map(
                game => `

                    <article
                        class="recent-item search-game"
                        data-game-id="${game.id}"
                        tabindex="0"
                    >

                        <div class="recent-art">
                            ${game.artTitle}
                        </div>

                        <div class="recent-copy">

                            <h3>
                                ${game.title}
                            </h3>

                            <p>
                                ${game.genre}
                                ·
                                APX Ready
                            </p>

                        </div>

                    </article>

                `
            )
            .join("");


    document
        .querySelectorAll(
            ".search-game"
        )
        .forEach(
            result => {

                result.addEventListener(
                    "click",
                    () => {

                        selectGame(
                            result.dataset.gameId
                        );

                        closeSearchOverlay();

                        switchView(
                            "home"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

document
    .querySelectorAll(
        ".nav-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () =>
                    switchView(
                        button.dataset.view
                    )
            );

        }
    );


document
    .querySelectorAll(
        "[data-open-library]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () =>
                    switchView(
                        "library"
                    )
            );

        }
    );


document
    .getElementById(
        "homeButton"
    )
    .addEventListener(
        "click",
        () =>
            switchView(
                "home"
            )
    );


heroDetailsButton.addEventListener(
    "click",
    openDetails
);


detailsClose.addEventListener(
    "click",
    closeDetailsPanel
);


heroPlayButton.addEventListener(
    "click",
    launchSession
);


detailsPlayButton.addEventListener(
    "click",
    launchSession
);


cancelSession.addEventListener(
    "click",
    () => {

        sessionOverlay.hidden =
            true;

        cancelSession.textContent =
            "Cancel";

    }
);


searchButton.addEventListener(
    "click",
    openSearch
);


closeSearch.addEventListener(
    "click",
    closeSearchOverlay
);


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        const matches =
            APX_GAMES.filter(
                game =>
                    game.title
                        .toLowerCase()
                        .includes(query) ||

                    game.genre
                        .toLowerCase()
                        .includes(query)
            );


        renderSearchResults(
            matches
        );

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeDetailsPanel();

            closeSearchOverlay();

        }

    }
);


/* =========================================================
   START
========================================================= */

function initAPX() {

    renderGames();

    renderRecent();

    updateHero();

    startAPX();

}


document.addEventListener(
    "DOMContentLoaded",
    initAPX
);
