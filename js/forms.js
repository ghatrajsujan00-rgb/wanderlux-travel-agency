
/* =====================================================
   WANDERLUX TRAVEL AGENCY
   ICT502 Assessment 2
   File: js/forms.js

   Features:
   1. Contact form validation
   2. Appointment form validation
   3. Future date validation
   4. Formspree email integration
   5. Success and error messages
   6. Loading and reset functionality
   ===================================================== */

"use strict";


// 1. INITIALISE FORMS

document.addEventListener("DOMContentLoaded", function () {

    setupForm("contact-form", "contact");
    setupForm("appointment-form", "appointment");

});


// 2. SHARED FORM FUNCTION

function setupForm(formId, formType) {

    const form = document.getElementById(formId);

    // Stop if the form is not on the current page.
    if (!form) {
        return;
    }

    const status = document.getElementById(
        formType + "-status"
    );

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    const resetButton = form.querySelector(
        'button[type="reset"]'
    );

    const originalButtonText =
        submitButton.textContent.trim();

    let isSubmitting = false;

    // Select the fields required by each form.
    const fieldNames = formType === "contact"
        ? ["name", "email", "subject", "message"]
        : ["name", "email", "phone", "date", "message"];

    const fields = {};
    const errors = {};

    fieldNames.forEach(function (name) {

        fields[name] = document.getElementById(
            formType + "-" + name
        );

        errors[name] = document.getElementById(
            formType + "-" + name + "-error"
        );

    });


    // 3. DISPLAY STATUS MESSAGES

    function showStatus(message, type) {

        status.textContent = message;

        status.classList.remove("success", "error");
        status.classList.add(type);

        status.setAttribute(
            "role",
            type === "error" ? "alert" : "status"
        );

        status.hidden = false;

    }


    function clearStatus() {

        status.textContent = "";
        status.hidden = true;

        status.classList.remove("success", "error");
        status.setAttribute("role", "status");

    }


    // 4. SHOW FIELD ERRORS

    function showFieldError(name, message) {

        fields[name].setAttribute(
            "aria-invalid",
            "true"
        );

        errors[name].textContent = message;

    }


    function clearFieldError(name) {

        fields[name].removeAttribute("aria-invalid");

        errors[name].textContent = "";

    }


    function clearAllErrors() {

        fieldNames.forEach(function (name) {
            clearFieldError(name);
        });

    }


    // 5. VALIDATE EMAIL ADDRESS

    function isValidEmail(email) {

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);

    }


    // 6. VALIDATE PHONE NUMBER

    function isValidPhone(phone) {

        const allowedCharacters = /^[+()\d\s-]+$/;

        const digits = phone.replace(/\D/g, "");

        return (
            allowedCharacters.test(phone) &&
            digits.length >= 8 &&
            digits.length <= 15
        );

    }


    // 7. GET LOCAL DATE AS YYYY-MM-DD

    function formatLocalDate(date) {

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return year + "-" + month + "-" + day;

    }


    // 8. VALIDATE FUTURE APPOINTMENT DATE

    function isFutureDate(value) {

        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return false;
        }

        const parts = value.split("-").map(Number);

        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        const selectedDate = new Date(
            year,
            month - 1,
            day
        );

        // Ensure the date is a real calendar date.
        const validCalendarDate =
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month - 1 &&
            selectedDate.getDate() === day;

        const today = formatLocalDate(new Date());

        return validCalendarDate && value > today;

    }


    // 9. UPDATE MINIMUM APPOINTMENT DATE

    function updateMinimumDate() {

        if (formType !== "appointment") {
            return;
        }

        const tomorrow = new Date();

        tomorrow.setHours(12, 0, 0, 0);
        tomorrow.setDate(tomorrow.getDate() + 1);

        fields.date.min = formatLocalDate(tomorrow);

    }

    updateMinimumDate();


    // 10. VALIDATE ALL FORM FIELDS

    function validateForm() {

        clearAllErrors();

        let valid = true;
        let firstInvalidField = null;

        function reject(name, message) {

            showFieldError(name, message);

            if (firstInvalidField === null) {
                firstInvalidField = fields[name];
            }

            valid = false;

        }


        // Validate name.
        const name = fields.name.value.trim();

        if (name.length < 2 || name.length > 100) {

            reject(
                "name",
                "Please enter your full name (2-100 characters)."
            );

        }


        // Validate email.
        const email = fields.email.value.trim();

        if (
            !isValidEmail(email) ||
            email.length > 254
        ) {

            reject(
                "email",
                "Please enter a valid email address."
            );

        }


        // Validate message.
        const message = fields.message.value.trim();

        if (
            message.length < 10 ||
            message.length > 2000
        ) {

            reject(
                "message",
                "Please enter a message between 10 and 2000 characters."
            );

        }


        // CONTACT FORM VALIDATION

        if (formType === "contact") {

            const permittedSubjects = [
                "Holiday Packages",
                "Guided Tours",
                "Flights and Hotels",
                "Honeymoon Specials",
                "General Enquiry"
            ];

            if (
                !permittedSubjects.includes(
                    fields.subject.value
                )
            ) {

                reject(
                    "subject",
                    "Please select an enquiry subject."
                );

            }

        }


        // APPOINTMENT FORM VALIDATION

        if (formType === "appointment") {

            const phone = fields.phone.value.trim();

            if (!isValidPhone(phone)) {

                reject(
                    "phone",
                    "Enter a valid phone number containing 8-15 digits."
                );

            }

            if (!isFutureDate(fields.date.value)) {

                reject(
                    "date",
                    "Please select a valid future appointment date."
                );

            }

        }


        // Focus the first invalid input.
        if (!valid && firstInvalidField) {
            firstInvalidField.focus();
        }

        return valid;

    }


    // 11. CLEAR ERRORS WHEN USER EDITS FIELDS

    fieldNames.forEach(function (name) {

        const field = fields[name];

        const eventName =
            field.tagName === "SELECT" ||
            field.type === "date"
                ? "change"
                : "input";

        field.addEventListener(eventName, function () {

            clearFieldError(name);
            clearStatus();

        });

    });


    // 12. LOADING STATE

    function setLoadingState(loading) {

        isSubmitting = loading;

        submitButton.disabled = loading;

        if (resetButton) {
            resetButton.disabled = loading;
        }

        submitButton.textContent = loading
            ? "Sending..."
            : originalButtonText;

        form.setAttribute(
            "aria-busy",
            String(loading)
        );

    }


    // 13. GET FORMSPREE ENDPOINT

    function getEndpoint() {

        const endpoint = (
            form.dataset.endpoint || ""
        ).trim();

        const pattern =
            /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/;

        if (pattern.test(endpoint)) {
            return endpoint;
        }

        return null;

    }


    // 14. SUBMIT FORM

    form.addEventListener("submit", async function (event) {

        // Prevent normal browser submission.
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        clearStatus();
        updateMinimumDate();

        // Check all inputs first.
        if (!validateForm()) {

            showStatus(
                "Please correct the highlighted fields before submitting.",
                "error"
            );

            return;
        }

        const endpoint = getEndpoint();

        // Do not send until a valid endpoint exists.
        if (!endpoint) {

            showStatus(
                "Email delivery is not configured yet. Please add your Formspree endpoint.",
                "error"
            );

            return;
        }

        const formData = new FormData(form);

        // Identify the form in the received email.
        formData.append(
            "form_type",
            formType === "appointment"
                ? "Appointment Request"
                : "General Contact Enquiry"
        );

        setLoadingState(true);

        try {

            // Send to Formspree.
            const response = await fetch(endpoint, {

                method: "POST",

                body: formData,

                headers: {
                    "Accept": "application/json"
                }

            });

            const responseData = await response
                .json()
                .catch(function () {
                    return {};
                });

            if (!response.ok) {

                const serverMessage = Array.isArray(
                    responseData.errors
                )
                    ? responseData.errors
                        .map(function (item) {
                            return item.message;
                        })
                        .filter(Boolean)
                        .join(" ")
                    : "";

                throw new Error(
                    serverMessage ||
                    "The submission was not accepted."
                );

            }

            // Save the success message.
            const successMessage =
                formType === "appointment"
                    ? "Your appointment request was submitted successfully. This is not a confirmed appointment."
                    : "Your message was submitted successfully. Thank you for contacting WanderLux.";

            // Reset native form fields while submitting.
            // The reset handler will preserve the status.
            form.reset();

            clearAllErrors();
            updateMinimumDate();

            showStatus(successMessage, "success");
            status.focus();

        } catch (error) {

            console.error(
                "WanderLux submission error:",
                error
            );

            showStatus(
                "Your message could not be submitted. Please check your connection or Formspree setup and try again.",
                "error"
            );

            status.focus();

        } finally {

            setLoadingState(false);

        }

    });


    // 15. RESET FORM

    form.addEventListener("reset", function () {

        // Preserve the success message when the form
        // automatically resets after submission.
        if (isSubmitting) {
            return;
        }

        window.requestAnimationFrame(function () {

            clearAllErrors();
            clearStatus();
            updateMinimumDate();

        });

    });

} // END OF setupForm()
