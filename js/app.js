/* =========================================================
   APX v0.41
   MAIN APPLICATION BOOTSTRAP

   Home + Store + APX ZERO integration.

   IMPORTANT:
   Modules are dynamically imported so one broken dependency
   cannot permanently trap APX on the boot screen.

   APX v0.41 DOES NOT provide real cloud streaming.
========================================================= */


/* =========================================================
   APP STATE
========================================================= */

let APXBooted = false;

let stateModule = null;
let gamesModule = null;
let focusModule = null;
let carouselModule = null;
let navigationModule = null;
let storeModule = null;
let zeroModule = null;

let clockTimer = null;

let currentBackgroundLayer = "current";


/* =========================================================
   HELPERS
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function wait(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}


function getState() {

    if (!stateModule) {
        return null;
    }

    return stateModule.getAPXState
        ? stateModule.getAPXState()
        : stateModule.APXState;

}


/* =========================================================
   BOOT SCREEN
========================================================= */

function finishBootScreen() {

    const bootScreen =
        getElement("bootScreen");


    document.body.classList.add(
        "apx-ready"
    );


    if (!bootScreen) {
        return;
    }


    bootScreen.classList.add(
        "finished"
    );


    /*
       Never allow the faded boot screen to continue
       intercepting mouse/touch input.
    */

    window.setTimeout(
        () => {

            bootScreen.style.pointerEvents =
                "none";

        },
        900
    );

}


/* =========================================================
   EMERGENCY BOOT RELEASE

   KEEP THIS.

   If a module fails during initialization APX still escapes
   the loading screen after five seconds.
========================================================= */

function installEmergencyBootRelease() {

    window.setTimeout(
        () => {

            if (
                !document.body.classList.contains(
                    "apx-ready"
                )
            ) {

                console.warn(
                    "[APX] Emergency boot release activated."
                );

                finishBootScreen();

            }

        },
        5000
    );

}


/* =========================================================
   APX ERROR DISPLAY
========================================================= */

