document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.querySelector("#password");
    const passwordToggle = document.querySelector(".password-toggle");

    if (!passwordInput || !passwordToggle) {
        return;
    }

    passwordToggle.addEventListener("click", () => {
        const passwordIsHidden = passwordInput.type === "password";

        passwordInput.type = passwordIsHidden ? "text" : "password";
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
});
