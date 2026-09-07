/*
    APX Cloud Gaming
    v0.4

    APX GAME / HOME CARD DATA
*/


/*
    IMPORTANT:

    apxCompatible should ONLY become true for real games
    once that game has actually been approved/tested for APX.

    The current entries are UI prototypes.
*/


export const APX_GAMES = [

    /* ---------------------------------------
       WELCOME
    --------------------------------------- */

    {
        id: "welcome",

        type: "welcome",

        title: "Welcome",
        shortTitle: "Welcome",

        developer: "APX",

        description:
            "Your games, friends, captures, downloads and cloud activity — all in one place.",

        cardImage: "",
        backgroundImage: "",

        accent: "welcome",

        playable: false,
        apxCompatible: false,

        status: "System",

        tags: [
            "APX",
            "Home"
        ]
    },


    /* ---------------------------------------
       APEX DEMO
    --------------------------------------- */

    {
        id: "apex-demo",

        type: "game",

        title: "Apex Demo",
        shortTitle: "Apex Demo",

        developer: "Apex Games",

        description:
            "Enter the Apex Games ecosystem with the official demonstration experience.",

        /*
            We'll replace these with the real APX
            artwork paths once the v0.4 visual
            structure is installed.
        */

        cardImage: "",
        backgroundImage: "",

        accent: "blue",

        playable: true,

        /*
            Keep false until actual APX streaming
            compatibility exists.
        */

        apxCompatible: false,

        status: "Prototype",

        tags: [
            "Action",
            "Singleplayer",
            "Apex Games"
        ]
    },


    /* ---------------------------------------
       PROJECT UNKNOWN
    --------------------------------------- */

    {
        id: "project-unknown",

        type: "game",

        title: "Project Unknown",
        shortTitle: "Project Unknown",

        developer: "Apex Games",

        description:
            "An upcoming Apex Games adventure currently in development.",

        cardImage: "",
        backgroundImage: "",

        accent: "deep-blue",

        playable: false,
        apxCompatible: false,

        status: "Coming Soon",

        tags: [
            "Adventure",
            "Singleplayer",
            "Coming Soon"
        ]
    },


    /* ---------------------------------------
       FUTURE GAME PLACEHOLDER
    --------------------------------------- */

    {
        id: "future-game",

        type: "placeholder",

        title: "Future Game",
        shortTitle: "Future Game",

        developer: "Coming to APX",

        description:
            "More games will appear here as the APX catalog grows.",

        cardImage: "",
        backgroundImage: "",

        accent: "dark",

        playable: false,
        apxCompatible: false,

        status: "Placeholder",

        tags: [
            "Coming Soon"
        ]
    }

];


/* ---------------------------------------
   GAME HELPERS
--------------------------------------- */

export function getGameById(id) {
    return APX_GAMES.find(
        game => game.id === id
    ) || null;
}


export function getGameByIndex(index) {
    return APX_GAMES[index] || null;
}


export function getGameIndex(id) {
    return APX_GAMES.findIndex(
        game => game.id === id
    );
}


export function getWelcomeCard() {
    return APX_GAMES.find(
        game => game.type === "welcome"
    ) || null;
}


export function getActualGames() {
    return APX_GAMES.filter(
        game => game.type === "game"
    );
}


export function getAPXCompatibleGames() {
    return APX_GAMES.filter(
        game =>
            game.type === "game" &&
            game.apxCompatible === true
    );
}


export function getPlayableGames() {
    return APX_GAMES.filter(
        game =>
            game.type === "game" &&
            game.playable === true
    );
}


/* ---------------------------------------
   SELECTION HELPERS
--------------------------------------- */

export function normalizeGameIndex(index) {

    const total = APX_GAMES.length;

    if (!total) {
        return 0;
    }

    return (
        (index % total) + total
    ) % total;
}


export function getNextGameIndex(currentIndex) {
    return normalizeGameIndex(
        currentIndex + 1
    );
}


export function getPreviousGameIndex(currentIndex) {
    return normalizeGameIndex(
        currentIndex - 1
    );
}


/* ---------------------------------------
   TYPE HELPERS
--------------------------------------- */

export function isWelcomeCard(item) {
    return item?.type === "welcome";
}


export function isGame(item) {
    return item?.type === "game";
}


export function isPlaceholder(item) {
    return item?.type === "placeholder";
}