function showAPXError(message) {

    console.error(
        "[APX]",
        message
    );


    let panel =
        getElement("apxRuntimeError");


    if (!panel) {

        panel =
            document.createElement("div");


        panel.id =
            "apxRuntimeError";


        Object.assign(
            panel.style,
            {

                position: "fixed",

                left: "50%",
                bottom: "24px",

                zIndex: "999999",

                width:
                    "min(620px, calc(100vw - 32px))",

                padding:
                    "13px 16px",

                border:
                    "1px solid rgba(97, 190, 255, .22)",

                borderRadius:
                    "16px",

                background:
                    "rgba(5, 14, 23, .96)",

                color:
                    "#cfe9fa",

                boxShadow:
                    "0 18px 50px rgba(0, 0, 0, .45)",

                backdropFilter:
                    "blur(20px)",

                WebkitBackdropFilter:
                    "blur(20px)",

                transform:
                    "translateX(-50%)",

                fontFamily:
                    "Inter, system-ui, sans-serif",

                fontSize:
                    "11px",

                lineHeight:
                    "1.5"

            }
        );


        document.body.appendChild(
            panel
        );

    }


    panel.textContent =
        `APX v0.41: ${message}`;

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const timeElement =
        getElement("systemTime");

    const dateElement =
        getElement("systemDate");


    if (
        !timeElement ||
        !dateElement
    ) {
        return;
    }


    const now =
        new Date();


    timeElement.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


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


function startClock() {

    updateClock();


    if (clockTimer !== null) {

        clearInterval(
            clockTimer
        );

    }


    clockTimer =
        window.setInterval(
            updateClock,
            1000
        );

}


/* =========================================================
   CURRENT CAROUSEL ITEM
========================================================= */

function getCurrentIndex() {

    const state =
        getState();


    return (
        Number(
            state?.selectedGameIndex
        ) || 0
    );

}


function getCurrentGame() {

    if (!gamesModule) {
        return null;
    }


    const index =
        getCurrentIndex();


    if (
        typeof gamesModule.getGameByIndex ===
        "function"
    ) {

        return (
            gamesModule.getGameByIndex(
                index
            ) ||
            gamesModule.APX_GAMES?.[index] ||
            null
        );

    }


    return (
        gamesModule.APX_GAMES?.[index] ||
        null
    );

}


/* =========================================================
   ITEM TYPE HELPERS
========================================================= */

function isWelcome(game) {

    return Boolean(
        game &&
        (
            game.id === "welcome" ||
            game.type === "welcome"
        )
    );

}


function isZero(game) {

    return Boolean(
        game &&
        (
            game.id === "apx-zero" ||
            game.type === "subscription"
        )
    );

}


function isPlaceholder(game) {

    return Boolean(
        game &&
        (
            game.type === "placeholder" ||
            game.id === "future-game"
        )
    );

}


/* =========================================================
   HOME MODE

   Welcome  -> Welcome Dashboard
   ZERO     -> APX ZERO section
   Game     -> Game Hub
========================================================= */

function updateHomeMode(game) {

    const welcomeSelected =
        isWelcome(game);

    const zeroSelected =
        isZero(game);


    document.body.classList.toggle(
        "welcome-selected",
        welcomeSelected
    );


    document.body.classList.toggle(
        "zero-selected",
        zeroSelected
    );


    document.body.dataset.selectedItem =
        game?.id ||
        "welcome";


    const welcomeDashboard =
        getElement("welcomeDashboard");

    const zeroSection =
        getElement("apxZeroSection");

    const gameHub =
        getElement("gameHub");


    /*
       The CSS also controls these modes.

       hidden is synchronized here as an additional guarantee.
    */

    if (welcomeDashboard) {

        welcomeDashboard.hidden =
            !welcomeSelected;

    }


    if (zeroSection) {

        zeroSection.hidden =
            !zeroSelected;

    }


    if (gameHub) {

        gameHub.hidden =
            welcomeSelected ||
            zeroSelected ||
            isPlaceholder(game);

    }

}


/* =========================================================
   SELECTED HERO COPY
========================================================= */

function updateSelectedCopy(game) {

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
            game.title ||
            "APX";

    }


    if (description) {

        description.textContent =
            game.description ||
            "";

    }


    if (developer) {

        if (isWelcome(game)) {

            developer.textContent =
                "APX";

        }

        else if (isZero(game)) {

            developer.textContent =
                "APX";

        }

        else {

            developer.textContent =
                game.developer ||
                "Apex Games";

        }

    }


    if (status) {

        if (isZero(game)) {

            status.textContent =
                game.status ||
                "Membership";

        }

        else {

            status.textContent =
                game.status ||
                (
                    game.apxCompatible
                        ? "APX Ready"
                        : "Prototype"
                );

        }

    }


    updateHomeMode(
        game
    );


    updateGameHub(
        game
    );

}


/* =========================================================
   GAME HUB
========================================================= */

function updateGameHub(game) {

    if (!game) {
        return;
    }


    /*
       Welcome and ZERO have their own lower sections.
    */

    if (
        isWelcome(game) ||
        isZero(game)
    ) {
        return;
    }


    const hubTitle =
        getElement("hubGameTitle");

    const continueTitle =
        getElement("continueGameTitle");

    const hubDescription =
        getElement("hubDescription");


    if (hubTitle) {

        hubTitle.textContent =
            game.title ||
            "APX";

    }


    if (continueTitle) {

        continueTitle.textContent =
            game.title ||
            "APX";

    }


    if (hubDescription) {

        hubDescription.textContent =
            game.description ||
            "Game information will appear here.";

    }

}


/* =========================================================
   BACKGROUND
========================================================= */

function getBackgroundElements() {

    return {

        current:
            getElement(
                "apxBackgroundCurrent"
            ),

        next:
            getElement(
                "apxBackgroundNext"
            )

    };

}


function applyBackground(
    element,
    game
) {

    if (
        !element ||
        !game
    ) {
        return;
    }


    const image =
        game.backgroundImage ||
        game.background ||
        "";


    if (image) {

        element.style.backgroundImage =
            `linear-gradient(
                0deg,
                rgba(2, 6, 11, .30),
                rgba(2, 6, 11, .12)
            ),
            url("${image}")`;


        element.style.backgroundSize =
            "cover";


        element.style.backgroundPosition =
            "center";

    }

    else {

        /*
           Clearing inline styling lets style.css control
           Welcome / ZERO / fallback themes.
        */

        element.style.backgroundImage =
            "";

        element.style.backgroundSize =
            "";

        element.style.backgroundPosition =
            "";

    }

}


