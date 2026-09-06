/* =========================================================
   APX CLOUD GAMING
   CONSOLE UI v0.2
========================================================= */


/* =========================================================
   TEMPORARY CLOUD LIBRARY

   Later this comes from the REAL Apex Games Library.
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

        accent: "blue",

        cloudReady: true
    },


    {
        id: "project-unknown",

        title: "Project Unknown",

        artTitle: "PROJECT UNKNOWN",

        developer: "Apex Games",

        genre: "Adventure",

        description:
            "An upcoming Apex Games adventure currently in development.",

        accent: "dark",

        cloudReady: true
    }

];


let selectedIndex = 0;

let currentScreen = "games";

let sessionCancelled = false;


/* =========================================================
   ELEMENTS
========================================================= */

const bootScreen =
    document.getElementById("bootScreen");

const bootStatus =
    document.getElementById("bootStatus");

const gameBackground =
    document.getElementById("gameBackground");

const selectedEyebrow =
    document.getElementById("selectedEyebrow");

const selectedTitle =
    document.getElementById("selectedTitle");

const selectedDescription =
    document.getElementById("selectedDescription");

const selectedGenre =
    document.getElementById("selectedGenre");

const selectedDeveloper =
    document.getElementById("selectedDeveloper");

const playButton =
    document.getElementById("playButton");

const detailsButton =
    document.getElementById("detailsButton");

const gameCarousel =
    document.getElementById("gameCarousel");

const previousGame =
    document.getElementById("previousGame");

const nextGame =
    document.getElementById("nextGame");

const carouselCurrent =
    document.getElementById("carouselCurrent");

const carouselTotal =
    document.getElementById("carouselTotal");

const libraryGrid =
    document.getElementById("libraryGrid");

const detailsOverlay =
    document.getElementById("detailsOverlay");

const closeDetails =
    document.getElementById("closeDetails");

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

const aiTopButton =
    document.getElementById("aiTopButton");

const aiOverlay =
    document.getElementById("aiOverlay");

const closeAI =
    document.getElementById("closeAI");

const aiForm =
    document.getElementById("aiForm");

const aiInput =
    document.getElementById("aiInput");

const aiHeading =
    document.getElementById("aiHeading");

const aiResponse =
    document.getElementById("aiResponse");

const aiOrb =
    document.getElementById("aiOrb");

const sessionOverlay =
    document.getElementById("sessionOverlay");

const sessionGameTitle =
    document.getElementById("sessionGameTitle");

const sessionLoader =
    document.getElementById("sessionLoader");

const sessionStatus =
    document.getElementById("sessionStatus");

const sessionMessage =
    document.getElementById("sessionMessage");

const cancelSession =
    document.getElementById("cancelSession");

const settingsButton =
    document.getElementById("settingsButton");

const settingsOverlay =
    document.getElementById("settingsOverlay");

const closeSettings =
    document.getElementById("closeSettings");

const systemTime =
    document.getElementById("systemTime");

const systemDate =
    document.getElementById("systemDate");


/* =========================================================
   HELPERS
========================================================= */

function wait(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(resolve, milliseconds)
    );

}


function currentGame() {

    return APX_GAMES[selectedIndex];

}


function padNumber(number) {

    return String(number).padStart(2, "0");

}


/* =========================================================
   BOOT
========================================================= */

async function bootAPX() {

    const steps = [

        ["Starting APX", 500],

        ["Connecting to Apex Games", 550],

        ["Loading Cloud Library", 550],

        ["APX Ready", 350]

    ];


    for (const [message, delay] of steps) {

        bootStatus.textContent =
            message;

        await wait(delay);

    }


    bootScreen.classList.add(
        "complete"
    );

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now =
        new Date();


    systemTime.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


    systemDate.textContent =
        now.toLocaleDateString(
            [],
            {
                month: "short",
                day: "numeric"
            }
        );

}


/* =========================================================
   GAME TILE
========================================================= */

