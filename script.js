/* =========================================================
   APX v0.3
   SYSTEM UI
========================================================= */


/* =========================================================
   TEMPORARY APX LIBRARY

   Later:
   Apex Games account
       ↓
   owned games
       ↓
   APX compatibility
       ↓
   this interface
========================================================= */

const APX_GAMES = [

    {
        id: "apex-demo",

        title: "Apex Demo",

        artTitle: "APEX DEMO",

        developer: "Apex Games",

        genre: "Action",

        description:
            "Enter the Apex Games ecosystem through APX with the official demonstration experience.",

        theme: "blue",

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

        theme: "dark",

        cloudReady: true
    },


    {
        id: "future-game",

        title: "Future Game",

        artTitle: "COMING SOON",

        developer: "Apex Games",

        genre: "Coming Soon",

        description:
            "More APX-compatible games will appear here as your Apex Games Library grows.",

        theme: "blue",

        cloudReady: true
    }

];


let selectedGameIndex = 0;

let activePage = "home";

let backgroundLayer = 1;

let quickAITimer = null;


/* =========================================================
   ELEMENTS
========================================================= */

const focusFrame =
    document.getElementById(
        "apxFocusFrame"
    );

const bootScreen =
    document.getElementById(
        "bootScreen"
    );

const bootText =
    document.getElementById(
        "bootText"
    );

const backgroundOne =
    document.getElementById(
        "backgroundOne"
    );

const backgroundTwo =
    document.getElementById(
        "backgroundTwo"
    );

const selectedGameCopy =
    document.querySelector(
        ".selected-game-copy"
    );

const heroGameTitle =
    document.getElementById(
        "heroGameTitle"
    );

const heroGameDescription =
    document.getElementById(
        "heroGameDescription"
    );

const gameCarousel =
    document.getElementById(
        "gameCarousel"
    );

const previousGame =
    document.getElementById(
        "previousGame"
    );

const nextGame =
    document.getElementById(
        "nextGame"
    );

const playGameButton =
    document.getElementById(
        "playGameButton"
    );

const gameInfoButton =
    document.getElementById(
        "gameInfoButton"
    );

const scrollHint =
    document.getElementById(
        "scrollHint"
    );

const gameHub =
    document.getElementById(
        "gameHub"
    );

const returnToGames =
    document.getElementById(
        "returnToGames"
    );

const hubGameTitle =
    document.getElementById(
        "hubGameTitle"
    );

const continueTitle =
    document.getElementById(
        "continueTitle"
    );

const aboutGameText =
    document.getElementById(
        "aboutGameText"
    );

const genreTag =
    document.getElementById(
        "genreTag"
    );

const continueButton =
    document.getElementById(
        "continueButton"
    );

const aiConversation =
    document.getElementById(
        "aiConversation"
    );

const aiForm =
    document.getElementById(
        "aiForm"
    );

const aiInput =
    document.getElementById(
        "aiInput"
    );

const searchButton =
    document.getElementById(
        "searchButton"
    );

const searchOverlay =
    document.getElementById(
        "searchOverlay"
    );

const closeSearch =
    document.getElementById(
        "closeSearch"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );

const quickAI =
    document.getElementById(
        "quickAI"
    );

const quickAICard =
    document.getElementById(
        "quickAICard"
    );

const quickAIText =
    document.getElementById(
        "quickAIText"
    );

const quickAIForm =
    document.getElementById(
        "quickAIForm"
    );

const quickAIInput =
    document.getElementById(
        "quickAIInput"
    );

const sessionOverlay =
    document.getElementById(
        "sessionOverlay"
    );

const sessionTitle =
    document.getElementById(
        "sessionTitle"
    );

const sessionSpinner =
    document.getElementById(
        "sessionSpinner"
    );

const sessionStatus =
    document.getElementById(
        "sessionStatus"
    );

const sessionDescription =
    document.getElementById(
        "sessionDescription"
    );

const sessionClose =
    document.getElementById(
        "sessionClose"
    );

const clockTime =
    document.getElementById(
        "clockTime"
    );

