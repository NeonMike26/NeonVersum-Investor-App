document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.querySelector("#password");
    const passwordToggle = document.querySelector(".password-toggle");

    const loginForm = document.querySelector("#login-form");
    const emailInput = document.querySelector("#email");

    const emailError = document.querySelector("#email-error");
    const passwordError = document.querySelector("#password-error");
    const formStatus = document.querySelector("#form-status");

    const loginButton = document.querySelector("#login-button");
    const buttonText = document.querySelector(".button-text");

    /*
     * Passwort anzeigen und verbergen
     */
    if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener("click", () => {
            const passwordIsHidden =
                passwordInput.type === "password";

            passwordInput.type = passwordIsHidden
                ? "text"
                : "password";

            passwordToggle.textContent = passwordIsHidden
                ? "Verbergen"
                : "Anzeigen";

            passwordToggle.setAttribute(
                "aria-label",
                passwordIsHidden
                    ? "Passwort verbergen"
                    : "Passwort anzeigen"
            );
        });
    }

    /*
     * Falls wir nicht auf der Login-Seite sind,
     * wird der restliche Code nicht ausgeführt.
     */
    if (
        !loginForm ||
        !emailInput ||
        !passwordInput ||
        !emailError ||
        !passwordError ||
        !formStatus ||
        !loginButton ||
        !buttonText
    ) {
        return;
    }

    /*
     * Prüft, ob eine E-Mail-Adresse
     * ein grundsätzlich gültiges Format hat.
     */
    const emailIsValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    /*
     * Entfernt alle bisherigen Meldungen.
     */
    const clearMessages = () => {
        emailError.textContent = "";
        passwordError.textContent = "";
        formStatus.textContent = "";

        emailInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");
    };

    /*
     * Formular absenden
     */
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        clearMessages();

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

        /*
         * Nur eine vorläufige Demonstration.
         * Noch keine echte Anmeldung.
         */
        window.setTimeout(() => {
            formStatus.textContent =
                "Test erfolgreich. Die echte Anmeldung folgt später.";

            buttonText.textContent = "Sicher anmelden";
            loginButton.disabled = false;
        }, 2000);
    });
    /*
 * Registrierung:
 * Privatkunde und Firmenkunde umschalten
 */
const customerTypeInputs = document.querySelectorAll(
    'input[name="customerType"]'
);

const companyFields = document.querySelector("#company-fields");

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

        const isCompany = selectedType?.value === "company";

        companyFields.hidden = !isCompany;

        companyRequiredFields.forEach((field) => {
            if (!field) {
                return;
            }

            field.required = isCompany;

            if (!isCompany) {
                field.value = "";
            }
        });
    };

    customerTypeInputs.forEach((input) => {
        input.addEventListener("change", updateCustomerType);
    });

    updateCustomerType();
}
});