function gameTileHTML(
    game,
    index
) {

    const selected =
        index === selectedIndex
            ? "selected"
            : "";

    const dark =
        game.accent === "dark"
            ? "dark"
            : "";


    return `

        <article
            class="game-tile ${selected} ${dark}"
            data-game-index="${index}"
            tabindex="0"
            aria-label="${game.title}"
        >

            <div class="tile-art">

                <strong>
                    ${game.artTitle}
                </strong>

            </div>


            <div class="tile-footer">

                <span>
                    APX READY
                </span>

                <strong>
                    ${game.title}
                </strong>

            </div>

        </article>

    `;

}


/* =========================================================
   RENDER
========================================================= */

function renderCarousel() {

    gameCarousel.innerHTML =
        APX_GAMES
            .map(gameTileHTML)
            .join("");


    carouselTotal.textContent =
        padNumber(APX_GAMES.length);


    bindGameTiles();


    requestAnimationFrame(
        scrollSelectedIntoView
    );

}


function renderLibrary() {

    libraryGrid.innerHTML =
        APX_GAMES
            .filter(
                game =>
                    game.cloudReady
            )
            .map(
                (game) => {

                    const realIndex =
                        APX_GAMES.indexOf(game);

                    return gameTileHTML(
                        game,
                        realIndex
                    );

                }
            )
            .join("");


    bindGameTiles();

}


/* =========================================================
   SELECT GAME
========================================================= */

function selectGame(index) {

    if (
        index < 0 ||
        index >= APX_GAMES.length
    ) {
        return;
    }


    selectedIndex =
        index;


    updateSelectedGame();

    renderCarousel();

    renderLibrary();

}


/* =========================================================
   UPDATE SELECTED GAME
========================================================= */

function updateSelectedGame() {

    const game =
        currentGame();


    selectedTitle.textContent =
        game.title;

    selectedDescription.textContent =
        game.description;

    selectedGenre.textContent =
        game.genre;

    selectedDeveloper.textContent =
        game.developer;


    carouselCurrent.textContent =
        padNumber(
            selectedIndex + 1
        );


    gameBackground.classList.toggle(
        "dark",
        game.accent === "dark"
    );

}


/* =========================================================
   BIND TILES
========================================================= */

function bindGameTiles() {

    document
        .querySelectorAll(
            ".game-tile"
        )
        .forEach(
            tile => {

                tile.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                tile.dataset.gameIndex
                            );


                        selectGame(index);


                        if (
                            tile.closest(
                                "#libraryGrid"
                            )
                        ) {

                            switchScreen(
                                "games"
                            );

                        }

                    }
                );


                tile.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            tile.click();

                        }

                    }
                );

            }
        );

}


/* =========================================================
   SCROLL SELECTED
========================================================= */

function scrollSelectedIntoView() {

    const selected =
        gameCarousel.querySelector(
            ".game-tile.selected"
        );


    selected?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
    });

}


/* =========================================================
   NEXT / PREVIOUS
========================================================= */

function goNext() {

    const next =
        (
            selectedIndex + 1
        ) % APX_GAMES.length;


    selectGame(next);

}


function goPrevious() {

    const previous =
        (
            selectedIndex -
            1 +
            APX_GAMES.length
        ) % APX_GAMES.length;


    selectGame(previous);

}


/* =========================================================
   SCREENS
========================================================= */

function switchScreen(name) {

    currentScreen =
        name;


    document
        .querySelectorAll(
            ".games-screen, .secondary-screen"
        )
        .forEach(
            screen =>
                screen.classList.remove(
                    "active-screen"
                )
        );


    const screen =
        document.getElementById(
            `${name}Screen`
        );


    screen?.classList.add(
        "active-screen"
    );


    document
        .querySelectorAll(
            ".system-nav"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.section === name
                );

            }
        );

}


/* =========================================================
   DETAILS
========================================================= */