function updateBackground(
    game,
    instant = false
) {

    if (!game) {
        return;
    }


    const layers =
        getBackgroundElements();


    if (
        !layers.current ||
        !layers.next
    ) {
        return;
    }


    if (instant) {

        applyBackground(
            layers.current,
            game
        );


        layers.current.style.opacity =
            "1";

        layers.next.style.opacity =
            "0";


        return;

    }


    const incoming =
        currentBackgroundLayer ===
        "current"
            ? layers.next
            : layers.current;


    const outgoing =
        currentBackgroundLayer ===
        "current"
            ? layers.current
            : layers.next;


    applyBackground(
        incoming,
        game
    );


    incoming.style.opacity =
        "0";


    void incoming.offsetWidth;


    incoming.style.opacity =
        "1";

    outgoing.style.opacity =
        "0";


    currentBackgroundLayer =
        currentBackgroundLayer ===
        "current"
            ? "next"
            : "current";

}


/* =========================================================
   HERO ACTION BUTTONS
========================================================= */

function updateActionButtons(game) {

    const primary =
        getElement("primaryAction");

    const secondary =
        getElement("secondaryAction");


    if (
        !primary ||
        !secondary ||
        !game
    ) {
        return;
    }


    /*
       WELCOME
    */

    if (isWelcome(game)) {

        primary.disabled =
            false;

        primary.textContent =
            "Explore APX";


        secondary.disabled =
            false;

        secondary.textContent =
            "System Info";


        return;

    }


    /*
       APX ZERO

       This is a membership preview.
       It is NOT treated as a game/session.
    */

    if (isZero(game)) {

        primary.disabled =
            false;

        primary.textContent =
            "Explore ZERO";


        secondary.disabled =
            false;

        secondary.textContent =
            "View Benefits";


        return;

    }


    /*
       PLACEHOLDER
    */

    if (isPlaceholder(game)) {

        primary.disabled =
            true;

        primary.textContent =
            game.status ||
            "Coming Soon";


        secondary.disabled =
            false;

        secondary.textContent =
            "Game Info";


        return;

    }


    /*
       IMPORTANT:

       playable does not mean APX cloud compatible.
    */

    if (
        game.playable &&
        game.apxCompatible
    ) {

        primary.disabled =
            false;

        primary.textContent =
            "Play on APX";

    }

    else if (game.playable) {

        primary.disabled =
            false;

        primary.textContent =
            "Play Prototype";

    }

    else {

        primary.disabled =
            true;

        primary.textContent =
            game.status ||
            "Unavailable";

    }


    secondary.disabled =
        false;

    secondary.textContent =
        "Game Info";

}


/* =========================================================
   UPDATE SELECTED ITEM
========================================================= */

function updateSelectedItem(
    game,
    options = {}
) {

    if (!game) {
        return;
    }


    updateSelectedCopy(
        game
    );


    updateActionButtons(
        game
    );


    updateBackground(
        game,
        options.instant === true
    );

}


/* =========================================================
   SCROLLING
========================================================= */

function scrollToLowerHome() {

    const lower =
        getElement("lowerHome");


    lower?.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

}


function scrollToHomeHero() {

    const hero =
        getElement("homeHero");


    hero?.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

}


function scrollToZero() {

    const zero =
        getElement("apxZeroSection");


    (
        zero ||
        getElement("lowerHome")
    )?.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

}


/* =========================================================
   SCREEN SWITCHING
========================================================= */