const clockDate =
    document.getElementById(
        "clockDate"
    );


/* =========================================================
   HELPERS
========================================================= */

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

}


function getSelectedGame() {

    return APX_GAMES[
        selectedGameIndex
    ];

}


/* =========================================================
   BOOT
========================================================= */

async function bootAPX() {

    const states = [

        [
            "Starting APX",
            450
        ],

        [
            "Connecting to Apex Games",
            500
        ],

        [
            "Loading your APX experience",
            550
        ],

        [
            "Ready",
            300
        ]

    ];


    for (
        const [text, delay]
        of states
    ) {

        bootText.textContent =
            text;

        await wait(delay);

    }


    bootScreen.classList.add(
        "finished"
    );

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now =
        new Date();


    clockTime.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


    clockDate.textContent =
        now.toLocaleDateString(
            [],
            {
                month: "short",
                day: "numeric"
            }
        );

}


/* =========================================================
   UNIVERSAL APX FOCUS SYSTEM
========================================================= */

function moveFocusFrame(
    element
) {

    if (
        !element ||
        element.offsetParent === null
    ) {

        hideFocusFrame();

        return;

    }


    const rect =
        element.getBoundingClientRect();


    const gap =
        element.classList.contains(
            "game-card"
        )
            ? 9
            : 6;


    const radius =
        Number(
            element.dataset.focusRadius
        ) ||

        parseFloat(
            getComputedStyle(
                element
            ).borderRadius
        ) ||

        18;


    focusFrame.style.width =
        `${rect.width + gap * 2}px`;

    focusFrame.style.height =
        `${rect.height + gap * 2}px`;

    focusFrame.style.borderRadius =
        `${radius + gap}px`;

    focusFrame.style.transform =
        `translate3d(
            ${rect.left - gap}px,
            ${rect.top - gap}px,
            0
        )`;


    focusFrame.classList.add(
        "visible"
    );

}


function hideFocusFrame() {

    focusFrame.classList.remove(
        "visible"
    );

}


function bindFocusSystem() {

    document
        .querySelectorAll(
            ".focusable"
        )
        .forEach(
            element => {

                if (
                    element.dataset.focusBound
                ) {
                    return;
                }


                element.dataset.focusBound =
                    "true";


                element.addEventListener(
                    "mouseenter",
                    () =>
                        moveFocusFrame(
                            element
                        )
                );


                element.addEventListener(
                    "focus",
                    () =>
                        moveFocusFrame(
                            element
                        )
                );

            }
        );


    document.addEventListener(
        "mousemove",
        event => {

            if (
                !event.target.closest(
                    ".focusable"
                )
            ) {

                const focused =
                    document.activeElement;


                if (
                    !focused ||
                    !focused.classList?.contains(
                        "focusable"
                    )
                ) {

                    hideFocusFrame();

                }

            }

        }
    );

}


window.addEventListener(
    "resize",
    () => {

        const focused =
            document.activeElement;


        if (
            focused?.classList?.contains(
                "focusable"
            )
        ) {

            moveFocusFrame(
                focused
            );

        }

    }
);


