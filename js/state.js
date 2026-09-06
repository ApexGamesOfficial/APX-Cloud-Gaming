/*
    APX Cloud Gaming
    v0.4

    GLOBAL UI STATE
*/

export const APXState = {
    version: "0.4",

    // Main APX page
    activePage: "home",

    // Welcome is index 0.
    selectedGameIndex: 0,

    // Current interaction method.
    inputMode: "mouse",

    // Home states
    homeMode: "carousel",
    hubOpen: false,

    // Account
    user: null,
    authenticated: false,

    // APX AI
    quickAIActive: false,

    // Cloud session
    activeSession: null,

    // Navigation
    navigationLocked: false
};


/* ---------------------------------------
   BASIC STATE HELPERS
--------------------------------------- */

export function setActivePage(page) {
    APXState.activePage = page;
}


export function setSelectedGameIndex(index) {
    APXState.selectedGameIndex = index;
}


export function setInputMode(mode) {
    APXState.inputMode = mode;
}


export function setHomeMode(mode) {
    APXState.homeMode = mode;
}


export function setHubOpen(open) {
    APXState.hubOpen = Boolean(open);
}


/* ---------------------------------------
   ACCOUNT STATE
--------------------------------------- */

export function setAPXUser(user) {
    APXState.user = user || null;
    APXState.authenticated = Boolean(user);
}


export function clearAPXUser() {
    APXState.user = null;
    APXState.authenticated = false;
}


/* ---------------------------------------
   QUICK AI
--------------------------------------- */

export function setQuickAIActive(active) {
    APXState.quickAIActive = Boolean(active);
}


/* ---------------------------------------
   CLOUD SESSION
--------------------------------------- */

export function setActiveSession(session) {
    APXState.activeSession = session || null;
}


/* ---------------------------------------
   NAVIGATION LOCK
--------------------------------------- */

export function lockNavigation() {
    APXState.navigationLocked = true;
}


export function unlockNavigation() {
    APXState.navigationLocked = false;
}


/* ---------------------------------------
   DEBUG
--------------------------------------- */

export function getAPXState() {
    return { ...APXState };
}