function showScreen(page) {

    document
        .querySelectorAll(
            "[data-apx-screen]"
        )
        .forEach(
            screen => {

                const active =
                    screen.dataset.apxScreen ===
                    page;


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


    document
        .querySelectorAll(
            "[data-apx-page]"
        )
        .forEach(
            button => {

                const active =
                    button.dataset.apxPage ===
                    page;


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


    if (page === "home") {

        window.setTimeout(
            () => {

                if (
                    typeof carouselModule
                        ?.refreshCarousel ===
                    "function"
                ) {

                    carouselModule
                        .refreshCarousel();

                }


                if (
                    typeof focusModule
                        ?.refreshFocus ===
                    "function"
                ) {

                    focusModule
                        .refreshFocus();

                }

            },
            80
        );

    }


    window.dispatchEvent(
        new CustomEvent(
            "apx:screenvisible",
            {
                detail: {
                    page
                }
            }
        )
    );

}


/* =========================================================
   CAROUSEL EVENT
========================================================= */

function handleGameChange(event) {

    const detail =
        event.detail ||
        {};


    const game =
        detail.game ||
        getCurrentGame();


    if (!game) {
        return;
    }


    updateSelectedItem(
        game
    );

}


/* =========================================================
   PAGE EVENT
========================================================= */

function handlePageChange(event) {

    const detail =
        event.detail;


    let page =
        typeof detail === "string"
            ? detail
            : detail?.page;


    if (!page) {
        return;
    }


    /*
       Compatibility with the temporary v0.41 navigation.js
       naming.

       Final APX naming is "apx-ai".
    */

    if (page === "ai") {
        page = "apx-ai";
    }


    showScreen(
        page
    );


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =========================================================
   STORE -> HOME GAME OPEN
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
       Ask carousel.js to select the requested game.
    */

    if (
        typeof carouselModule
            ?.selectGameById ===
        "function"
    ) {

        carouselModule.selectGameById(
            gameId
        );

    }


    /*
       Navigation may already do this.

       Doing it here as well makes Store -> Home resilient.
    */

    if (
        typeof navigationModule
            ?.navigateToPage ===
        "function"
    ) {

        navigationModule.navigateToPage(
            "home"
        );

    }

    else {

        showScreen(
            "home"
        );

    }


    window.setTimeout(
        () => {

            scrollToHomeHero();


            const game =
                typeof gamesModule
                    ?.getGameById ===
                "function"
                    ? gamesModule.getGameById(
                        gameId
                    )
                    : null;


            if (game) {

                updateSelectedItem(
                    game
                );

            }

        },
        80
    );

}


/* =========================================================
   SESSION PROTOTYPE

   THIS IS NOT REAL CLOUD STREAMING.
========================================================= */

async function showSessionPrototype(game) {

    if (!game) {
        return;
    }


    if (
        isWelcome(game) ||
        isZero(game) ||
        isPlaceholder(game)
    ) {
        return;
    }


    const overlay =
        getElement("sessionOverlay");

    const title =
        getElement("sessionTitle");

    const spinner =
        getElement("sessionSpinner");

    const status =
        getElement("sessionStatus");

    const description =
        getElement(
            "sessionDescription"
        );

    const close =
        getElement("sessionClose");


    if (!overlay) {
        return;
    }


    if (title) {

        title.textContent =
            game.title;

    }


    if (spinner) {

        spinner.hidden =
            false;

    }


    if (status) {

        status.textContent =
            "Preparing session";

    }


    if (description) {

        description.textContent =
            "Checking APX availability.";

    }


    if (close) {

        close.textContent =
            "Cancel";

    }


    overlay.hidden =
        false;


    if (
        typeof focusModule
            ?.hideFocus ===
        "function"
    ) {

        focusModule.hideFocus();

    }


    const steps = [

        [
            "Checking Apex Games Library",
            "Confirming access to this title."
        ],

        [
            "Checking APX compatibility",

            game.apxCompatible
                ? "This title is marked APX compatible."
                : "This title is not connected to APX cloud streaming yet."
        ],

        [
            "Checking cloud availability",
            "Looking for an APX session."
        ]

    ];


    for (
        const [
            stepStatus,
            stepDescription
        ]
        of steps
    ) {

        if (overlay.hidden) {
            return;
        }


        if (status) {

            status.textContent =
                stepStatus;

        }


        if (description) {

            description.textContent =
                stepDescription;

        }


        await wait(
            600
        );

    }


    if (overlay.hidden) {
        return;
    }


    if (spinner) {

        spinner.hidden =
            true;

    }


    if (status) {

        status.textContent =
            "Cloud streaming isn't connected yet.";

    }


    if (description) {

        description.textContent =
            "APX v0.41 is currently the system interface prototype. Real remote game streaming infrastructure will be connected later.";

    }


    if (close) {

        close.textContent =
            "Return to APX";

    }

}


/* =========================================================
   PRIMARY ACTION
========================================================= */

function handlePrimaryAction() {

    const game =
        getCurrentGame();


    if (!game) {
        return;
    }


    /*
       WELCOME
    */

    if (isWelcome(game)) {

        scrollToLowerHome();


        window.dispatchEvent(
            new CustomEvent(
                "apx:openwelcome",
                {
                    detail: {
                        game
                    }
                }
            )
        );


        return;

    }


    /*
       APX ZERO
    */

    if (isZero(game)) {

        scrollToZero();


        window.dispatchEvent(
            new CustomEvent(
                "apx:openzero",
                {
                    detail: {
                        game
                    }
                }
            )
        );


        return;

    }


    /*
       Placeholder titles cannot launch.
    */

    if (isPlaceholder(game)) {
        return;
    }


    /*
       Prototype session only.
    */

    showSessionPrototype(
        game
    );


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


/* =========================================================
   SECONDARY ACTION
========================================================= */

function handleSecondaryAction() {

    const game =
        getCurrentGame();


    if (!game) {
        return;
    }


    if (isWelcome(game)) {

        scrollToLowerHome();


        window.dispatchEvent(
            new CustomEvent(
                "apx:systeminfo",
                {
                    detail: {
                        game
                    }
                }
            )
        );


        return;

    }


    if (isZero(game)) {

        scrollToZero();


        window.dispatchEvent(
            new CustomEvent(
                "apx:openzero",
                {
                    detail: {
                        game,
                        view: "benefits"
                    }
                }
            )
        );


        window.setTimeout(
            () => {

                const benefits =
                    getElement(
                        "zeroBenefits"
                    );


                benefits?.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "center"
                    }
                );

            },
            450
        );


        return;

    }


    scrollToLowerHome();


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


/* =========================================================
   APX ZERO RETURN
========================================================= */

function handleReturnFromZero() {

    scrollToHomeHero();


    window.setTimeout(
        () => {

            const selected =
                document.querySelector(
                    ".game-card.selected"
                );


            if (
                selected &&
                typeof focusModule
                    ?.setFocusTarget ===
                "function"
            ) {

                focusModule.setFocusTarget(
                    selected
                );

            }

        },
        450
    );

}


/* =========================================================
   QUICK APX AI

   Gemini is intentionally NOT connected yet.
========================================================= */

function handleQuickAIRequest() {

    const quickAI =
        getElement("quickAI");

    const quickInput =
        getElement("quickAIInput");

    const quickText =
        getElement("quickAIText");


    if (!quickAI) {
        return;
    }


    quickAI.classList.add(
        "visible",
        "listening",
        "input-open"
    );


    if (quickText) {

        quickText.textContent =
            "What can I do?";

    }


    document.body.classList.add(
        "quick-ai-requested"
    );


    window.setTimeout(
        () => {

            quickInput?.focus();

        },
        250
    );

}


function closeQuickAI() {

    const quickAI =
        getElement("quickAI");


    if (quickAI) {

        quickAI.classList.remove(
            "visible",
            "listening",
            "expanded",
            "input-open"
        );

    }


    document.body.classList.remove(
        "quick-ai-requested"
    );

}


/* =========================================================
   BACK / ESCAPE
========================================================= */

function handleBack() {

    const quickAI =
        getElement("quickAI");


    if (
        quickAI?.classList.contains(
            "visible"
        ) ||
        document.body.classList.contains(
            "quick-ai-requested"
        )
    ) {

        closeQuickAI();

        return;

    }


    const state =
        getState();


    if (
        state?.activePage &&
        state.activePage !== "home"
    ) {

        if (
            typeof navigationModule
                ?.navigateToPage ===
            "function"
        ) {

            navigationModule.navigateToPage(
                "home"
            );

        }

        else {

            showScreen(
                "home"
            );

        }


        return;

    }


    if (
        window.scrollY >
        window.innerHeight * .35
    ) {

        scrollToHomeHero();

    }

}


/* =========================================================
   FULL APX AI PLACEHOLDER

   Gemini integration comes after v0.41 passes testing.
========================================================= */

function bindAIPrototype() {

    const form =
        getElement("aiForm");

    const input =
        getElement("aiInput");

    const conversation =
        getElement("aiConversation");


    if (
        !form ||
        !input ||
        !conversation
    ) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const message =
                input.value.trim();


            if (!message) {
                return;
            }


            const userMessage =
                document.createElement(
                    "div"
                );


            userMessage.className =
                "ai-message user-message";


            const name =
                document.createElement(
                    "span"
                );


            name.className =
                "message-name";


            name.textContent =
                "YOU";


            const bubble =
                document.createElement(
                    "div"
                );


            bubble.className =
                "message-bubble";


            bubble.textContent =
                message;


            userMessage.append(
                name,
                bubble
            );


            conversation.appendChild(
                userMessage
            );


            input.value =
                "";


            conversation.scrollTop =
                conversation.scrollHeight;


            window.setTimeout(
                () => {

                    const response =
                        document.createElement(
                            "div"
                        );


                    response.className =
                        "ai-message";


                    const responseName =
                        document.createElement(
                            "span"
                        );


                    responseName.className =
                        "message-name";


                    responseName.textContent =
                        "APX AI";


                    const responseBubble =
                        document.createElement(
                            "div"
                        );


                    responseBubble.className =
                        "message-bubble";


                    responseBubble.textContent =
                        "APX AI is ready for its backend connection. Gemini has not been connected yet.";


                    response.append(
                        responseName,
                        responseBubble
                    );


                    conversation.appendChild(
                        response
                    );


                    conversation.scrollTop =
                        conversation.scrollHeight;

                },
                350
            );

        }
    );

}


/* =========================================================
   QUICK AI PLACEHOLDER
========================================================= */

function bindQuickAIPrototype() {

    const form =
        getElement("quickAIForm");

    const input =
        getElement("quickAIInput");

    const text =
        getElement("quickAIText");

    const quickAI =
        getElement("quickAI");


    if (
        !form ||
        !input
    ) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const message =
                input.value.trim();


            if (!message) {
                return;
            }


            input.value =
                "";


            quickAI?.classList.add(
                "expanded"
            );


            if (text) {

                text.textContent =
                    "Gemini connects after APX v0.41 passes testing.";

            }


            window.setTimeout(
                closeQuickAI,
                4200
            );

        }
    );

}