window.addEventListener(
    "scroll",
    () => {

        const hovered =
            document.querySelector(
                ".focusable:hover"
            );


        if (hovered) {

            moveFocusFrame(
                hovered
            );

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   CAROUSEL
========================================================= */

function renderCarousel() {

    gameCarousel.innerHTML =
        APX_GAMES
            .map(
                (game, index) => {

                    let offset =
                        index -
                        selectedGameIndex;


                    /*
                     Circular carousel positioning.
                    */

                    const total =
                        APX_GAMES.length;


                    if (
                        offset >
                        total / 2
                    ) {

                        offset -= total;

                    }


                    if (
                        offset <
                        -total / 2
                    ) {

                        offset += total;

                    }


                    const selected =
                        index ===
                        selectedGameIndex;


                    return `

                        <button
                            class="
                                game-card
                                focusable
                                ${
                                    selected
                                        ? "selected"
                                        : ""
                                }
                                ${
                                    game.theme === "dark"
                                        ? "dark"
                                        : ""
                                }
                            "
                            style="
                                --offset:${offset};
                                z-index:${
                                    20 -
                                    Math.abs(
                                        offset
                                    )
                                };
                            "
                            data-game-index="${index}"
                            data-focus-radius="26"
                            type="button"
                        >

                            <div class="card-art">

                                <strong>
                                    ${game.artTitle}
                                </strong>

                            </div>


                            <div class="card-bottom">

                                <span>
                                    APX READY
                                </span>

                                <strong>
                                    ${game.title}
                                </strong>

                            </div>

                        </button>

                    `;

                }
            )
            .join("");


    document
        .querySelectorAll(
            ".game-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                card.dataset.gameIndex
                            );


                        if (
                            index ===
                            selectedGameIndex
                        ) {

                            launchGame();

                            return;

                        }


                        selectGame(
                            index
                        );

                    }
                );

            }
        );


    bindFocusSystem();

}


/* =========================================================
   SELECT GAME
========================================================= */

async function selectGame(
    index
) {

    if (
        index < 0 ||
        index >= APX_GAMES.length ||
        index === selectedGameIndex
    ) {
        return;
    }


    selectedGameCopy.classList.add(
        "changing"
    );


    await wait(150);


    selectedGameIndex =
        index;


    renderCarousel();

    updateGameInformation();

    updateBackground();


    await wait(80);


    selectedGameCopy.classList.remove(
        "changing"
    );


    const selected =
        document.querySelector(
            ".game-card.selected"
        );


    if (selected) {

        moveFocusFrame(
            selected
        );

    }

}


/* =========================================================
   NEXT / PREVIOUS
========================================================= */

function nextSelectedGame() {

    const next =
        (
            selectedGameIndex + 1
        ) % APX_GAMES.length;


    selectGame(next);

}


function previousSelectedGame() {

    const previous =
        (
            selectedGameIndex -
            1 +
            APX_GAMES.length
        ) % APX_GAMES.length;


    selectGame(previous);

}


/* =========================================================
   GAME INFORMATION
========================================================= */

function updateGameInformation() {

    const game =
        getSelectedGame();


    heroGameTitle.textContent =
        game.title;

    heroGameDescription.textContent =
        game.description;

    hubGameTitle.textContent =
        game.title;

    continueTitle.textContent =
        game.title;

    aboutGameText.textContent =
        game.description;

    genreTag.textContent =
        game.genre;

}


/* =========================================================
   BACKGROUND CROSSFADE
========================================================= */

function applyBackgroundTheme(
    element,
    game
) {

    element.className =
        "game-background";


    if (
        game.theme === "dark"
    ) {

        element.classList.add(
            "dark-theme"
        );

    }

}


function updateBackground() {

    const game =
        getSelectedGame();


    const incoming =
        backgroundLayer === 1
            ? backgroundTwo
            : backgroundOne;


    const outgoing =
        backgroundLayer === 1
            ? backgroundOne
            : backgroundTwo;


    applyBackgroundTheme(
        incoming,
        game
    );


    incoming.classList.add(
        "active"
    );


    outgoing.classList.remove(
        "active"
    );


    backgroundLayer =
        backgroundLayer === 1
            ? 2
            : 1;

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(
    pageName
) {

    activePage =
        pageName;


    document
        .querySelectorAll(
            ".system-page"
        )
        .forEach(
            page => {

                page.classList.remove(
                    "active-page"
                );

            }
        );


    const page =
        document.getElementById(
            `${pageName}Page`
        );


    page?.classList.add(
        "active-page"
    );


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page ===
                    pageName
                );

            }
        );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    hideFocusFrame();


    setTimeout(
        bindFocusSystem,
        50
    );

}


/* =========================================================
   GAME HUB SCROLL
========================================================= */

function openGameHub() {

    gameHub.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function returnHomeHero() {

    document
        .getElementById(
            "homeHero"
        )
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

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
        () => {

            searchInput.focus();

            moveFocusFrame(
                searchInput
            );

        },
        80
    );

}


