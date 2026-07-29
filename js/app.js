document.addEventListener("DOMContentLoaded", () => {
    /*
     * Hilfsfunktionen
     */
    const emailIsValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const uidIsValid = (uid) => {
        const normalizedUid = uid
            .toUpperCase()
            .replace(/[\s-]/g, "");

        /*
         * Vorläufige Formatprüfung:
         * Zwei Länderbuchstaben und danach
         * acht bis zwölf Buchstaben oder Zahlen.
         *
         * Eine echte UID-Prüfung über einen offiziellen
         * Dienst folgt später.
         */
        return /^[A-Z]{2}[A-Z0-9]{8,12}$/.test(normalizedUid);
    };

    const setFieldError = (input, message) => {
        input.classList.add("input-error");

        let errorElement = input
            .closest(".form-group")
            ?.querySelector(".form-error");

        if (!errorElement) {
            errorElement = document.createElement("p");
            errorElement.className = "form-error";

            input
                .closest(".form-group")
                ?.appendChild(errorElement);
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    };

    const clearFieldError = (input) => {
        input.classList.remove("input-error");

        const errorElement = input
            .closest(".form-group")
            ?.querySelector(".form-error");

        if (errorElement) {
            errorElement.textContent = "";
        }
    };

    /*
     * Login: Passwort anzeigen und verbergen
     */
    const loginPasswordInput =
        document.querySelector("#password");

    const loginPasswordToggle =
        document.querySelector(".password-toggle");

    if (loginPasswordInput && loginPasswordToggle) {
        loginPasswordToggle.addEventListener("click", () => {
            const passwordIsHidden =
                loginPasswordInput.type === "password";

            loginPasswordInput.type = passwordIsHidden
                ? "text"
                : "password";

            loginPasswordToggle.textContent =
                passwordIsHidden
                    ? "Verbergen"
                    : "Anzeigen";

            loginPasswordToggle.setAttribute(
                "aria-label",
                passwordIsHidden
                    ? "Passwort verbergen"
                    : "Passwort anzeigen"
            );
        });
    }

    /*
     * Login: Formularprüfung
     */
    const loginForm = document.querySelector("#login-form");

    if (loginForm) {
        const emailInput =
            loginForm.querySelector("#email");

        const passwordInput =
            loginForm.querySelector("#password");

        const emailError =
            loginForm.querySelector("#email-error");

        const passwordError =
            loginForm.querySelector("#password-error");

        const formStatus =
            loginForm.querySelector("#form-status");

        const loginButton =
            loginForm.querySelector("#login-button");

        const buttonText =
            loginForm.querySelector(".button-text");

        const clearLoginMessages = () => {
            emailError.textContent = "";
            passwordError.textContent = "";
            formStatus.textContent = "";

            emailInput.classList.remove("input-error");
            passwordInput.classList.remove("input-error");
        };

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            clearLoginMessages();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            let formIsValid = true;

            if (email === "") {
                emailError.textContent =
                    "Bitte gib deine E-Mail-Adresse ein.";

                emailInput.classList.add("input-error");
                formIsValid = false;
            } else if (!emailIsValid(email)) {
                emailError.textContent =
                    "Bitte gib eine gültige E-Mail-Adresse ein.";

                emailInput.classList.add("input-error");
                formIsValid = false;
            }

            if (password === "") {
                passwordError.textContent =
                    "Bitte gib dein Passwort ein.";

                passwordInput.classList.add("input-error");
                formIsValid = false;
            } else if (password.length < 8) {
                passwordError.textContent =
                    "Das Passwort muss mindestens 8 Zeichen haben.";

                passwordInput.classList.add("input-error");
                formIsValid = false;
            }

            if (!formIsValid) {
                formStatus.textContent =
                    "Bitte überprüfe deine Eingaben.";

                return;
            }

            loginButton.disabled = true;
            buttonText.textContent = "Anmeldung läuft...";

            formStatus.textContent =
                "Deine Eingaben werden geprüft.";

            window.setTimeout(() => {
    sessionStorage.setItem("nvLoggedIn", "true");
    window.location.href = "mission-control.html";
}, 2000);
        });
    }

    /*
     * Registrierung:
     * Privatkunde und Firmenkunde umschalten
     */
    const customerTypeInputs = document.querySelectorAll(
        'input[name="customerType"]'
    );

    const companyFields =
        document.querySelector("#company-fields");

    const companyRequiredFields = [
        document.querySelector("#company-name"),
        document.querySelector("#legal-form"),
        document.querySelector("#uid-number"),
        document.querySelector("#contact-role")
    ];

    if (customerTypeInputs.length > 0 && companyFields) {
        const updateCustomerType = () => {
            const selectedType = document.querySelector(
                'input[name="customerType"]:checked'
            );

            const isCompany =
                selectedType?.value === "company";

            companyFields.hidden = !isCompany;

            companyRequiredFields.forEach((field) => {
                if (!field) {
                    return;
                }

                field.required = isCompany;

                if (!isCompany) {
                    field.value = "";
                    clearFieldError(field);
                }
            });
        };

        customerTypeInputs.forEach((input) => {
            input.addEventListener(
                "change",
                updateCustomerType
            );
        });

        updateCustomerType();
    }

    /*
     * Registrierung:
     * Passwort-Schaltflächen automatisch ergänzen
     */
    const registerPasswordInputs = [
        document.querySelector("#register-password"),
        document.querySelector("#password-confirmation")
    ];

    registerPasswordInputs.forEach((input) => {
        if (!input || input.closest(".password-field")) {
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "password-field";

        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const toggleButton =
            document.createElement("button");

        toggleButton.className = "password-toggle";
        toggleButton.type = "button";
        toggleButton.textContent = "Anzeigen";
        toggleButton.setAttribute(
            "aria-label",
            "Passwort anzeigen"
        );

        wrapper.appendChild(toggleButton);

        toggleButton.addEventListener("click", () => {
            const passwordIsHidden =
                input.type === "password";

            input.type = passwordIsHidden
                ? "text"
                : "password";

            toggleButton.textContent =
                passwordIsHidden
                    ? "Verbergen"
                    : "Anzeigen";

            toggleButton.setAttribute(
                "aria-label",
                passwordIsHidden
                    ? "Passwort verbergen"
                    : "Passwort anzeigen"
            );
        });
    });

    /*
 * Registrierung:
 * Formular prüfen und Kontakt in Odoo anlegen
 */
const registerForm =
    document.querySelector("#register-form");

if (registerForm) {
    const REGISTER_API_URL =
        "https://neonversum-api.m-fehringer.workers.dev/register";

    const registerEmail =
        registerForm.querySelector("#register-email");

    const registerPassword =
        registerForm.querySelector("#register-password");

    const passwordConfirmation =
        registerForm.querySelector("#password-confirmation");

    const uidInput =
        registerForm.querySelector("#uid-number");

    const privacyCheckbox =
        registerForm.querySelector(
            'input[name="privacy"]'
        );

    const submitButton =
        registerForm.querySelector(
            'button[type="submit"]'
        );

    const statusElement =
        document.createElement("p");

    statusElement.className = "form-status";
    statusElement.setAttribute(
        "aria-live",
        "polite"
    );

    submitButton.parentNode.insertBefore(
        statusElement,
        submitButton
    );

    const originalButtonText =
        submitButton.textContent.trim();

    const clearRegistrationErrors = () => {
        registerForm
            .querySelectorAll(".input-error")
            .forEach((input) => {
                clearFieldError(input);
            });

        statusElement.textContent = "";
    };

    const resetSubmitButton = () => {
        submitButton.disabled = false;
        submitButton.textContent =
            originalButtonText;
    };

    registerForm
        .querySelectorAll("input")
        .forEach((input) => {
            input.addEventListener("input", () => {
                clearFieldError(input);
                statusElement.textContent = "";
            });

            input.addEventListener("change", () => {
                clearFieldError(input);
                statusElement.textContent = "";
            });
        });

    registerForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            if (submitButton.disabled) {
                return;
            }

            clearRegistrationErrors();

            let formIsValid = true;
            let firstInvalidField = null;

            const currentlyRequiredInputs =
                registerForm.querySelectorAll(
                    "input[required]"
                );

            currentlyRequiredInputs.forEach((input) => {
                if (
                    input.type !== "checkbox" &&
                    input.value.trim() === ""
                ) {
                    setFieldError(
                        input,
                        "Dieses Feld ist erforderlich."
                    );

                    formIsValid = false;

                    if (!firstInvalidField) {
                        firstInvalidField = input;
                    }
                }
            });

            const email =
                registerEmail.value
                    .trim()
                    .toLowerCase();

            if (
                email !== "" &&
                !emailIsValid(email)
            ) {
                setFieldError(
                    registerEmail,
                    "Bitte gib eine gültige E-Mail-Adresse ein."
                );

                formIsValid = false;
                firstInvalidField ??= registerEmail;
            }

            if (
                registerPassword.value !== "" &&
                registerPassword.value.length < 8
            ) {
                setFieldError(
                    registerPassword,
                    "Das Passwort muss mindestens 8 Zeichen haben."
                );

                formIsValid = false;
                firstInvalidField ??= registerPassword;
            }

            if (
                passwordConfirmation.value !== "" &&
                registerPassword.value !==
                    passwordConfirmation.value
            ) {
                setFieldError(
                    passwordConfirmation,
                    "Die Passwörter stimmen nicht überein."
                );

                formIsValid = false;
                firstInvalidField ??=
                    passwordConfirmation;
            }

            const selectedCustomerType =
                registerForm.querySelector(
                    'input[name="customerType"]:checked'
                );

            const customerType =
                selectedCustomerType?.value ===
                "company"
                    ? "company"
                    : "private";

            const isCompany =
                customerType === "company";

            if (
                isCompany &&
                uidInput.value.trim() !== "" &&
                !uidIsValid(uidInput.value)
            ) {
                setFieldError(
                    uidInput,
                    "Bitte prüfe das Format der UID-Nummer."
                );

                formIsValid = false;
                firstInvalidField ??= uidInput;
            }

            if (!privacyCheckbox.checked) {
                statusElement.textContent =
                    "Bitte akzeptiere die Datenschutzbestimmungen und Nutzungsbedingungen.";

                formIsValid = false;

                if (!firstInvalidField) {
                    firstInvalidField =
                        privacyCheckbox;
                }
            }

            if (!formIsValid) {
                if (
                    statusElement.textContent === ""
                ) {
                    statusElement.textContent =
                        "Bitte überprüfe die markierten Felder.";
                }

                firstInvalidField?.focus();
                return;
            }

            const firstName =
                registerForm
                    .querySelector("#first-name")
                    .value
                    .trim();

            const lastName =
                registerForm
                    .querySelector("#last-name")
                    .value
                    .trim();

            const phone =
                registerForm
                    .querySelector("#phone")
                    .value
                    .trim();

            const street =
                registerForm
                    .querySelector("#street")
                    .value
                    .trim();

            const zip =
                registerForm
                    .querySelector("#postal-code")
                    .value
                    .trim();

            const city =
                registerForm
                    .querySelector("#city")
                    .value
                    .trim();

            const companyName =
                registerForm
                    .querySelector("#company-name")
                    ?.value
                    .trim() || "";

            const vat =
                uidInput?.value.trim() || "";

            const registrationData = {
                name: `${firstName} ${lastName}`.trim(),
                email,
                phone,
                street,
                zip,
                city,
                customerType,
                companyName,
                vat
            };

            submitButton.disabled = true;
            submitButton.textContent =
                "Registrierung wird gespeichert...";

            statusElement.textContent =
                "Deine Daten werden sicher an NeonVersum übermittelt.";

            try {
                const response = await fetch(
                    REGISTER_API_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(
                            registrationData
                        )
                    }
                );

                let result;

                try {
                    result = await response.json();
                } catch {
                    throw new Error(
                        "Die Antwort des Servers konnte nicht verarbeitet werden."
                    );
                }

                if (!response.ok) {
                    if (
                        response.status === 409 ||
                        result.code === "EMAIL_EXISTS"
                    ) {
                        setFieldError(
                            registerEmail,
                            result.message ||
                                "Für diese E-Mail-Adresse existiert bereits ein Benutzer."
                        );

                        registerEmail.focus();

                        throw new Error(
                            result.message ||
                                "Diese E-Mail-Adresse ist bereits registriert."
                        );
                    }

                    throw new Error(
                        result.message ||
                            "Die Registrierung konnte nicht gespeichert werden."
                    );
                }

                sessionStorage.setItem(
                    "nvUserName",
                    firstName
                );

                sessionStorage.setItem(
                    "nvRegisteredEmail",
                    email
                );

                statusElement.textContent =
                    "Registrierung erfolgreich. Dein Kontakt wurde in Odoo angelegt.";

                submitButton.textContent =
                    "Registrierung erfolgreich";

                window.setTimeout(() => {
                    window.location.href =
                        "login.html";
                }, 1500);
            } catch (error) {
                console.error(
                    "Registrierungsfehler:",
                    error
                );

                if (
                    statusElement.textContent === "" ||
                    !statusElement.textContent.includes(
                        "existiert bereits"
                    )
                ) {
                    statusElement.textContent =
                        error.message ||
                        "Die Registrierung ist momentan nicht möglich. Bitte versuche es erneut.";
                }

                resetSubmitButton();
            }
        }
    );
}
        });

        registerForm.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                statusElement.textContent = "";

                registerForm
                    .querySelectorAll(".input-error")
                    .forEach((input) => {
                        clearFieldError(input);
                    });

                let formIsValid = true;
                let firstInvalidField = null;

                const currentlyRequiredInputs =
                    registerForm.querySelectorAll(
                        "input[required]"
                    );

                currentlyRequiredInputs.forEach((input) => {
                    if (
                        input.type !== "checkbox" &&
                        input.value.trim() === ""
                    ) {
                        setFieldError(
                            input,
                            "Dieses Feld ist erforderlich."
                        );

                        formIsValid = false;

                        if (!firstInvalidField) {
                            firstInvalidField = input;
                        }
                    }
                });

                if (
                    registerEmail.value.trim() !== "" &&
                    !emailIsValid(
                        registerEmail.value.trim()
                    )
                ) {
                    setFieldError(
                        registerEmail,
                        "Bitte gib eine gültige E-Mail-Adresse ein."
                    );

                    formIsValid = false;
                    firstInvalidField ??= registerEmail;
                }

                if (
                    registerPassword.value !== "" &&
                    registerPassword.value.length < 8
                ) {
                    setFieldError(
                        registerPassword,
                        "Das Passwort muss mindestens 8 Zeichen haben."
                    );

                    formIsValid = false;
                    firstInvalidField ??= registerPassword;
                }

                if (
                    passwordConfirmation.value !== "" &&
                    registerPassword.value !==
                        passwordConfirmation.value
                ) {
                    setFieldError(
                        passwordConfirmation,
                        "Die Passwörter stimmen nicht überein."
                    );

                    formIsValid = false;
                    firstInvalidField ??=
                        passwordConfirmation;
                }

                const selectedCustomerType =
                    registerForm.querySelector(
                        'input[name="customerType"]:checked'
                    );

                const isCompany =
                    selectedCustomerType?.value ===
                    "company";

                if (
                    isCompany &&
                    uidInput.value.trim() !== "" &&
                    !uidIsValid(uidInput.value)
                ) {
                    setFieldError(
                        uidInput,
                        "Bitte prüfe das Format der UID-Nummer."
                    );

                    formIsValid = false;
                    firstInvalidField ??= uidInput;
                }

                if (!privacyCheckbox.checked) {
                    statusElement.textContent =
                        "Bitte akzeptiere die Datenschutzbestimmungen und Nutzungsbedingungen.";

                    formIsValid = false;

                    if (!firstInvalidField) {
                        firstInvalidField =
                            privacyCheckbox;
                    }
                }

                if (!formIsValid) {
                    if (
                        statusElement.textContent === ""
                    ) {
                        statusElement.textContent =
                            "Bitte überprüfe die markierten Felder.";
                    }

                    firstInvalidField?.focus();
                    return;
                }

                submitButton.disabled = true;
                submitButton.textContent =
                    "Registrierung wird geprüft...";

                statusElement.textContent =
                    "Deine Angaben werden vorbereitet.";

               window.setTimeout(() => {
    const firstNameInput =
        registerForm.querySelector("#first-name");

    sessionStorage.setItem(
        "nvUserName",
        firstNameInput.value.trim()
    );

    window.location.href = "login.html";
}, 2000);
            }
        );
    }
});
