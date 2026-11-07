
/* =====================================================
   WANDERLUX TRAVEL AGENCY
   ICT502 Assessment 2

   File: js/carousel.js

   Features:
   - Automatic destination slideshow
   - Previous and next buttons
   - Navigation dots
   - Keyboard controls
   - Pause on hover and focus
   - Accessible slide management
   - Reduced-motion support
   ===================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeCarousel();
});


function initializeCarousel() {

    // Find carousel elements.
    const carousel = document.querySelector(".hero-carousel");

    // Stop if the current page has no carousel.
    if (!carousel) {
        return;
    }

    const slides = Array.from(
        carousel.querySelectorAll(".hero-slide")
    );

    const dots = Array.from(
        carousel.querySelectorAll(".carousel-dot")
    );

    const previousButton = carousel.querySelector(
        ".carousel-prev"
    );

    const nextButton = carousel.querySelector(
        ".carousel-next"
    );

    // Check that all required elements exist.
    if (
        slides.length === 0 ||
        slides.length !== dots.length ||
        !previousButton ||
        !nextButton
    ) {
        console.warn(
            "WanderLux carousel: required elements are missing."
        );
        return;
    }

    // Carousel settings.
    const slideInterval = 5000;

    let currentSlide = 0;
    let autoPlayTimer = null;

    let isHovered = false;
    let isFocused = false;

    // Accessibility preference.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    /* ---------------------------------------------
       DISPLAY SELECTED SLIDE
       --------------------------------------------- */

    function showSlide(index) {

        // Keep the slide index within the valid range.
        const totalSlides = slides.length;

        currentSlide = (
            (index % totalSlides) + totalSlides
        ) % totalSlides;

        slides.forEach((slide, slideIndex) => {

            const isActive = slideIndex === currentSlide;

            // CSS uses .active to display a slide.
            slide.classList.toggle("active", isActive);

            // Hide inactive slides from assistive technology.
            slide.setAttribute(
                "aria-hidden",
                String(!isActive)
            );

            // Prevent keyboard focus inside inactive slides.
            slide.inert = !isActive;

        });

        // Update navigation dots.
        dots.forEach((dot, dotIndex) => {

            const isActive = dotIndex === currentSlide;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }

        });

    }


    /* ---------------------------------------------
       MOVE TO NEXT OR PREVIOUS SLIDE
       --------------------------------------------- */

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
    }


    /* ---------------------------------------------
       AUTOMATIC SLIDE ROTATION
       --------------------------------------------- */

    function stopAutoPlay() {

        if (autoPlayTimer !== null) {
            window.clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }

    }

    function canAutoPlay() {

        return (
            !reducedMotion.matches &&
            !isHovered &&
            !isFocused &&
            !document.hidden &&
            slides.length > 1
        );

    }

    function startAutoPlay() {

        // Prevent multiple timers running together.
        stopAutoPlay();

        if (!canAutoPlay()) {
            return;
        }

        autoPlayTimer = window.setInterval(() => {

            if (canAutoPlay()) {
                nextSlide();
            }

        }, slideInterval);

    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }


    /* ---------------------------------------------
       PREVIOUS AND NEXT BUTTONS
       --------------------------------------------- */

    previousButton.addEventListener("click", () => {

        previousSlide();
        restartAutoPlay();

    });

    nextButton.addEventListener("click", () => {

        nextSlide();
        restartAutoPlay();

    });


    /* ---------------------------------------------
       NAVIGATION DOT BUTTONS
       --------------------------------------------- */

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            showSlide(index);
            restartAutoPlay();

        });

    });


    /* ---------------------------------------------
       KEYBOARD NAVIGATION
       --------------------------------------------- */

    carousel.addEventListener("keydown", (event) => {

        // Arrow keys work when focus is inside
        // the carousel, not elsewhere on the page.
        if (event.key === "ArrowRight") {

            event.preventDefault();
            nextSlide();
            restartAutoPlay();

        } else if (event.key === "ArrowLeft") {

            event.preventDefault();
            previousSlide();
            restartAutoPlay();

        }

    });


    /* ---------------------------------------------
       PAUSE WHEN MOUSE HOVERS OVER CAROUSEL
       --------------------------------------------- */

    carousel.addEventListener("mouseenter", () => {

        isHovered = true;
        stopAutoPlay();

    });

    carousel.addEventListener("mouseleave", () => {

        isHovered = false;
        startAutoPlay();

    });


    /* ---------------------------------------------
       PAUSE WHEN USING KEYBOARD FOCUS
       --------------------------------------------- */

    carousel.addEventListener("focusin", () => {

        isFocused = true;
        stopAutoPlay();

    });

    carousel.addEventListener("focusout", (event) => {

        // Only resume after focus leaves the carousel.
        if (
            !event.relatedTarget ||
            !carousel.contains(event.relatedTarget)
        ) {

            isFocused = false;
            startAutoPlay();

        }

    });


    /* ---------------------------------------------
       STOP WHEN BROWSER TAB IS HIDDEN
       --------------------------------------------- */

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }

    });


    /* ---------------------------------------------
       REDUCED-MOTION ACCESSIBILITY
       --------------------------------------------- */

    function handleMotionPreferenceChange() {

        // Stop auto-rotation when reduced motion
        // is enabled in the operating system.
        restartAutoPlay();

    }

    reducedMotion.addEventListener(
        "change",
        handleMotionPreferenceChange
    );


    /* ---------------------------------------------
       INITIALISE CAROUSEL
       --------------------------------------------- */

    // Begin on the first destination.
    showSlide(0);

    // Start automatic rotation when permitted.
    startAutoPlay();

}