function closeSearchOverlay() {

    searchOverlay.hidden =
        true;

    hideFocusFrame();

}


function renderSearchResults(
    games
) {

    if (!games.length) {

        searchResults.innerHTML = `

            <div class="search-result">

                <div>
                    <strong>
                        No games found
                    </strong>

                    <span>
                        Try another search.
                    </span>
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
                        APX_GAMES.indexOf(
                            game
                        );


                    return `

                        <div
                            class="
                                search-result
                                focusable
                            "
                            data-search-index="${index}"
                            data-focus-radius="17"
                            tabindex="0"
                        >

                            <div class="search-result-art">

                                ${game.artTitle}

                            </div>


                            <div>

                                <strong>
                                    ${game.title}
                                </strong>

                                <span>
                                    ${game.genre}
                                    · APX Ready
                                </span>

                            </div>

                        </div>

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

                        const index =
                            Number(
                                result.dataset.searchIndex
                            );


                        selectedGameIndex =
                            index;


                        renderCarousel();

                        updateGameInformation();

                        updateBackground();


                        closeSearchOverlay();

                        openPage(
                            "home"
                        );

                    }
                );


                result.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            result.click();

                        }

                    }
                );

            }
        );


    bindFocusSystem();

}


/* =========================================================
   APX AI RESPONSE ENGINE
   LOCAL PROTOTYPE

   Later this function is replaced by a secure
   server call to the real AI model.
========================================================= */

