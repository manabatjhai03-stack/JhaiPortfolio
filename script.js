const loadingScreen = document.getElementById("loading-screen");
const homepage = document.getElementById("homepage");
const typingText = document.getElementById("typing-text");
const spotlight = document.querySelector(".mouse-spotlight");
const themeToggle = document.getElementById("theme-toggle");

const hangingID = document.getElementById("hanging-id");
const idCard = document.getElementById("id-card");
const laceLeft = document.getElementById("lace-left");
const laceRight = document.getElementById("lace-right");

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");


// =====================================================
// TYPING ANIMATION
// =====================================================

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


// =====================================================
// LOADING → HOMEPAGE
// =====================================================

window.addEventListener("load", () => {

    setTimeout(() => {

        loadingScreen.classList.add("hide");

        homepage.classList.add("show");

        // start ID drop
        startIDDrop();

    }, 5000);

});


// =====================================================
// MOUSE SPOTLIGHT
// =====================================================

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let currentX = mouseX;
let currentY = mouseY;

document.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (spotlight) {
        spotlight.style.opacity = "1";
    }

});

function animateSpotlight() {

    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;

    if (spotlight) {

        spotlight.style.left =
            `${currentX}px`;

        spotlight.style.top =
            `${currentY}px`;
    }

    requestAnimationFrame(animateSpotlight);
}

animateSpotlight();


// =====================================================
// THEME
// =====================================================

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        themeToggle.textContent = "☁";

    } else {

        themeToggle.textContent = "☄";

    }

});


// =====================================================
// HANGING ID
// =====================================================

// normal position
const homeX = 110;
const homeY = 270;

// current position
let idX = homeX;
let idY = -500;

// target position
let targetX = homeX;
let targetY = homeY;

// velocity
let velocityX = 0;
let velocityY = 0;

// rotation
let rotation = 2;
let targetRotation = 2;

// drag
let draggingID = false;

let startPointerX = 0;
let startPointerY = 0;

let startCardX = 0;
let startCardY = 0;

// movement
let windTime = 0;

// drop
let dropping = false;
let dropVelocity = 0;


// =====================================================
// START DROP
// =====================================================

function startIDDrop() {

    dropping = true;

    idX = homeX;

    idY = -500;

    velocityX = 0;

    velocityY = 0;

    rotation = -8;

    targetRotation = 2;

}


// =====================================================
// UPDATE LACE
// =====================================================

