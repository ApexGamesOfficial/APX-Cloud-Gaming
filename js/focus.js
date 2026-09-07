/*
    APX Cloud Gaming
    v0.4

    UNIVERSAL FOCUS SYSTEM
*/


let focusFrame = null;
let currentTarget = null;

let trackingFrame = null;
let resizeObserver = null;

let enabled = true;


/* ---------------------------------------
   CREATE FRAME
--------------------------------------- */

export function createFocusFrame() {

    let frame =
        document.getElementById("apxFocusFrame");

    if (!frame) {

        frame = document.createElement("div");

        frame.id = "apxFocusFrame";

        frame.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.appendChild(frame);
    }

    focusFrame = frame;

    return frame;
}


/* ---------------------------------------
   GET FRAME
--------------------------------------- */

export function getFocusFrame() {

    if (!focusFrame) {
        return createFocusFrame();
    }

    return focusFrame;
}


/* ---------------------------------------
   TARGET CHECK
--------------------------------------- */

function isValidTarget(element) {

    if (!(element instanceof HTMLElement)) {
        return false;
    }

    if (!document.documentElement.contains(element)) {
        return false;
    }

    if (element.offsetParent === null) {
        return false;
    }

    const rect =
        element.getBoundingClientRect();

    return (
        rect.width > 0 &&
        rect.height > 0
    );
}


/* ---------------------------------------
   TARGET GAP
--------------------------------------- */

function getTargetGap(element) {

    if (
        element.classList.contains("game-card")
    ) {
        return 7;
    }

    if (
        element.classList.contains("nav-item") ||
        element.classList.contains("top-nav-item")
    ) {
        return 5;
    }

    if (
        element.matches(
            "button, .apx-button, .action-button"
        )
    ) {
        return 5;
    }

    return 5;
}


/* ---------------------------------------
   TARGET RADIUS
--------------------------------------- */

function getTargetRadius(element) {

    const styles =
        window.getComputedStyle(element);

    const radius =
        parseFloat(styles.borderRadius);

    if (Number.isFinite(radius)) {
        return radius;
    }

    return 14;
}


/* ---------------------------------------
   POSITION FRAME
--------------------------------------- */

export function moveFocusFrame(element) {

    if (!enabled) {
        return;
    }

    if (!isValidTarget(element)) {
        hideFocusFrame();
        return;
    }

    const frame = getFocusFrame();

    const rect =
        element.getBoundingClientRect();

    const gap =
        getTargetGap(element);

    const radius =
        getTargetRadius(element);

    frame.style.setProperty(
        "--focus-x",
        `${rect.left - gap}px`
    );

    frame.style.setProperty(
        "--focus-y",
        `${rect.top - gap}px`
    );

    frame.style.setProperty(
        "--focus-width",
        `${rect.width + gap * 2}px`
    );

    frame.style.setProperty(
        "--focus-height",
        `${rect.height + gap * 2}px`
    );

    frame.style.setProperty(
        "--focus-radius",
        `${radius + gap}px`
    );

    frame.classList.add("visible");

    currentTarget = element;
}


/* ---------------------------------------
   SET TARGET
--------------------------------------- */

export function setFocusTarget(
    element,
    options = {}
) {

    if (!isValidTarget(element)) {
        return;
    }

    const {
        track = false,
        duration = 850
    } = options;

    currentTarget = element;

    moveFocusFrame(element);

    observeTarget(element);

    if (track) {
        trackFocusDuringAnimation(
            element,
            duration
        );
    }
}


/* ---------------------------------------
   TRACK MOVING TARGET
--------------------------------------- */

export function trackFocusDuringAnimation(
    element,
    duration = 850
) {

    stopFocusTracking();

    if (!isValidTarget(element)) {
        return;
    }

    const start =
        performance.now();

    function track(now) {

        if (
            !enabled ||
            currentTarget !== element ||
            !isValidTarget(element)
        ) {
            trackingFrame = null;
            return;
        }

        moveFocusFrame(element);

        if (now - start < duration) {

            trackingFrame =
                requestAnimationFrame(track);

            return;
        }

        moveFocusFrame(element);

        trackingFrame = null;
    }

    trackingFrame =
        requestAnimationFrame(track);
}


/* ---------------------------------------
   STOP TRACKING
--------------------------------------- */

export function stopFocusTracking() {

    if (trackingFrame !== null) {

        cancelAnimationFrame(
            trackingFrame
        );

        trackingFrame = null;
    }
}


/* ---------------------------------------
   RESIZE OBSERVER
--------------------------------------- */

function observeTarget(element) {

    if (resizeObserver) {
        resizeObserver.disconnect();
    }

    if (
        typeof ResizeObserver === "undefined"
    ) {
        return;
    }

    resizeObserver =
        new ResizeObserver(() => {

            if (
                currentTarget === element
            ) {
                moveFocusFrame(element);
            }
        });

    resizeObserver.observe(element);
}


/* ---------------------------------------
   REFRESH
--------------------------------------- */

export function refreshFocusFrame() {

    if (
        currentTarget &&
        isValidTarget(currentTarget)
    ) {
        moveFocusFrame(currentTarget);
    }
}


/* ---------------------------------------
   HIDE
--------------------------------------- */

export function hideFocusFrame() {

    const frame = getFocusFrame();

    frame.classList.remove("visible");
}


/* ---------------------------------------
   CLEAR
--------------------------------------- */

export function clearFocusTarget() {

    stopFocusTracking();

    if (resizeObserver) {
        resizeObserver.disconnect();
    }

    currentTarget = null;

    hideFocusFrame();
}


/* ---------------------------------------
   ENABLE / DISABLE
--------------------------------------- */

export function enableFocusSystem() {

    enabled = true;

    refreshFocusFrame();
}


export function disableFocusSystem() {

    enabled = false;

    hideFocusFrame();
}


/* ---------------------------------------
   CURRENT TARGET
--------------------------------------- */

export function getFocusTarget() {
    return currentTarget;
}


/* ---------------------------------------
   AUTOMATIC HOVER / KEYBOARD FOCUS
--------------------------------------- */

function handlePointerOver(event) {

    const target =
        event.target.closest(
            "[data-apx-focus]"
        );

    if (!target) {
        return;
    }

    setFocusTarget(target, {
        track: true,
        duration: 350
    });
}


function handleFocusIn(event) {

    const target =
        event.target.closest(
            "[data-apx-focus]"
        );

    if (!target) {
        return;
    }

    setFocusTarget(target, {
        track: true,
        duration: 350
    });
}


/* ---------------------------------------
   WINDOW MOVEMENT
--------------------------------------- */

function handleViewportChange() {
    refreshFocusFrame();
}


/* ---------------------------------------
   INITIALIZE
--------------------------------------- */

export function initFocusSystem() {

    createFocusFrame();

    document.addEventListener(
        "pointerover",
        handlePointerOver
    );

    document.addEventListener(
        "focusin",
        handleFocusIn
    );

    window.addEventListener(
        "resize",
        handleViewportChange
    );

    window.addEventListener(
        "scroll",
        handleViewportChange,
        {
            passive: true
        }
    );
}