function understandAPXCommand(
    rawMessage
) {

    const message =
        rawMessage
            .trim()
            .toLowerCase();


    if (!message) {

        return {
            text:
                "Say something and I'll try to help.",
            action: null
        };

    }


    /* Greetings */

    if (
        /^(hello|hi|hey|yo|sup|what's up|whats up)[!. ]*$/
            .test(message)
    ) {

        return {
            text:
                "Hey! How can I help?",
            action: null
        };

    }


    /* Thanks */

    if (
        message.includes(
            "thank"
        )
    ) {

        return {
            text:
                "You're welcome!",
            action: null
        };

    }


    /* Available games */

    if (
        message.includes(
            "what games"
        ) ||
        message.includes(
            "games can i"
        )
    ) {

        const names =
            APX_GAMES
                .filter(
                    game =>
                        game.cloudReady
                )
                .map(
                    game =>
                        game.title
                )
                .join(", ");


        return {
            text:
                `Right now your APX Library includes ${names}.`,
            action: null
        };

    }


    /* Friends */

    if (
        message.includes(
            "friends"
        )
    ) {

        return {
            text:
                "Sure! Opening Friends.",
            action: {
                type:
                    "page",

                page:
                    "friends"
            }
        };

    }


    /* APX AI */

    if (
        message.includes(
            "open apx ai"
        )
    ) {

        return {
            text:
                "Opening APX AI.",
            action: {
                type:
                    "page",

                page:
                    "ai"
            }
        };

    }


    /* Find game */

    const matchedGame =
        APX_GAMES.find(
            game => {

                const title =
                    game.title
                        .toLowerCase();


                return (
                    message.includes(
                        title
                    )
                );

            }
        );


    if (matchedGame) {

        const wantsOpen =
            message.includes(
                "open"
            ) ||
            message.includes(
                "play"
            ) ||
            message.includes(
                "launch"
            ) ||
            message.includes(
                "start"
            );


        if (wantsOpen) {

            return {
                text:
                    `Sure! Opening ${matchedGame.title}.`,

                action: {
                    type:
                        "game",

                    gameId:
                        matchedGame.id
                }
            };

        }


        return {
            text:
                `${matchedGame.title} is APX Ready and available in your library.`,
            action: null
        };

    }


    return {
        text:
            "I'm still learning. I can talk with you, open APX games, or take you to Friends.",
        action: null
    };

}


/* =========================================================
   EXECUTE APX AI ACTION
========================================================= */

async function executeAIAction(
    action
) {

    if (!action) {
        return;
    }


    await wait(650);


    if (
        action.type === "page"
    ) {

        openPage(
            action.page
        );

        return;

    }


    if (
        action.type === "game"
    ) {

        const index =
            APX_GAMES.findIndex(
                game =>
                    game.id ===
                    action.gameId
            );


        if (index === -1) {
            return;
        }


        selectedGameIndex =
            index;


        renderCarousel();

        updateGameInformation();

        updateBackground();


        openPage(
            "home"
        );


        await wait(500);


        launchGame();

    }

}


/* =========================================================
   FULL APX AI PAGE
========================================================= */

function addAIMessage(
    sender,
    text
) {

    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        `ai-message ${
            sender === "user"
                ? "user-message"
                : "assistant-message"
        }`;


    const name =
        sender === "user"
            ? "YOU"
            : "APX AI";


    wrapper.innerHTML = `

        <div class="message-name">
            ${name}
        </div>

        <div class="message-bubble"></div>

    `;


    wrapper
        .querySelector(
            ".message-bubble"
        )
        .textContent =
            text;


    aiConversation.appendChild(
        wrapper
    );


    aiConversation.scrollTop =
        aiConversation.scrollHeight;

}


async function sendAIMessage(
    rawMessage
) {

    const message =
        rawMessage.trim();


    if (!message) {
        return;
    }


    addAIMessage(
        "user",
        message
    );


    aiInput.value =
        "";


    await wait(650);


    const response =
        understandAPXCommand(
            message
        );


    addAIMessage(
        "assistant",
        response.text
    );


    executeAIAction(
        response.action
    );

}


/* =========================================================
   QUICK APX AI
========================================================= */

function openQuickAI() {

    clearTimeout(
        quickAITimer
    );


    quickAI.className =
        "quick-ai visible";


    quickAIText.textContent =
        "Listening...";


    moveFocusFrame(
        quickAICard
    );


    requestAnimationFrame(
        () => {

            quickAI.classList.add(
                "listening",
                "input-open"
            );

        }
    );


    setTimeout(
        () => {

            quickAIInput.focus();

        },
        350
    );

}


async function respondQuickAI(
    message
) {

    if (!message.trim()) {
        return;
    }


    quickAI.classList.remove(
        "input-open"
    );


    quickAI.classList.add(
        "listening"
    );


    quickAIText.textContent =
        "Thinking...";


    moveFocusFrame(
        quickAICard
    );


    /*
     Intentional delay so the response
     smoothly expands after the request.
    */

    await wait(1200);


    const response =
        understandAPXCommand(
            message
        );


    quickAI.classList.add(
        "expanded"
    );


    quickAIText.textContent =
        response.text;


    moveFocusFrame(
        quickAICard
    );


    if (
        response.action
    ) {

        await wait(1200);

        executeAIAction(
            response.action
        );

    }


    quickAITimer =
        setTimeout(
            closeQuickAI,
            5500
        );

}


function closeQuickAI() {

    quickAI.className =
        "quick-ai";


    quickAIInput.value =
        "";


    if (
        document.activeElement ===
        quickAIInput
    ) {

        quickAIInput.blur();

    }


    hideFocusFrame();

}


/* =========================================================
   CLOUD SESSION PROTOTYPE
========================================================= */

async function launchGame() {

    const game =
        getSelectedGame();


    sessionTitle.textContent =
        game.title;


    sessionStatus.textContent =
        "Preparing your session...";


    sessionDescription.textContent =
        "Checking your Apex Games Library.";


    sessionSpinner.hidden =
        false;


    sessionClose.textContent =
        "Cancel";


    sessionOverlay.hidden =
        false;


    hideFocusFrame();


    const steps = [

        [
            "Checking game access...",
            "Confirming this title in your Apex Games Library."
        ],

        [
            "Checking APX compatibility...",
            "This game is marked APX Ready."
        ],

        [
            "Looking for an APX cloud session...",
            "Preparing the APX experience."
        ]

    ];


    for (
        const [status, description]
        of steps
    ) {

        if (
            sessionOverlay.hidden
        ) {
            return;
        }


        sessionStatus.textContent =
            status;

        sessionDescription.textContent =
            description;


        await wait(700);

    }


    if (
        sessionOverlay.hidden
    ) {
        return;
    }


    sessionSpinner.hidden =
        true;


    sessionStatus.textContent =
        "Cloud streaming isn't connected yet.";


    sessionDescription.textContent =
        "APX v0.3 is currently the interface prototype. Real remote game streaming will be connected later.";


    sessionClose.textContent =
        "Return to APX";

}


/* =========================================================
   EVENT BINDINGS
========================================================= */

document
    .querySelectorAll(
        ".nav-item"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openPage(
                        button.dataset.page
                    );

                }
            );

        }
    );