/* =========================================================
   SESSION CLOSE
========================================================= */

function bindSessionClose() {

    const overlay =
        getElement("sessionOverlay");

    const close =
        getElement("sessionClose");


    if (
        !overlay ||
        !close
    ) {
        return;
    }


    close.addEventListener(
        "click",
        () => {

            overlay.hidden =
                true;


            window.setTimeout(
                () => {

                    const selected =
                        document.querySelector(
                            ".game-card.selected"
                        );


                    if (
                        selected &&
                        typeof focusModule
                            ?.setFocusTarget ===
                        "function"
                    ) {

                        focusModule.setFocusTarget(
                            selected
                        );

                    }

                },
                100
            );

        }
    );

}


/* =========================================================
   STATIC DOM EVENTS
========================================================= */

function bindDOMEvents() {

    const primary =
        getElement("primaryAction");

    const secondary =
        getElement("secondaryAction");

    const scroll =
        getElement("scrollToHub");

    const returnToCarousel =
        getElement("returnToCarousel");

    const returnFromZero =
        getElement("returnFromZero");

    const continueButton =
        getElement("continueButton");


    primary?.addEventListener(
        "click",
        handlePrimaryAction
    );


    secondary?.addEventListener(
        "click",
        handleSecondaryAction
    );


    scroll?.addEventListener(
        "click",
        scrollToLowerHome
    );


    returnToCarousel?.addEventListener(
        "click",
        scrollToHomeHero
    );


    returnFromZero?.addEventListener(
        "click",
        handleReturnFromZero
    );


    continueButton?.addEventListener(
        "click",
        () => {

            showSessionPrototype(
                getCurrentGame()
            );

        }
    );


    window.addEventListener(
        "apx:gamechange",
        handleGameChange
    );


    window.addEventListener(
        "apx:pagechange",
        handlePageChange
    );


    window.addEventListener(
        "apx:storegame",
        handleStoreGame
    );


    window.addEventListener(
        "apx:quickai",
        handleQuickAIRequest
    );


    window.addEventListener(
        "apx:back",
        handleBack
    );


    bindAIPrototype();

    bindQuickAIPrototype();

    bindSessionClose();

}