function openGameDetails() {

    const game =
        currentGame();


    detailsTitle.textContent =
        game.title;

    detailsDescription.textContent =
        game.description;

    detailsDeveloper.textContent =
        game.developer;

    detailsGenre.textContent =
        game.genre;


    detailsOverlay.hidden =
        false;

}


function closeGameDetails() {

    detailsOverlay.hidden =
        true;

}


/* =========================================================
   SEARCH
========================================================= */

function openGameSearch() {

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
        60
    );

}


function closeGameSearch() {

    searchOverlay.hidden =
        true;

}


function renderSearchResults(games) {

    if (!games.length) {

        searchResults.innerHTML = `

            <div class="search-result">

                <div>
                    <h3>No games found</h3>

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
                game => {

                    const index =
                        APX_GAMES.indexOf(game);


                    return `

                        <article
                            class="search-result"
                            data-search-index="${index}"
                        >

                            <div class="search-result-art">
                                ${game.artTitle}
                            </div>

                            <div>

                                <h3>
                                    ${game.title}
                                </h3>

                                <p>
                                    ${game.genre}
                                    · APX Ready
                                </p>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");


    document
        .querySelectorAll(
            "[data-search-index]"
        )
        .forEach(
            result => {

                result.addEventListener(
                    "click",
                    () => {

                        selectGame(
                            Number(
                                result.dataset.searchIndex
                            )
                        );

                        closeGameSearch();

                        switchScreen(
                            "games"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   APX AI
========================================================= */

function openAPXAI() {

    aiOverlay.hidden =
        false;

    aiHeading.textContent =
        "What do you want to play?";

    aiResponse.textContent =
        'Try saying something like "Open Apex Demo."';

    aiInput.value =
        "";


    setTimeout(
        () =>
            aiInput.focus(),
        70
    );

}


function closeAPXAI() {

    aiOverlay.hidden =
        true;

}


/* =========================================================
   APX AI COMMAND
========================================================= */

async function processAICommand(
    rawCommand
) {

    const command =
        rawCommand
            .trim()
            .toLowerCase();


    if (!command) {
        return;
    }


    aiHeading.textContent =
        "APX is listening...";

    aiResponse.textContent =
        rawCommand;


    await wait(300);


    /* Library */

    if (
        command.includes("library")
    ) {

        aiHeading.textContent =
            "Sure!";

        aiResponse.textContent =
            "Opening your Apex Games Library.";


        await wait(650);


        closeAPXAI();

        switchScreen(
            "library"
        );

        return;

    }


    /* Find matching game */

    const matchedGame =
        APX_GAMES.find(
            game => {

                const title =
                    game.title.toLowerCase();


                return (
                    command.includes(title) ||
                    title
                        .split(" ")
                        .every(
                            word =>
                                command.includes(word)
                        )
                );

            }
        );


    if (matchedGame) {

        const index =
            APX_GAMES.indexOf(
                matchedGame
            );


        aiHeading.textContent =
            "Sure!";

        aiResponse.textContent =
            `Opening ${matchedGame.title}.`;


        await wait(700);


        selectGame(index);

        switchScreen(
            "games"
        );


        await wait(300);


        closeAPXAI();


        await wait(300);


        launchCloudSession();

        return;

    }


    /* Unknown */

    aiHeading.textContent =
        "I couldn't find that game.";

    aiResponse.textContent =
        "Try asking me to open a game that's currently in your APX Library.";

}


/* =========================================================
   CLOUD SESSION

   UI PROTOTYPE ONLY.
   DOES NOT CLAIM A REAL SERVER EXISTS.
========================================================= */

async function launchCloudSession() {

    sessionCancelled =
        false;


    const game =
        currentGame();


    sessionOverlay.hidden =
        false;

    sessionGameTitle.textContent =
        game.title;

    sessionLoader.hidden =
        false;

    cancelSession.textContent =
        "Cancel";


    const states = [

        [
            "Checking your Apex Games Library...",
            "Confirming access to this title."
        ],

        [
            "Checking APX compatibility...",
            "Preparing the cloud gaming experience."
        ],

        [
            "Looking for an APX session...",
            "Cloud streaming infrastructure is currently a prototype."
        ]

    ];


    for (const state of states) {

        if (sessionCancelled) {
            return;
        }


        sessionStatus.textContent =
            state[0];

        sessionMessage.textContent =
            state[1];


        await wait(850);

    }


    if (sessionCancelled) {
        return;
    }


    sessionLoader.hidden =
        true;


    sessionStatus.textContent =
        "APX streaming isn't connected yet.";

    sessionMessage.textContent =
        "This is the APX v0.2 interface prototype. Real remote game streaming will be connected in a future version.";

    cancelSession.textContent =
        "Return to APX";

}


/* =========================================================
   EVENTS
========================================================= */

previousGame.addEventListener(
    "click",
    goPrevious
);


nextGame.addEventListener(
    "click",
    goNext
);


playButton.addEventListener(
    "click",
    launchCloudSession
);


detailsButton.addEventListener(
    "click",
    openGameDetails
);


detailsPlayButton.addEventListener(
    "click",
    launchCloudSession
);


closeDetails.addEventListener(
    "click",
    closeGameDetails
);


searchButton.addEventListener(
    "click",
    openGameSearch
);


closeSearch.addEventListener(
    "click",
    closeGameSearch
);


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        const games =
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
            games
        );

    }
);


aiTopButton.addEventListener(
    "click",
    openAPXAI
);


closeAI.addEventListener(
    "click",
    closeAPXAI
);


aiForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        processAICommand(
            aiInput.value
        );

    }
);


document
    .querySelectorAll(
        "[data-ai-command]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const command =
                        button.dataset.aiCommand;


                    aiInput.value =
                        command;


                    processAICommand(
                        command
                    );

                }
            );

        }
    );


