const loadingScreen = document.getElementById("loading-screen");
const homepage = document.getElementById("homepage");
const typingText = document.getElementById("typing-text");
const spotlight = document.querySelector(".mouse-spotlight");
const themeToggle = document.getElementById("theme-toggle");

const hangingID = document.getElementById("hanging-id");
const idCard = document.getElementById("id-card");
const laceLeft = document.getElementById("lace-left");
const laceRight = document.getElementById("lace-right");

// TYPING ANIMATION


const texts = [
    "Hello, I'm Jhai.",
    "I'm a CCS Student.",
    "Aspiring Web Developer."
];

let textIndex = 0;
let charIndex = 0;
let deleting = false;


function typeEffect() {

    const currentText = texts[textIndex];

    if (!deleting) {

        typingText.textContent =
            currentText.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === currentText.length) {

            deleting = true;

            setTimeout(typeEffect, 1500);

            return;
        }

    } else {

        typingText.textContent =
            currentText.substring(0, charIndex - 1);

        charIndex--;

        if (charIndex === 0) {

            deleting = false;

            textIndex++;

            if (textIndex >= texts.length) {
                textIndex = 0;
            }
        }
    }

    const speed = deleting ? 50 : 90;

    setTimeout(typeEffect, speed);
}


typeEffect();



// LOADING → HOMEPAGE


window.addEventListener("load", () => {

    setTimeout(() => {

        loadingScreen.classList.add("hide");

        homepage.classList.add("show");

    }, 5000);

});



// MOUSE SPOTLIGHT


let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let currentX = mouseX;
let currentY = mouseY;


document.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    spotlight.style.opacity = "1";

});


function animateSpotlight() {

    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    spotlight.style.left = `${currentX}px`;
    spotlight.style.top = `${currentY}px`;

    requestAnimationFrame(animateSpotlight);
}


animateSpotlight();

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        themeToggle.textContent = "☁";

    } else {

        themeToggle.textContent = "☄";

    }
});
// =========================
// HANGING ID
// =========================

let idX = 110;
let idY = 270;

let targetX = 110;
let targetY = 270;

let velocityX = 0;
let velocityY = 0;

let rotation = 2;
let targetRotation = 2;

let draggingID = false;

let startPointerX = 0;
let startPointerY = 0;

let startCardX = 0;
let startCardY = 0;

let windTime = 0;


// =========================
// UPDATE LACE
// =========================

function updateLace() {

    const anchorX = 110;
    const anchorY = 0;

    // subtle wind
    const wind =
        Math.sin(windTime) * 5;

    const wind2 =
        Math.sin(windTime * 0.65) * 2;

    const curve =
        (idX - anchorX) * 0.32
        + wind;


    // LEFT LACE

    const leftPath = `
        M ${anchorX - 7} ${anchorY}

        C
        ${anchorX - 14 + curve} 90,

        ${idX - 45 - curve + wind2} ${idY - 75},

        ${idX - 30} ${idY}
    `;


    // RIGHT LACE

    const rightPath = `
        M ${anchorX + 7} ${anchorY}

        C
        ${anchorX + 14 + curve} 90,

        ${idX + 45 - curve + wind2} ${idY - 75},

        ${idX + 30} ${idY}
    `;


    laceLeft.setAttribute(
        "d",
        leftPath
    );

    laceRight.setAttribute(
        "d",
        rightPath
    );
}


// =========================
// UPDATE ID
// =========================

function updateID() {

    idCard.style.left =
        `${idX}px`;

    idCard.style.top =
        `${idY}px`;

    idCard.style.transform =
        `translateX(-50%) rotate(${rotation}deg)`;

    updateLace();
}


// =========================
// DRAG START
// =========================

idCard.addEventListener(
    "pointerdown",
    (e) => {

        draggingID = true;

        idCard.setPointerCapture(
            e.pointerId
        );

        startPointerX =
            e.clientX;

        startPointerY =
            e.clientY;

        startCardX =
            idX;

        startCardY =
            idY;

        velocityX = 0;
        velocityY = 0;

        e.preventDefault();
    }
);


// =========================
// DRAGGING
// =========================

idCard.addEventListener(
    "pointermove",
    (e) => {

        if (!draggingID)
            return;


        const dx =
            e.clientX -
            startPointerX;

        const dy =
            e.clientY -
            startPointerY;


        targetX =
            startCardX + dx;

        targetY =
            startCardY + dy;


        // horizontal limit

        targetX =
            Math.max(
                25,
                Math.min(
                    195,
                    targetX
                )
            );


        // vertical limit

        targetY =
            Math.max(
                150,
                Math.min(
                    430,
                    targetY
                )
            );


        // tilt while dragging

        targetRotation =
            2 +
            (targetX - 110) * 0.075;


        velocityX =
            dx * 0.06;

    }
);


// =========================
// RELEASE
// =========================

function releaseID() {

    if (!draggingID)
        return;

    draggingID = false;


    // return to Jhai Manabat position

    targetX = 110;

    targetY = 270;

    targetRotation = 2;
}


idCard.addEventListener(
    "pointerup",
    releaseID
);


idCard.addEventListener(
    "pointercancel",
    releaseID
);


// =========================
// PHYSICS + WIND
// =========================

function animateID() {

    // wind movement

    windTime += 0.025;


    const spring = 0.055;

    const friction = 0.88;


    // X physics

    const forceX =
        targetX - idX;

    velocityX +=
        forceX * spring;

    velocityX *=
        friction;

    idX +=
        velocityX;


    // Y physics

    const forceY =
        targetY - idY;

    velocityY +=
        forceY * spring;

    velocityY *=
        friction;

    idY +=
        velocityY;


    // wind rotation

    const windRotation =
        Math.sin(
            windTime * 1.2
        ) * 0.8;


    // final rotation

    const rotationTarget =
        targetRotation
        + velocityX * 0.4
        + windRotation;


    rotation +=
        (
            rotationTarget -
            rotation
        ) * 0.08;


    updateID();


    requestAnimationFrame(
        animateID
    );
}


// =========================
// START
// =========================

updateID();

animateID();

idCard.addEventListener("click", () => {
    idCard.classList.toggle("flipped");
});