/* =========================================================
   INITIAL UI
========================================================= */

function initializeUI() {

    const game =
        getCurrentGame();


    if (game) {

        updateSelectedItem(
            game,
            {
                instant: true
            }
        );

    }


    showScreen(
        "home"
    );


    startClock();

}


/* =========================================================
   MODULE LOADER

   Every core module is dynamically imported.
========================================================= */

async function loadAPXModules() {

    const modules =
        await Promise.all(
            [

                import(
                    "./state.js"
                ),

                import(
                    "./games.js"
                ),

                import(
                    "./focus.js"
                ),

                import(
                    "./carousel.js"
                ),

                import(
                    "./navigation.js"
                ),

                import(
                    "./store.js"
                ),

                import(
                    "./apx-zero.js"
                )

            ]
        );


    [
        stateModule,
        gamesModule,
        focusModule,
        carouselModule,
        navigationModule,
        storeModule,
        zeroModule
    ] = modules;

}


/* =========================================================
   INITIALIZE MODULES
========================================================= */

function initializeModules() {

    /*
       FOCUS
    */

    if (
        typeof focusModule
            ?.initFocusSystem ===
        "function"
    ) {

        focusModule.initFocusSystem();

    }

    else {

        throw new Error(
            "focus.js loaded, but initFocusSystem() was not found."
        );

    }


    /*
       CAROUSEL
    */

    if (
        typeof carouselModule
            ?.initCarousel ===
        "function"
    ) {

        carouselModule.initCarousel();

    }

    else {

        throw new Error(
            "carousel.js loaded, but initCarousel() was not found."
        );

    }


    /*
       NAVIGATION
    */

    if (
        typeof navigationModule
            ?.initNavigation ===
        "function"
    ) {

        navigationModule.initNavigation();

    }

    else {

        throw new Error(
            "navigation.js loaded, but initNavigation() was not found."
        );

    }


    /*
       STORE
    */

    if (
        typeof storeModule
            ?.initAPXStore ===
        "function"
    ) {

        storeModule.initAPXStore();

    }

    else {

        console.warn(
            "[APX] store.js loaded without initAPXStore()."
        );

    }


    /*
       APX ZERO
    */

    if (
        typeof zeroModule
            ?.initAPXZero ===
        "function"
    ) {

        zeroModule.initAPXZero();

    }

    else {

        console.warn(
            "[APX] apx-zero.js loaded without initAPXZero()."
        );

    }

}