function updateLace() {

    const anchorX = 110;
    const anchorY = 0;

    const wind =
        Math.sin(windTime) * 4;

    const wind2 =
        Math.sin(windTime * 0.7) * 2;

    const distance =
        idX - anchorX;

    const curve =
        distance * 0.30 + wind;


    // LEFT STRAND

    const leftPath = `

        M ${anchorX - 7} ${anchorY}

        C

        ${anchorX - 15 + curve}
        85,

        ${idX - 48 - curve + wind2}
        ${idY - 80},

        ${idX - 30}
        ${idY}

    `;


    // RIGHT STRAND

    const rightPath = `

        M ${anchorX + 7} ${anchorY}

        C

        ${anchorX + 15 + curve}
        85,

        ${idX + 48 - curve + wind2}
        ${idY - 80},

        ${idX + 30}
        ${idY}

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


// =====================================================
// UPDATE ID
// =====================================================

function updateID() {

    idCard.style.left =
        `${idX}px`;

    idCard.style.top =
        `${idY}px`;

    idCard.style.transform =
        `translateX(-50%) rotate(${rotation}deg)`;

    updateLace();
}


// =====================================================
// DRAG START
// =====================================================

idCard.addEventListener(
    "pointerdown",
    (e) => {

        if (dropping) return;

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


// =====================================================
// DRAGGING
// =====================================================

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


        // rotation while dragging

        targetRotation =
            2 +
            (targetX - 110) * 0.075;


        // movement velocity

        velocityX =
            dx * 0.055;

        velocityY =
            dy * 0.055;

    }
);


// =====================================================
// RELEASE
// =====================================================

function releaseID() {

    if (!draggingID)
        return;

    draggingID = false;

    targetX = homeX;

    targetY = homeY;

    targetRotation = 2;

}


// pointer up

idCard.addEventListener(
    "pointerup",
    releaseID
);


// pointer cancel

idCard.addEventListener(
    "pointercancel",
    releaseID
);


// =====================================================
// ID PHYSICS
// =====================================================

function animateID() {

    windTime += 0.025;


    // =================================================
    // DROP ANIMATION
    // =================================================

    if (dropping) {

        // gravity

        dropVelocity += 0.75;

        idY += dropVelocity;


        // slight side movement

        idX =
            homeX +
            Math.sin(
                windTime * 1.8
            ) * 3;


        // rotation during fall

        rotation +=
            (-8 - rotation) * 0.025;


        // landing

        if (idY >= homeY) {

            idY = homeY;

            dropVelocity = -10;

            dropping = false;

            targetX = homeX;

            targetY = homeY;

            targetRotation = 2;
        }

    }


    // =================================================
    // NORMAL PHYSICS
    // =================================================

    else {

        const spring = 0.055;

        const friction = 0.88;


        // X

        const forceX =
            targetX - idX;

        velocityX +=
            forceX * spring;

        velocityX *=
            friction;

        idX +=
            velocityX;


        // Y

        const forceY =
            targetY - idY;

        velocityY +=
            forceY * spring;

        velocityY *=
            friction;

        idY +=
            velocityY;


        // wind

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

    }


    updateID();

    requestAnimationFrame(
        animateID
    );
}


// =====================================================
// START ID
// =====================================================

updateID();

animateID();


// =====================================================
// FLIP ID
// =====================================================

idCard.addEventListener(
    "click",
    () => {

        if (dropping)
            return;

        idCard.classList.toggle(
            "flipped"
        );

    }
);


// =====================================================
// MOBILE MENU
// =====================================================

if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "active"
            );

            const isOpen =
                navLinks.classList.contains(
                    "active"
                );


            menuToggle.textContent =
                isOpen
                    ? "✕"
                    : "☰";


            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    navLinks
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove(
                        "active"
                    );

                    menuToggle.textContent =
                        "☰";

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}
window.addEventListener("load", () => {

    setTimeout(() => {

        const heroElements =
            document.querySelectorAll(".hero-animate");

        heroElements.forEach((element) => {
            element.classList.add("show");
        });

    }, 5200);

});

const roleTyping = document.getElementById("role-typing");

const roleText = [
    "FULL-STACK DEVELOPER",
    "EDITOR-VIDEOGRAPHER/PHOTOGRAPHER",
    "UI/UX DESIGNER."
];

let roleLine = 0;
let roleChar = 0;

function typeRole() {
    if (!roleTyping) return;

    if (roleChar < roleText[roleLine].length) {
        roleTyping.textContent += roleText[roleLine].charAt(roleChar);
        roleChar++;

        setTimeout(typeRole, 70);
    } else {
        setTimeout(() => {
            roleTyping.textContent = "";
            roleChar = 0;
            roleLine++;

            if (roleLine >= roleText.length) {
                roleLine = 0;
            }

            typeRole();
        }, 1200);
    }
}

setTimeout(typeRole, 1000);


const trueFocus = document.querySelector(".true-focus-name");

if (trueFocus) {
    const words = trueFocus.querySelectorAll(".focus-word");
    const frame = trueFocus.querySelector(".focus-frame");

    let currentIndex = 0;

    function updateFocus() {
        const activeWord = words[currentIndex];

        words.forEach(word => {
            word.classList.remove("active");
        });

        activeWord.classList.add("active");

        // position ng focus frame
        frame.style.left = `${activeWord.offsetLeft}px`;
        frame.style.width = `${activeWord.offsetWidth}px`;
        frame.style.height = `${activeWord.offsetHeight}px`;
    }

    updateFocus();

    setInterval(() => {
        currentIndex++;

        if (currentIndex >= words.length) {
            currentIndex = 0;
        }

        updateFocus();
    }, 1500);
}

const profileCard = document.querySelector(".profile-card");

if (profileCard) {

    function moveCard(clientX, clientY) {

        const rect = profileCard.getBoundingClientRect();

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;

        const mouseX = (x / rect.width) * 100;
        const mouseY = (y / rect.height) * 100;

        profileCard.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             scale(1.02)`;

        profileCard.style.setProperty(
            "--mouse-x",
            `${mouseX}%`
        );

        profileCard.style.setProperty(
            "--mouse-y",
            `${mouseY}%`
        );

        profileCard.style.setProperty(
            "--shine-x",
            `${mouseX}%`
        );

        profileCard.style.setProperty(
            "--shine-y",
            `${mouseY}%`
        );
    }


    /* DESKTOP */

    profileCard.addEventListener("mousemove", (e) => {

        moveCard(e.clientX, e.clientY);

    });


    profileCard.addEventListener("mouseleave", () => {

        resetCard();

    });


    /* MOBILE */

    profileCard.addEventListener(
        "touchmove",
        (e) => {

            const touch = e.touches[0];

            moveCard(
                touch.clientX,
                touch.clientY
            );

        },
        { passive: true }
    );


    profileCard.addEventListener(
        "touchend",
        () => {

            resetCard();

        }
    );


    function resetCard() {

        profileCard.style.transform =
            "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";

        profileCard.style.setProperty(
            "--mouse-x",
            "50%"
        );

        profileCard.style.setProperty(
            "--mouse-y",
            "50%"
        );

        profileCard.style.setProperty(
            "--shine-x",
            "50%"
        );

        profileCard.style.setProperty(
            "--shine-y",
            "50%"
        );

    }

}