document
    .getElementById(
        "logoButton"
    )
    .addEventListener(
        "click",
        () => {

            openPage(
                "home"
            );

        }
    );


previousGame.addEventListener(
    "click",
    previousSelectedGame
);


nextGame.addEventListener(
    "click",
    nextSelectedGame
);


playGameButton.addEventListener(
    "click",
    launchGame
);


continueButton.addEventListener(
    "click",
    launchGame
);


gameInfoButton.addEventListener(
    "click",
    openGameHub
);


scrollHint.addEventListener(
    "click",
    openGameHub
);


returnToGames.addEventListener(
    "click",
    returnHomeHero
);


/* =========================================================
   SEARCH EVENTS
========================================================= */

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
                        .includes(query)

                    ||

                    game.genre
                        .toLowerCase()
                        .includes(query)
            );


        renderSearchResults(
            matches
        );

    }
);


/* =========================================================
   FULL AI EVENTS
========================================================= */

aiForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        sendAIMessage(
            aiInput.value
        );

    }
);


document
    .querySelectorAll(
        ".ai-suggestion"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    sendAIMessage(
                        button.dataset.command
                    );

                }
            );

        }
    );


/* =========================================================
   QUICK AI EVENTS
========================================================= */

quickAIForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const message =
            quickAIInput.value;


        quickAIInput.value =
            "";


        respondQuickAI(
            message
        );

    }
);


quickAICard.addEventListener(
    "click",
    () => {

        if (
            !quickAI.classList.contains(
                "input-open"
            )
        ) {

            quickAI.classList.add(
                "input-open"
            );


            setTimeout(
                () =>
                    quickAIInput.focus(),
                100
            );

        }

    }
);


/* =========================================================
   SESSION
========================================================= */

sessionClose.addEventListener(
    "click",
    () => {

        sessionOverlay.hidden =
            true;

        hideFocusFrame();

    }
);


/* =========================================================
   KEYBOARD / FUTURE CONTROLLER FOUNDATION
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const target =
            event.target;


        const typing =
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA";


        /*
         Escape
        */

        if (
            event.key === "Escape"
        ) {

            if (
                !searchOverlay.hidden
            ) {

                closeSearchOverlay();

                return;

            }


            if (
                !sessionOverlay.hidden
            ) {

                sessionOverlay.hidden =
                    true;

                return;

            }


            if (
                quickAI.classList.contains(
                    "visible"
                )
            ) {

                closeQuickAI();

                return;

            }

        }


        if (typing) {
            return;
        }


        /*
         Quick APX AI
        */

        if (
            event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            openQuickAI();

            return;

        }


        /*
         Home carousel navigation
        */

        if (
            activePage === "home" &&
            window.scrollY <
            window.innerHeight * .55
        ) {

            if (
                event.key ===
                "ArrowRight"
            ) {

                event.preventDefault();

                nextSelectedGame();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                event.preventDefault();

                previousSelectedGame();

            }

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initAPX() {

    renderCarousel();

    updateGameInformation();

    applyBackgroundTheme(
        backgroundOne,
        getSelectedGame()
    );

    backgroundOne.classList.add(
        "active"
    );


    updateClock();


    setInterval(
        updateClock,
        30000
    );


    bindFocusSystem();


    bootAPX();

}


document.addEventListener(
    "DOMContentLoaded",
    initAPX
);