/* =========================================================
   FIRST FOCUS
========================================================= */

function focusInitialCard() {

    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    const selected =
                        document.querySelector(
                            ".game-card.selected"
                        );


                    if (!selected) {
                        return;
                    }


                    if (
                        typeof focusModule
                            ?.setFocusTarget ===
                        "function"
                    ) {

                        focusModule.setFocusTarget(
                            selected
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   APX BOOT
========================================================= */

async function bootAPX() {

    if (APXBooted) {
        return;
    }


    APXBooted =
        true;


    /*
       Install this BEFORE loading modules.
    */

    installEmergencyBootRelease();


    try {

        /*
           1. Load v0.41 modules.
        */

        await loadAPXModules();


        /*
           2. Initialize modules.
        */

        initializeModules();


        /*
           3. Bind application events.
        */

        bindDOMEvents();


        /*
           4. Build initial UI.
        */

        initializeUI();


        /*
           5. Allow first browser render.
        */

        await new Promise(
            resolve => {

                requestAnimationFrame(
                    () => {

                        requestAnimationFrame(
                            resolve
                        );

                    }
                );

            }
        );


        /*
           6. Attach universal focus to Welcome.
        */

        focusInitialCard();


        /*
           7. Small deliberate APX startup presentation.
        */

        await wait(
            450
        );


        /*
           8. APX READY.
        */

        finishBootScreen();


        console.log(
            "[APX] v0.41 boot complete."
        );

    }

    catch (error) {

        /*
           NEVER leave APX trapped behind the boot screen.
        */

        console.error(
            "[APX] Boot failed:",
            error
        );


        finishBootScreen();


        showAPXError(
            error?.message ||
            "An unknown module error occurred."
        );

    }

}


/* =========================================================
   START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        bootAPX,
        {
            once: true
        }
    );

}

else {

    bootAPX();

}
