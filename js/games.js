/* =========================================================
   APX v0.41
   GAME + SYSTEM CARD DATA

   Home carousel order:
   Welcome
   APX ZERO
   Apex Demo
   Project Unknown
   Future Game

   IMPORTANT:
   Being listed inside APX does NOT mean a game currently
   supports real APX cloud streaming.
========================================================= */

export const APX_GAMES = [

    /* =====================================================
       WELCOME
    ===================================================== */

    {
        id: "welcome",

        type: "welcome",

        title: "Welcome",

        artTitle: "WELCOME",

        developer: "APX",

        genre: "System",

        description:
            "Your games, friends, captures, downloads and cloud activity — all in one place.",

        status: "System",

        playable: false,

        apxCompatible: false,

        cardImage: "",

        backgroundImage: "",

        accent: "blue"
    },


    /* =====================================================
       APX ZERO
       Subscription / membership card.
       This is NOT a game.
    ===================================================== */

    {
        id: "apx-zero",

        type: "subscription",

        title: "APX ZERO",

        artTitle: "ZERO",

        developer: "APX",

        genre: "Membership",

        description:
            "Go further with APX. Explore the upcoming APX ZERO membership experience.",

        status: "Membership",

        playable: false,

        apxCompatible: false,

        cardImage: "",

        backgroundImage: "",

        accent: "zero"
    },


    /* =====================================================
       APEX DEMO
    ===================================================== */

    {
        id: "apex-demo",

        type: "game",

        title: "Apex Demo",

        artTitle: "APEX DEMO",

        developer: "Apex Games",

        genre: "Action",

        description:
            "Enter the Apex Games ecosystem with the official demonstration experience.",

        status: "Prototype",

        playable: true,

        /*
           IMPORTANT:
           The game existing does not mean APX cloud
           streaming infrastructure is connected.
        */
        apxCompatible: false,

        cardImage: "",

        backgroundImage: "",

        accent: "blue"
    },


    /* =====================================================
       PROJECT UNKNOWN
    ===================================================== */

    {
        id: "project-unknown",

        type: "game",

        title: "Project Unknown",

        artTitle: "PROJECT UNKNOWN",

        developer: "Apex Games",

        genre: "Adventure",

        description:
            "An upcoming Apex Games adventure currently in development.",

        status: "Coming Soon",

        playable: false,

        apxCompatible: false,

        cardImage: "",

        backgroundImage: "",

        accent: "dark"
    },


    /* =====================================================
       FUTURE GAME
    ===================================================== */

    {
        id: "future-game",

        type: "placeholder",

        title: "Future Game",

        artTitle: "COMING SOON",

        developer: "Apex Games",

        genre: "Coming Soon",

        description:
            "More games will appear here as the APX catalog grows.",

        status: "Coming Soon",

        playable: false,

        apxCompatible: false,

        cardImage: "",

        backgroundImage: "",

        accent: "blue"
    }

];


/* =========================================================
   BASIC LOOKUPS
========================================================= */

export function getGameById(id) {

    return (
        APX_GAMES.find(
            game =>
                game.id === id
        ) ||
        null
    );
}


export function getGameByIndex(index) {

    return (
        APX_GAMES[index] ||
        null
    );
}


export function getGameIndex(id) {

    return APX_GAMES.findIndex(
        game =>
            game.id === id
    );
}


/* =========================================================
   SYSTEM CARDS
========================================================= */

export function getWelcomeCard() {

    return getGameById(
        "welcome"
    );
}


export function getAPXZeroCard() {

    return getGameById(
        "apx-zero"
    );
}


/* =========================================================
   GAME FILTERS
========================================================= */

export function getActualGames() {

    return APX_GAMES.filter(
        item =>
            item.type === "game"
    );
}


export function getAPXCompatibleGames() {

    return APX_GAMES.filter(
        item =>
            item.type === "game" &&
            item.apxCompatible === true
    );
}


export function getPlayableGames() {

    return APX_GAMES.filter(
        item =>
            item.type === "game" &&
            item.playable === true
    );
}


/* =========================================================
   STORE CATALOG

   For v0.41 this uses real game entries already known to
   the APX prototype.

   Welcome, ZERO, and placeholder cards do not become
   Store games.
========================================================= */

export function getStoreGames() {

    return APX_GAMES.filter(
        item =>
            item.type === "game"
    );
}


/* =========================================================
   INDEX NORMALIZATION
========================================================= */

export function normalizeGameIndex(index) {

    const length =
        APX_GAMES.length;

    if (!length) {
        return 0;
    }

    return (
        (
            index % length
        ) +
        length
    ) % length;
}


export function getNextGameIndex(index) {

    return normalizeGameIndex(
        index + 1
    );
}


export function getPreviousGameIndex(index) {

    return normalizeGameIndex(
        index - 1
    );
}


/* =========================================================
   TYPE CHECKS
========================================================= */

export function isWelcomeCard(item) {

    return Boolean(
        item &&
        (
            item.id === "welcome" ||
            item.type === "welcome"
        )
    );
}


export function isAPXZero(item) {

    return Boolean(
        item &&
        (
            item.id === "apx-zero" ||
            item.type === "subscription"
        )
    );
}


export function isGame(item) {

    return Boolean(
        item &&
        item.type === "game"
    );
}


export function isPlaceholder(item) {

    return Boolean(
        item &&
        item.type === "placeholder"
    );
}


export function isSystemCard(item) {

    return Boolean(
        item &&
        (
            isWelcomeCard(item) ||
            isAPXZero(item)
        )
    );
}


/* =========================================================
   APX COMPATIBILITY

   Keep this separate from playable status.

   playable:
   The title itself can be used/played in some context.

   apxCompatible:
   APX cloud streaming support is actually enabled.

   Right now no title should falsely claim that real cloud
   streaming infrastructure exists.
========================================================= */

export function canStreamOnAPX(item) {

    return Boolean(
        item &&
        item.type === "game" &&
        item.apxCompatible === true
    );
}


/* =========================================================
   SEARCH
========================================================= */

export function searchAPXGames(query) {

    const normalized =
        String(
            query || ""
        )
            .trim()
            .toLowerCase();

    if (!normalized) {

        return getActualGames();

    }


    return getActualGames().filter(
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
                normalized
            );

        }
    );
}
