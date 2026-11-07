
/* =====================================================
   WANDERLUX TRAVEL AGENCY
   ICT502 Assessment 2

   File: js/calculator.js

   Features:
   - Destination-based preset travel rates
   - Budget, Standard and Luxury pricing
   - Input validation and accessible error messages
   - Detailed cost breakdown
   - Reset functionality
   - Australian dollar formatting

   Rates are demonstrations, not live travel prices.
   ===================================================== */

"use strict";

/* 1. PRESET DESTINATION RATES */

const DESTINATION_RATES = Object.freeze({
    bali: {
        name: "Bali",
        dailyRate: 100,
        roomRate: 90
    },

    thailand: {
        name: "Thailand",
        dailyRate: 110,
        roomRate: 100
    },

    japan: {
        name: "Japan",
        dailyRate: 160,
        roomRate: 150
    },

    switzerland: {
        name: "Switzerland",
        dailyRate: 220,
        roomRate: 210
    },

    maldives: {
        name: "Maldives",
        dailyRate: 240,
        roomRate: 260
    }
});


/* 2. TRAVEL STYLE MULTIPLIERS */

const TRAVEL_STYLES = Object.freeze({
    budget: {
        name: "Budget",
        multiplier: 0.85
    },

    standard: {
        name: "Standard",
        multiplier: 1.00
    },

    luxury: {
        name: "Luxury",
        multiplier: 1.50
    }
});


/* 3. AUSTRALIAN CURRENCY FORMATTER */

const AUD_FORMATTER = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function formatCurrency(amount) {
    return AUD_FORMATTER.format(amount);
}


/* 4. PURE CALCULATION FUNCTION */

/*
   Rooms are shared by a maximum of two travellers.

   Total =
   (Traveller cost + Accommodation cost)
   x Travel style multiplier
*/

function calculateTripCost(
    destinationKey,
    travellers,
    days,
    styleKey
) {

    const destination = DESTINATION_RATES[destinationKey];
    const style = TRAVEL_STYLES[styleKey];

    if (!destination || !style) {
        throw new Error("Invalid destination or travel style.");
    }

    if (
        !Number.isInteger(travellers) ||
        travellers < 1 ||
        travellers > 20 ||
        !Number.isInteger(days) ||
        days < 1 ||
        days > 60
    ) {
        throw new Error("Invalid number of travellers or days.");
    }

    // One room accommodates up to two travellers.
    const rooms = Math.ceil(travellers / 2);

    // Estimated individual travel expenses.
    const travellerCost =
        destination.dailyRate * travellers * days;

    // Estimated accommodation expenses.
    const accommodationCost =
        destination.roomRate * rooms * days;

    // Total before the travel-style adjustment.
    const subtotal =
        travellerCost + accommodationCost;

    // Difference added or deducted by travel style.
    const styleAdjustment =
        subtotal * (style.multiplier - 1);

    // Final estimated package price.
    const total =
        Math.round(
            (subtotal + styleAdjustment) * 100
        ) / 100;

    return {
        destination: destination.name,
        travellers: travellers,
        days: days,
        rooms: rooms,
        style: style.name,
        multiplier: style.multiplier,
        travellerCost: travellerCost,
        accommodationCost: accommodationCost,
        subtotal: subtotal,
        styleAdjustment: styleAdjustment,
        total: total
    };
}


/* 5. INITIALISE WHEN PAGE IS READY */

document.addEventListener("DOMContentLoaded", () => {
    initialiseTripCalculator();
});


