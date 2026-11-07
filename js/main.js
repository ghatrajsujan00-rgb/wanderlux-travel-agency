
/* =====================================================
   WANDERLUX TRAVEL AGENCY
   ICT502 Assessment 2

   File: js/main.js

   Features:
   1. Responsive mobile navigation
   2. Scroll-triggered animations
   3. Automatic copyright year
   ===================================================== */

"use strict";

// Wait until the HTML document has finished loading.
document.addEventListener("DOMContentLoaded", () => {

    initializeMobileNavigation();
    initializeScrollAnimations();
    updateCopyrightYear();

});


/* =====================================================
   1. RESPONSIVE MOBILE NAVIGATION
   ===================================================== */

function initializeMobileNavigation() {

    // Find the navigation elements.
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".primary-nav");

    // Stop safely if a page does not contain the menu.
    if (!menuToggle || !navigation) {
        return;
    }

    const mobileBreakpoint = window.matchMedia(
        "(max-width: 899px)"
    );

    // Open or close the navigation menu.
    function setMenuState(isOpen) {

        navigation.classList.toggle("is-open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    }

    // Clicking the hamburger button toggles the menu.
    menuToggle.addEventListener("click", () => {

        const isOpen = navigation.classList.contains(
            "is-open"
        );

        setMenuState(!isOpen);

    });

    // Close the menu when a navigation link is selected.
    const navigationLinks = navigation.querySelectorAll("a");

    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            if (mobileBreakpoint.matches) {
                setMenuState(false);
            }

        });

    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            navigation.classList.contains("is-open")
        ) {

            setMenuState(false);

            // Return keyboard focus to the menu button.
            menuToggle.focus();

        }

    });

    // Close the menu when clicking outside the header.
    document.addEventListener("click", (event) => {

        const clickedInsideMenu = navigation.contains(
            event.target
        );

        const clickedMenuButton = menuToggle.contains(
            event.target
        );

        if (!clickedInsideMenu && !clickedMenuButton) {
            setMenuState(false);
        }

    });

    // Reset the mobile menu when switching to desktop.
    function handleScreenChange(event) {

        if (!event.matches) {
            setMenuState(false);
        }

    }

    mobileBreakpoint.addEventListener(
        "change",
        handleScreenChange
    );

}


/* =====================================================
   2. SCROLL-TRIGGERED ANIMATIONS
   ===================================================== */

function initializeScrollAnimations() {

    // Find elements marked for animation.
    const animatedElements = document.querySelectorAll(
        ".reveal"
    );

    if (animatedElements.length === 0) {
        return;
    }

    // Respect visitors who prefer reduced animations.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {
        return;
    }

    // If IntersectionObserver is unavailable,
    // all content remains visible.
    if (!("IntersectionObserver" in window)) {
        return;
    }

    // Only animate elements below the initial viewport.
    // This avoids hiding content already on screen.
    const elementsToObserve = [];

    animatedElements.forEach((element) => {

        const position = element.getBoundingClientRect();

        if (position.top < window.innerHeight) {

            element.classList.add("visible");

        } else {

            elementsToObserve.push(element);

        }

    });

    // Enable CSS animation styles.
    document.documentElement.classList.add(
        "reveal-ready"
    );

    // Detect when elements enter the viewport.
    const observer = new IntersectionObserver(

        (entries, currentObserver) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    // Apply the CSS reveal transition.
                    entry.target.classList.add("visible");

                    // Animate each element only once.
                    currentObserver.unobserve(entry.target);

                }

            });

        },

        {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        }

    );

    // Observe elements that have not appeared yet.
    elementsToObserve.forEach((element) => {

        observer.observe(element);

    });

}


/* =====================================================
   3. AUTOMATIC COPYRIGHT YEAR
   ===================================================== */

function updateCopyrightYear() {

    const yearElement = document.getElementById(
        "current-year"
    );

    // Avoid errors on pages without the footer element.
    if (!yearElement) {
        return;
    }

    // Get the year from the visitor's device.
    const currentYear = new Date().getFullYear();

    // Update the copyright text.
    yearElement.textContent = currentYear;

}