cancelSession.addEventListener(
    "click",
    () => {

        sessionCancelled =
            true;

        sessionOverlay.hidden =
            true;

    }
);


settingsButton.addEventListener(
    "click",
    () => {

        settingsOverlay.hidden =
            false;

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        settingsOverlay.hidden =
            true;

    }
);


document
    .querySelectorAll(
        ".system-nav"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    switchScreen(
                        button.dataset.section
                    );

                }
            );

        }
    );


document
    .getElementById(
        "apxHomeButton"
    )
    .addEventListener(
        "click",
        () =>
            switchScreen(
                "games"
            )
    );


/* =========================================================
   KEYBOARD / CONSOLE-LIKE NAVIGATION
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const overlayOpen =
            !detailsOverlay.hidden ||
            !searchOverlay.hidden ||
            !aiOverlay.hidden ||
            !sessionOverlay.hidden ||
            !settingsOverlay.hidden;


        if (
            event.key === "Escape"
        ) {

            closeGameDetails();

            closeGameSearch();

            closeAPXAI();

            settingsOverlay.hidden =
                true;

            return;

        }


        if (overlayOpen) {
            return;
        }


        if (
            currentScreen === "games"
        ) {

            if (
                event.key === "ArrowRight"
            ) {

                event.preventDefault();

                goNext();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                event.preventDefault();

                goPrevious();

            }


            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                launchCloudSession();

            }


            if (
                event.key.toLowerCase() === "a"
            ) {

                event.preventDefault();

                openAPXAI();

            }

        }

    }
);


/* =========================================================
   START
========================================================= */

function initAPX() {

    carouselTotal.textContent =
        padNumber(
            APX_GAMES.length
        );


    renderCarousel();

    renderLibrary();

    updateSelectedGame();

    updateClock();


    setInterval(
        updateClock,
        30000
    );


    bootAPX();

}


document.addEventListener(
    "DOMContentLoaded",
    initAPX
);
