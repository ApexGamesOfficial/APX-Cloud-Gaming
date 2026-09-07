/* =========================================================
   APX v0.41
   APX ZERO

   Subscription / membership experience.

   v0.41 is UI/prototype only.
   No real subscription, payment, or entitlement system
   is connected yet.
========================================================= */


/* =========================================================
   ZERO DATA
========================================================= */

export const APX_ZERO = {

    id: "apx-zero",

    name: "APX ZERO",

    status: "Preview",

    active: false,

    description:
        "A premium APX membership built around the cloud gaming experience.",

    /*
       These are preview categories.

       We are intentionally NOT promising exact streaming
       quality, queue priority, pricing, or other paid
       benefits until those systems actually exist.
    */

    benefits: [

        {
            id: "cloud",
            eyebrow: "CLOUD",
            title: "Enhanced APX Experience",
            description:
                "Future cloud-focused features and upgrades can appear here."
        },

        {
            id: "library",
            eyebrow: "LIBRARY",
            title: "More From Your Games",
            description:
                "ZERO can eventually add membership features around compatible games in your Apex Games Library."
        },

        {
            id: "identity",
            eyebrow: "PROFILE",
            title: "ZERO Identity",
            description:
                "Future ZERO members can receive membership identity features across APX."
        },

        {
            id: "future",
            eyebrow: "COMING LATER",
            title: "More Benefits",
            description:
                "Additional APX ZERO benefits will be announced as the service develops."
        }

    ]

};


/* =========================================================
   ELEMENT HELPERS
========================================================= */

function getElement(id) {

    return document.getElementById(
        id
    );

}


/* =========================================================
   MEMBERSHIP STATE

   Prototype only.

   Later this should come from the authenticated Apex Games
   account/backend instead of local front-end state.
========================================================= */

let zeroMembershipActive =
    false;


export function hasAPXZero() {

    return zeroMembershipActive;

}


export function setAPXZeroPrototypeState(
    active
) {

    zeroMembershipActive =
        Boolean(active);


    updateAPXZeroStatus();

}


/* =========================================================
   STATUS UI
========================================================= */

export function updateAPXZeroStatus() {

    const badge =
        getElement(
            "zeroMembershipStatus"
        );


    const action =
        getElement(
            "zeroMembershipAction"
        );


    if (badge) {

        badge.textContent =
            zeroMembershipActive
                ? "ZERO ACTIVE"
                : "ZERO PREVIEW";


        badge.dataset.active =
            zeroMembershipActive
                ? "true"
                : "false";

    }


    if (action) {

        action.textContent =
            zeroMembershipActive
                ? "Manage ZERO"
                : "Explore Membership";

    }

}


/* =========================================================
   BENEFITS
========================================================= */

function createBenefitCard(
    benefit
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "zero-benefit-card";


    card.dataset.apxFocus =
        "";


    card.tabIndex =
        0;


    card.innerHTML =
        `
            <span class="zero-benefit-eyebrow">
                ${benefit.eyebrow}
            </span>

            <h3>
                ${benefit.title}
            </h3>

            <p>
                ${benefit.description}
            </p>
        `;


    return card;

}


export function renderAPXZeroBenefits() {

    const container =
        getElement(
            "zeroBenefits"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    APX_ZERO.benefits.forEach(
        benefit => {

            container.appendChild(
                createBenefitCard(
                    benefit
                )
            );

        }
    );

}


/* =========================================================
   ZERO SCREEN VISIBILITY

   The lower Home area uses three possible experiences:

   Welcome dashboard
   APX ZERO dashboard
   Normal game hub

   app.js will tell this module when ZERO becomes selected.
========================================================= */

export function showAPXZero() {

    document.body.classList.add(
        "zero-selected"
    );


    document.body.classList.remove(
        "welcome-selected"
    );


    const section =
        getElement(
            "apxZeroSection"
        );


    if (section) {

        section.hidden =
            false;

    }


    updateAPXZeroStatus();

}


export function hideAPXZero() {

    document.body.classList.remove(
        "zero-selected"
    );


    const section =
        getElement(
            "apxZeroSection"
        );


    if (section) {

        section.hidden =
            true;

    }

}


/* =========================================================
   SCROLL TO ZERO
========================================================= */

export function scrollToAPXZero() {

    const section =
        getElement(
            "apxZeroSection"
        );


    if (!section) {

        return;

    }


    section.scrollIntoView(
        {
            behavior: "smooth",
            block: "start"
        }
    );

}


/* =========================================================
   ZERO ACTION

   No checkout is connected.

   This simply opens the ZERO experience.
========================================================= */

function handleMembershipAction() {

    scrollToAPXZero();


    window.dispatchEvent(
        new CustomEvent(
            "apx:zeroaction",
            {
                detail: {

                    membershipActive:
                        zeroMembershipActive,

                    prototype:
                        true

                }
            }
        )
    );

}


/* =========================================================
   EVENT BINDING
========================================================= */

function bindAPXZeroEvents() {

    const action =
        getElement(
            "zeroMembershipAction"
        );


    if (action) {

        action.addEventListener(
            "click",
            handleMembershipAction
        );

    }


    window.addEventListener(
        "apx:openzero",
        () => {

            showAPXZero();

            scrollToAPXZero();

        }
    );

}


/* =========================================================
   INITIALIZATION
========================================================= */

export function initAPXZero() {

    renderAPXZeroBenefits();

    updateAPXZeroStatus();

    bindAPXZeroEvents();


    /*
       ZERO is hidden by default because Welcome is the
       default APX boot selection.
    */

    hideAPXZero();


    console.log(
        "[APX] APX ZERO module ready."
    );

}