function initialiseTripCalculator() {

    const form = document.getElementById(
        "trip-calculator"
    );

    // The script can safely load on other pages.
    if (!form) {
        return;
    }

    const fields = {
        destination: document.getElementById("destination"),
        travellers: document.getElementById("travellers"),
        days: document.getElementById("days"),
        style: document.getElementById("travel-style")
    };

    const resultPanel = document.getElementById(
        "calculator-result"
    );

    const generalError = document.getElementById(
        "calculator-error"
    );

    // Link each input to its own error message.
    const errorElements = {
        destination: document.getElementById(
            "destination-error"
        ),
        travellers: document.getElementById(
            "travellers-error"
        ),
        days: document.getElementById(
            "days-error"
        ),
        style: document.getElementById(
            "travel-style-error"
        )
    };


    /* 6. CLEAR A SINGLE FIELD ERROR */

    function clearFieldError(fieldName) {

        const field = fields[fieldName];
        const error = errorElements[fieldName];

        field.removeAttribute("aria-invalid");
        error.textContent = "";
    }


    /* 7. DISPLAY A FIELD ERROR */

    function showFieldError(fieldName, message) {

        const field = fields[fieldName];
        const error = errorElements[fieldName];

        field.setAttribute("aria-invalid", "true");
        error.textContent = message;
    }


    /* 8. CLEAR ALL ERRORS */

    function clearAllErrors() {

        Object.keys(fields).forEach((fieldName) => {
            clearFieldError(fieldName);
        });

        generalError.textContent = "";
        generalError.hidden = true;
    }


    /* 9. VALIDATE ALL FORM INPUTS */

    function validateForm() {

        clearAllErrors();

        let isValid = true;
        let firstInvalidField = null;

        function markInvalid(fieldName, message) {

            showFieldError(fieldName, message);

            if (!firstInvalidField) {
                firstInvalidField = fields[fieldName];
            }

            isValid = false;
        }

        const destinationKey = fields.destination.value;
        const styleKey = fields.style.value;

        const travellersInput = fields.travellers.value.trim();
        const daysInput = fields.days.value.trim();

        const travellers = Number(travellersInput);
        const days = Number(daysInput);

        // Destination must be one of the configured choices.
        if (
            !Object.hasOwn(
                DESTINATION_RATES,
                destinationKey
            )
        ) {
            markInvalid(
                "destination",
                "Please select a valid destination."
            );
        }

        // Travellers must be an integer between 1 and 20.
        if (travellersInput === "") {

            markInvalid(
                "travellers",
                "Please enter the number of travellers."
            );

        } else if (
            !Number.isInteger(travellers) ||
            travellers < 1 ||
            travellers > 20
        ) {

            markInvalid(
                "travellers",
                "Enter a whole number between 1 and 20."
            );

        }

        // Duration must be an integer between 1 and 60.
        if (daysInput === "") {

            markInvalid(
                "days",
                "Please enter the number of travel days."
            );

        } else if (
            !Number.isInteger(days) ||
            days < 1 ||
            days > 60
        ) {

            markInvalid(
                "days",
                "Enter a whole number between 1 and 60."
            );

        }

        // Travel style must exist in the configured styles.
        if (
            !Object.hasOwn(
                TRAVEL_STYLES,
                styleKey
            )
        ) {

            markInvalid(
                "style",
                "Please select a valid travel style."
            );

        }

        // Focus the first invalid field.
        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
        }

        return {
            isValid: isValid,
            destination: destinationKey,
            travellers: travellers,
            days: days,
            style: styleKey
        };
    }


    /* 10. FILL THE RESULT PANEL */

    function displayResult(result) {

        const setText = (id, value) => {

            const element = document.getElementById(id);

            if (element) {
                element.textContent = value;
            }

        };

        const summary =
            `Estimated cost for ${result.travellers} ` +
            `${result.travellers === 1 ? "traveller" : "travellers"} ` +
            `to ${result.destination} for ${result.days} ` +
            `${result.days === 1 ? "day" : "days"}: ` +
            `${formatCurrency(result.total)} – ` +
            `${result.style} Travel Package.`;

        setText("result-summary", summary);

        setText(
            "result-total",
            formatCurrency(result.total)
        );

        setText(
            "result-destination",
            result.destination
        );

        setText(
            "result-travellers",
            String(result.travellers)
        );

        setText(
            "result-days",
            `${result.days} days`
        );

        setText(
            "result-style",
            result.style
        );

        setText(
            "result-travel-cost",
            formatCurrency(result.travellerCost)
        );

        setText(
            "result-accommodation",
            `${formatCurrency(result.accommodationCost)} ` +
            `(${result.rooms} ` +
            `${result.rooms === 1 ? "room" : "rooms"})`
        );

        const adjustmentDescription =
            `${result.style} (${result.multiplier.toFixed(2)}×): ` +
            `${result.styleAdjustment >= 0 ? "+" : "−"}` +
            formatCurrency(
                Math.abs(result.styleAdjustment)
            );

        setText(
            "result-multiplier",
            adjustmentDescription
        );

        // Reveal the result only after it is populated.
        resultPanel.hidden = false;

        // Bring the result into view.
        resultPanel.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start"
        });

        // Focus the result heading region.
        resultPanel.focus({
            preventScroll: true
        });
    }


    /* 11. FORM SUBMISSION */

    form.addEventListener("submit", (event) => {

        // Prevent a page reload.
        event.preventDefault();

        // Hide stale results before a new calculation.
        resultPanel.hidden = true;

        const input = validateForm();

        if (!input.isValid) {

            generalError.textContent =
                "Please correct the highlighted fields " +
                "before calculating your trip.";

            generalError.hidden = false;
            return;
        }

        try {

            const result = calculateTripCost(
                input.destination,
                input.travellers,
                input.days,
                input.style
            );

            displayResult(result);

        } catch (error) {

            console.error(
                "Trip calculation error:",
                error
            );

            generalError.textContent =
                "We could not calculate your trip. " +
                "Please check your details and try again.";

            generalError.hidden = false;
        }
    });


    /* 12. REMOVE ERRORS AS INPUTS ARE CORRECTED */

    Object.keys(fields).forEach((fieldName) => {

        const field = fields[fieldName];

        const eventType =
            field.tagName === "SELECT"
                ? "change"
                : "input";

        field.addEventListener(eventType, () => {

            clearFieldError(fieldName);

            generalError.hidden = true;
            generalError.textContent = "";

            // A previous total is no longer current.
            resultPanel.hidden = true;

        });

    });


    /* 13. RESET THE CALCULATOR */

    form.addEventListener("reset", () => {

        // Allow the browser to reset native field values.
        window.requestAnimationFrame(() => {

            clearAllErrors();

            resultPanel.hidden = true;

            // Restore focus to the first input.
            fields.destination.focus();

        });

    });

}
