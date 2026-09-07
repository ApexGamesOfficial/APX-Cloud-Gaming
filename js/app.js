/* =========================================================
   APX v0.4
   MAIN APPLICATION BOOTSTRAP

   This file connects the APX v0.4 modules and DOM.

   IMPORTANT:
   Modules are loaded dynamically so a broken dependency
   cannot permanently trap APX on the boot screen.
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

let clockTimer = null;

let currentBackgroundLayer = "current";


/* =========================================================
   DOM HELPERS
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function wait(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}


/* =========================================================
   BOOT SCREEN

   This is deliberately independent from every APX module.

   Even if another module fails, this function can still
   release the interface.
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
       After the fade finishes, make absolutely sure the
       boot layer cannot intercept taps/clicks.
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

   If something strange happens during initialization,
   APX still gets released instead of sitting forever
   on the logo.
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
   ERROR DISPLAY

   Since DevTools may not always be available during
   tablet testing, critical APX errors can appear directly
   inside the interface.
========================================================= */

function showAPXError(message) {

    console.error(
        "[APX]",
        message
    );


    let panel =
        getElement(
            "apxRuntimeError"
        );


    if (!panel) {

        panel =
            document.createElement(
                "div"
            );


        panel.id =
            "apxRuntimeError";


        Object.assign(
            panel.style,
            {

                position:
                    "fixed",

                left:
                    "50%",

                bottom:
                    "24px",

                zIndex:
                    "999999",

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
        `APX v0.4: ${message}`;

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const timeElement =
        getElement(
            "systemTime"
        );


    const dateElement =
        getElement(
            "systemDate"
        );


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

                hour:
                    "numeric",

                minute:
                    "2-digit"

            }
        );


    dateElement.textContent =
        now.toLocaleDateString(
            [],
            {

                weekday:
                    "short",

                month:
                    "short",

                day:
                    "numeric"

            }
        );

}


function startClock() {

    updateClock();


    if (
        clockTimer !== null
    ) {

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
   SELECTED ITEM
========================================================= */

function getCurrentIndex() {

    if (
        !stateModule
    ) {
        return 0;
    }


    const state =
        stateModule.getAPXState
            ? stateModule.getAPXState()
            : stateModule.APXState;


    return (
        Number(
            state?.selectedGameIndex
        ) || 0
    );

}


function getCurrentGame() {

    if (
        !gamesModule
    ) {
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
   SELECTED COPY
========================================================= */

function updateSelectedCopy(
    game
) {

    if (!game) {
        return;
    }


    const title =
        getElement(
            "selectedGameTitle"
        );


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

        developer.textContent =
            game.type === "welcome"
                ? "APX"
                : (
                    game.developer ||
                    "Apex Games"
                );

    }


    if (status) {

        status.textContent =
            game.status ||
            (
                game.apxCompatible
                    ? "APX Ready"
                    : "Prototype"
            );

    }


    const welcomeSelected =
        game.id === "welcome" ||
        game.type === "welcome";


    document.body.classList.toggle(
        "welcome-selected",
        welcomeSelected
    );


    document.body.dataset.selectedItem =
        game.id ||
        "welcome";


    updateGameHub(
        game
    );

}


/* =========================================================
   GAME HUB
========================================================= */

function updateGameHub(
    game
) {

    if (!game) {
        return;
    }


    const hubTitle =
        getElement(
            "hubGameTitle"
        );


    const continueTitle =
        getElement(
            "continueGameTitle"
        );


    const hubDescription =
        getElement(
            "hubDescription"
        );


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


    /*
       Welcome has its own dashboard.

       The CSS automatically hides Game Hub whenever
       body.welcome-selected exists.
    */

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
           Clearing inline styling returns control to the
           v0.4 CSS fallback themes.
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


    /*
       Force the browser to register the inactive state
       before crossfading.
    */

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
   PRIMARY / SECONDARY ACTIONS
========================================================= */

function updateActionButtons(
    game
) {

    const primary =
        getElement(
            "primaryAction"
        );


    const secondary =
        getElement(
            "secondaryAction"
        );


    if (
        !primary ||
        !secondary ||
        !game
    ) {
        return;
    }


    const isWelcome =
        game.id === "welcome" ||
        game.type === "welcome";


    if (isWelcome) {

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
       A title existing in the carousel does NOT mean
       real APX cloud streaming is available.
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

    else if (
        game.playable
    ) {

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
   UPDATE ENTIRE SELECTED ITEM UI
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
   SCROLL HELPERS
========================================================= */

function scrollToLowerHome() {

    const lower =
        getElement(
            "lowerHome"
        );


    lower?.scrollIntoView(
        {

            behavior:
                "smooth",

            block:
                "start"

        }
    );

}


function scrollToHomeHero() {

    const hero =
        getElement(
            "homeHero"
        );


    hero?.scrollIntoView(
        {

            behavior:
                "smooth",

            block:
                "start"

        }
    );

}


/* =========================================================
   SCREEN SWITCHING
========================================================= */

function showScreen(
    page
) {

    document
        .querySelectorAll(
            "[data-apx-screen]"
        )
        .forEach(
            screen => {

                const active =
                    screen.dataset.apxScreen ===
                    page;


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


    if (
        page === "home"
    ) {

        window.setTimeout(
            () => {

                if (
                    typeof carouselModule?.refreshCarousel ===
                    "function"
                ) {

                    carouselModule.refreshCarousel();

                }


                if (
                    typeof focusModule?.refreshFocus ===
                    "function"
                ) {

                    focusModule.refreshFocus();

                }

            },
            80
        );

    }

}


/* =========================================================
   CAROUSEL EVENT
========================================================= */

function handleGameChange(
    event
) {

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

function handlePageChange(
    event
) {

    const detail =
        event.detail;


    const page =
        typeof detail === "string"
            ? detail
            : detail?.page;


    if (!page) {
        return;
    }


    showScreen(
        page
    );


    window.scrollTo(
        {

            top: 0,

            behavior:
                "smooth"

        }
    );

}


/* =========================================================
   SESSION PROTOTYPE

   APX v0.4 still does NOT claim real streaming exists.
========================================================= */

async function showSessionPrototype(
    game
) {

    if (!game) {
        return;
    }


    const overlay =
        getElement(
            "sessionOverlay"
        );


    const title =
        getElement(
            "sessionTitle"
        );


    const spinner =
        getElement(
            "sessionSpinner"
        );


    const status =
        getElement(
            "sessionStatus"
        );


    const description =
        getElement(
            "sessionDescription"
        );


    const close =
        getElement(
            "sessionClose"
        );


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
        typeof focusModule?.hideFocus ===
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

        if (
            overlay.hidden
        ) {
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


    if (
        overlay.hidden
    ) {
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
            "APX v0.4 is currently the system interface prototype. Real remote game streaming infrastructure will be connected later.";

    }


    if (close) {

        close.textContent =
            "Return to APX";

    }

}


/* =========================================================
   ACTION EVENTS
========================================================= */

function handlePrimaryAction() {

    const game =
        getCurrentGame();


    if (!game) {
        return;
    }


    const isWelcome =
        game.id === "welcome" ||
        game.type === "welcome";


    if (isWelcome) {

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
       This launches the APX SESSION PROTOTYPE,
       not a real remote streaming session.
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


function handleSecondaryAction() {

    const game =
        getCurrentGame();


    if (!game) {
        return;
    }


    const isWelcome =
        game.id === "welcome" ||
        game.type === "welcome";


    scrollToLowerHome();


    window.dispatchEvent(
        new CustomEvent(
            isWelcome
                ? "apx:systeminfo"
                : "apx:gameinfo",
            {

                detail: {
                    game
                }

            }
        )
    );

}


/* =========================================================
   QUICK AI

   This is still only the v0.4 UI hook.

   Gemini is NOT connected here.
========================================================= */

function handleQuickAIRequest() {

    const quickAI =
        getElement(
            "quickAI"
        );


    const quickInput =
        getElement(
            "quickAIInput"
        );


    const quickText =
        getElement(
            "quickAIText"
        );


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
        getElement(
            "quickAI"
        );


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
        getElement(
            "quickAI"
        );


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
        stateModule?.getAPXState
            ? stateModule.getAPXState()
            : stateModule?.APXState;


    if (
        state?.activePage &&
        state.activePage !== "home"
    ) {

        if (
            typeof navigationModule?.navigateToPage ===
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
   AI FORM PLACEHOLDER
========================================================= */

function bindAIPrototype() {

    const form =
        getElement(
            "aiForm"
        );


    const input =
        getElement(
            "aiInput"
        );


    const conversation =
        getElement(
            "aiConversation"
        );


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
                        "The APX AI interface is ready, but the real AI backend hasn't been connected yet.";


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
   QUICK AI FORM PLACEHOLDER
========================================================= */

function bindQuickAIPrototype() {

    const form =
        getElement(
            "quickAIForm"
        );


    const input =
        getElement(
            "quickAIInput"
        );


    const text =
        getElement(
            "quickAIText"
        );


    const quickAI =
        getElement(
            "quickAI"
        );


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
                    "Real APX AI connects after the v0.4 interface is locked.";

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
        getElement(
            "sessionOverlay"
        );


    const close =
        getElement(
            "sessionClose"
        );


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
                        typeof focusModule?.setFocusTarget ===
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
        getElement(
            "primaryAction"
        );


    const secondary =
        getElement(
            "secondaryAction"
        );


    const scroll =
        getElement(
            "scrollToHub"
        );


    const returnToCarousel =
        getElement(
            "returnToCarousel"
        );


    const continueButton =
        getElement(
            "continueButton"
        );


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

   Dynamic imports are intentional.

   If one fails, the error gets caught and APX can still
   escape the loading screen.
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
                )

            ]
        );


    [
        stateModule,
        gamesModule,
        focusModule,
        carouselModule,
        navigationModule
    ] = modules;

}


/* =========================================================
   INITIALIZE MODULES
========================================================= */

function initializeModules() {

    if (
        typeof focusModule?.initFocusSystem ===
        "function"
    ) {

        focusModule.initFocusSystem();

    }

    else {

        throw new Error(
            "focus.js loaded, but initFocusSystem() was not found."
        );

    }


    if (
        typeof carouselModule?.initCarousel ===
        "function"
    ) {

        carouselModule.initCarousel();

    }

    else {

        throw new Error(
            "carousel.js loaded, but initCarousel() was not found."
        );

    }


    if (
        typeof navigationModule?.initNavigation ===
        "function"
    ) {

        navigationModule.initNavigation();

    }

    else {

        throw new Error(
            "navigation.js loaded, but initNavigation() was not found."
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
                        typeof focusModule?.setFocusTarget ===
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


    installEmergencyBootRelease();


    try {

        /*
           1. Load module files.
        */

        await loadAPXModules();


        /*
           2. Initialize systems.
        */

        initializeModules();


        /*
           3. Bind APX application events.
        */

        bindDOMEvents();


        /*
           4. Build initial Home UI.
        */

        initializeUI();


        /*
           5. Wait for the first browser render.
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
           6. Attach focus to Welcome.
        */

        focusInitialCard();


        /*
           7. Small deliberate boot presentation.
           It should feel like APX started, not flash away.
        */

        await wait(
            450
        );


        /*
           8. APX IS READY.
        */

        finishBootScreen();


        console.log(
            "[APX] v0.4 boot complete."
        );

    }

    catch (error) {

        /*
           The important part:

           Even if a module breaks, RELEASE THE BOOT SCREEN.
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
