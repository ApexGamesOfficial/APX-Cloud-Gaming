/* =========================================================
   APX v0.31
   SYSTEM UI

   Main v0.31 change:
   Persistent animated game carousel.
========================================================= */


/* =========================================================
   TEMPORARY APX LIBRARY
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

let carouselLocked = false;


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

}


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


window.addEventListener(
    "resize",
    () => {

        const hovered =
            document.querySelector(
                ".focusable:hover"
            );


        const focused =
            document.activeElement;


        if (hovered) {

            moveFocusFrame(
                hovered
            );

        }

        else if (
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
   CREATE PERSISTENT CAROUSEL

   This runs ONCE.

   We no longer delete/recreate the cards when changing
   selection. That allows CSS transitions to animate them.
========================================================= */

function createCarousel() {

    gameCarousel.innerHTML =
        APX_GAMES
            .map(
                (game, index) => {

                    return `

                        <button
                            class="
                                game-card
                                focusable
                                ${
                                    game.theme === "dark"
                                        ? "dark"
                                        : ""
                                }
                            "
                            data-game-index="${index}"
                            data-focus-radius="28"
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
   CAROUSEL DISTANCE
========================================================= */

function getCircularOffset(
    index
) {

    let offset =
        index -
        selectedGameIndex;


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


    return offset;

}


/* =========================================================
   RESPONSIVE CAROUSEL SPACING
========================================================= */

function getCarouselSpacing() {

    const width =
        window.innerWidth;


    if (
        width <= 560
    ) {

        return 205;

    }


    if (
        width <= 760
    ) {

        return 245;

    }


    if (
        width <= 1000
    ) {

        return 285;

    }


    return 350;

}


/* =========================================================
   UPDATE CAROUSEL POSITIONS
========================================================= */

function updateCarousel(
    animateFocus = true
) {

    const spacing =
        getCarouselSpacing();


    const cards =
        document.querySelectorAll(
            ".game-card"
        );


    cards.forEach(
        card => {

            const index =
                Number(
                    card.dataset.gameIndex
                );


            const offset =
                getCircularOffset(
                    index
                );


            const distance =
                Math.abs(
                    offset
                );


            /*
               Selected card:
               center + full size.

               Neighbor:
               pushed sideways and smaller.

               Further cards:
               even smaller and dimmer.
            */

            let scale =
                1;

            let opacity =
                1;

            let brightness =
                1;

            let depth =
                0;


            if (
                distance === 0
            ) {

                scale =
                    1.13;

                opacity =
                    1;

                brightness =
                    1;

                depth =
                    70;


                card.classList.add(
                    "selected"
                );


                card.style.zIndex =
                    "50";

            }

            else if (
                distance === 1
            ) {

                scale =
                    .88;

                opacity =
                    .72;

                brightness =
                    .66;

                depth =
                    0;


                card.classList.remove(
                    "selected"
                );


                card.style.zIndex =
                    "30";

            }

            else {

                scale =
                    .76;

                opacity =
                    .38;

                brightness =
                    .48;

                depth =
                    -80;


                card.classList.remove(
                    "selected"
                );


                card.style.zIndex =
                    "10";

            }


            card.style.setProperty(
                "--x",
                `${offset * spacing}px`
            );


            card.style.setProperty(
                "--scale",
                scale
            );


            card.style.setProperty(
                "--opacity",
                opacity
            );


            card.style.setProperty(
                "--brightness",
                brightness
            );


            card.style.setProperty(
                "--depth",
                `${depth}px`
            );

        }
    );


    if (
        animateFocus
    ) {

        /*
           The focus ring waits slightly so it glides
           toward the newly selected card as the carousel
           itself begins moving.
        */

        setTimeout(
            () => {

                const selected =
                    document.querySelector(
                        ".game-card.selected"
                    );


                if (
                    selected &&
                    activePage === "home" &&
                    window.scrollY <
                    window.innerHeight * .55
                ) {

                    moveFocusFrame(
                        selected
                    );

                }

            },
            45
        );

    }

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
        index === selectedGameIndex ||
        carouselLocked
    ) {

        return;

    }


    carouselLocked =
        true;


    /*
       Fade current title down while cards begin moving.
    */

    selectedGameCopy.classList.add(
        "changing"
    );


    selectedGameIndex =
        index;


    /*
       Existing cards now physically move.
    */

    updateCarousel();


    /*
       Background starts crossfade at the same time.
    */

    updateBackground();


    await wait(210);


    /*
       Change text during movement.
    */

    updateGameInformation();


    await wait(90);


    selectedGameCopy.classList.remove(
        "changing"
    );


    /*
       Carousel animation is roughly 720ms.
    */

    await wait(430);


    carouselLocked =
        false;

}


/* =========================================================
   NEXT / PREVIOUS
========================================================= */

function nextSelectedGame() {

    if (
        carouselLocked
    ) {
        return;
    }


    const next =
        (
            selectedGameIndex + 1
        ) %
        APX_GAMES.length;


    selectGame(
        next
    );

}


function previousSelectedGame() {

    if (
        carouselLocked
    ) {
        return;
    }


    const previous =
        (
            selectedGameIndex -
            1 +
            APX_GAMES.length
        ) %
        APX_GAMES.length;


    selectGame(
        previous
    );

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


    /*
       Force browser to acknowledge the inactive state
       before turning the incoming layer on.
    */

    void incoming.offsetWidth;


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
   GAME HUB
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

    if (
        !games.length
    ) {

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


                        updateCarousel(
                            false
                        );


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
   APX AI LOCAL RESPONSE ENGINE
========================================================= */

function understandAPXCommand(
    rawMessage
) {

    const message =
        rawMessage
            .trim()
            .toLowerCase();


    if (
        !message
    ) {

        return {

            text:
                "Say something and I'll try to help.",

            action:
                null

        };

    }


    if (
        /^(hello|hi|hey|yo|sup|what's up|whats up)[!. ]*$/
            .test(
                message
            )
    ) {

        return {

            text:
                "Hey! How can I help?",

            action:
                null

        };

    }


    if (
        message.includes(
            "thank"
        )
    ) {

        return {

            text:
                "You're welcome!",

            action:
                null

        };

    }


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

            action:
                null

        };

    }


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


    const matchedGame =
        APX_GAMES.find(
            game => {

                return message.includes(
                    game.title
                        .toLowerCase()
                );

            }
        );


    if (
        matchedGame
    ) {

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


        if (
            wantsOpen
        ) {

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

            action:
                null

        };

    }


    return {

        text:
            "I'm still learning. I can talk with you, open APX games, or take you to Friends.",

        action:
            null

    };

}


/* =========================================================
   EXECUTE AI ACTION
========================================================= */

async function executeAIAction(
    action
) {

    if (
        !action
    ) {
        return;
    }


    await wait(
        650
    );


    if (
        action.type ===
        "page"
    ) {

        openPage(
            action.page
        );


        return;

    }


    if (
        action.type ===
        "game"
    ) {

        const index =
            APX_GAMES.findIndex(
                game =>
                    game.id ===
                    action.gameId
            );


        if (
            index === -1
        ) {
            return;
        }


        selectedGameIndex =
            index;


        updateCarousel(
            false
        );


        updateGameInformation();


        updateBackground();


        openPage(
            "home"
        );


        await wait(
            500
        );


        launchGame();

    }

}


/* =========================================================
   FULL APX AI
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


    if (
        !message
    ) {
        return;
    }


    addAIMessage(
        "user",
        message
    );


    aiInput.value =
        "";


    await wait(
        650
    );


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

    if (
        !message.trim()
    ) {
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


    await wait(
        1200
    );


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

        await wait(
            1200
        );


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


        await wait(
            700
        );

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
        "APX v0.31 is currently the interface prototype. Real remote game streaming will be connected later.";


    sessionClose.textContent =
        "Return to APX";

}


/* =========================================================
   PAGE EVENTS
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
                        .includes(
                            query
                        )

                    ||

                    game.genre
                        .toLowerCase()
                        .includes(
                            query
                        )
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
                () => {

                    quickAIInput.focus();

                },
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
            target.tagName === "TEXTAREA" ||
            target.isContentEditable;


        if (
            event.key ===
            "Escape"
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


        if (
            typing
        ) {
            return;
        }


        /*
           A = Quick APX AI
        */

        if (
            event.key.toLowerCase() ===
            "a"
        ) {

            event.preventDefault();


            openQuickAI();


            return;

        }


        /*
           HOME CAROUSEL
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
   TOUCH SWIPE

   Useful for the iPad test you're doing right now.
========================================================= */

let carouselTouchStartX =
    null;


gameCarousel.addEventListener(
    "touchstart",
    event => {

        carouselTouchStartX =
            event.touches[0]
                .clientX;

    },
    {
        passive: true
    }
);


gameCarousel.addEventListener(
    "touchend",
    event => {

        if (
            carouselTouchStartX ===
            null
        ) {
            return;
        }


        const endX =
            event.changedTouches[0]
                .clientX;


        const difference =
            endX -
            carouselTouchStartX;


        carouselTouchStartX =
            null;


        if (
            Math.abs(
                difference
            ) < 45
        ) {
            return;
        }


        if (
            difference < 0
        ) {

            nextSelectedGame();

        }

        else {

            previousSelectedGame();

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   RESIZE CAROUSEL
========================================================= */

window.addEventListener(
    "resize",
    () => {

        updateCarousel(
            false
        );

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initAPX() {

    /*
       Build cards once.
    */

    createCarousel();


    /*
       Position them immediately.
    */

    updateCarousel(
        false
    );


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