profileCard.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];

    moveCard(
        touch.clientX,
        touch.clientY
    );
}, { passive: true });


profileCard.addEventListener("touchmove", (e) => {

    e.preventDefault();

    const touch = e.touches[0];

    moveCard(
        touch.clientX,
        touch.clientY
    );

}, { passive: false });


profileCard.addEventListener("touchend", () => {
    resetCard();
});

/* =========================
   SCROLL VELOCITY
========================= */

const velocityTracks =
    document.querySelectorAll(".scroll-velocity-track");

if (velocityTracks.length) {

    let currentX = [0, 0];
    let targetSpeed = 1;
    let currentSpeed = 1;

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    function animateVelocity(time) {

        const deltaTime = time - lastTime;
        lastTime = time;

        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;

        lastScrollY = scrollY;

        const scrollSpeed = Math.abs(scrollDelta);

        targetSpeed =
            1 + Math.min(scrollSpeed * 1, 15);

        currentSpeed +=
            (targetSpeed - currentSpeed) * 1, 8;

        velocityTracks.forEach((track, index) => {

            /* first row = left
               second row = right */

            const baseDirection =
                index === 0 ? -1 : 1;

            const direction =
                scrollDelta === 0
                    ? baseDirection
                    : baseDirection * (scrollDelta > 0 ? 1 : -1);

            currentX[index] +=
                direction *
                currentSpeed *
                3 *
                (deltaTime / 16);

            const trackWidth =
                track.scrollWidth / 2;

            if (currentX[index] <= -trackWidth) {
                currentX[index] += trackWidth;
            }

            if (currentX[index] >= 0) {
                currentX[index] -= trackWidth;
            }

            track.style.transform =
                `translate3d(${currentX[index]}px, 0, 0)`;

        });

        requestAnimationFrame(animateVelocity);
    }

    requestAnimationFrame(animateVelocity);

}

const statNumbers = document.querySelectorAll(".stat-number");

statNumbers.forEach((number, index) => {

    const target = Number(number.dataset.target);
    const hasPlus = number.dataset.plus === "true";

    let current = 0;

    // delay before counting
    const delay = 7000 + (index * 2000);

    setTimeout(() => {

        const duration = 2000;
        const stepTime = duration / target;

        const counter = setInterval(() => {

            current++;

            if (current >= target) {
                current = target;

                number.textContent = hasPlus
                    ? `${target}+`
                    : target;

                clearInterval(counter);

            } else {
                number.textContent = current;
            }

        }, stepTime);

    }, delay);

});