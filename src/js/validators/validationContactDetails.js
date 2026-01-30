// ==============================
// REGULAR EXPRESSIONS
// ==============================
const expRegName = /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/;
const expRegLastName = /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/;
const expRegEmail = /^\w+([.-]\w+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z]{2,63})+$/;
const expRegPhone = /^[0-9]{10}$/;
const expRegPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 1 letter and 1 number, with minimum 8 characters

// ==============================
// DOM READY
// ==============================
document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector('form[name="registration-form-complete"]');
    if (!form) return;

    // Inputs
    const nameInput = document.getElementById("name");
    const lastNameInput = document.getElementById("last-name");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const birthdateInput = document.getElementById("birthdate");
    const genderSelect = document.getElementById("gender");
    const privacyCheckbox = document.getElementById("privacy");

    // ==============================
    // BOOTSTRAP HELPERS
    // ==============================
    function setValid(input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    }

    function setInvalid(input) {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
    }

    function resetValidation(input) {
        input.classList.remove("is-valid", "is-invalid");
    }

    function clearAllValidation() {
        document
            .querySelectorAll(".is-valid, .is-invalid")
            .forEach(el => el.classList.remove("is-valid", "is-invalid"));
    }

    // ==============================
    // SUBMIT VALIDATION
    // ==============================
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearAllValidation();

        // Nombre
        if (!nameInput.value.trim() || !expRegName.test(nameInput.value.trim())) {
            setInvalid(nameInput);
            nameInput.focus();
            return;
        }
        setValid(nameInput);

        // Apellido
        if (!lastNameInput.value.trim() || !expRegLastName.test(lastNameInput.value.trim())) {
            setInvalid(lastNameInput);
            lastNameInput.focus();
            return;
        }
        setValid(lastNameInput);

        // Teléfono
        if (!expRegPhone.test(phoneInput.value.trim())) {
            setInvalid(phoneInput);
            phoneInput.focus();
            return;
        }
        setValid(phoneInput);

        // Email
        if (!expRegEmail.test(emailInput.value.trim())) {
            setInvalid(emailInput);
            emailInput.focus();
            return;
        }
        setValid(emailInput);

        // Contraseña
        if (!expRegPassword.test(passwordInput.value)) {
            alert("La contraseña debe tener mínimo 8 caracteres y solo letras y números");
            setInvalid(passwordInput);
            passwordInput.focus();
            return;
        }
        setValid(passwordInput);

        // Confirmar contraseña
        if (passwordInput.value !== confirmPasswordInput.value) {
            setInvalid(confirmPasswordInput);
            confirmPasswordInput.focus();
            return;
        }
        setValid(confirmPasswordInput);

        // Fecha nacimiento
        if (!birthdateInput.value) {
            setInvalid(birthdateInput);
            birthdateInput.focus();
            return;
        }

        const birthDate = new Date(birthdateInput.value);
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

        if (birthDate > minAgeDate) {
            alert("Debes tener al menos 18 años");
            setInvalid(birthdateInput);
            birthdateInput.focus();
            return;
        }
        setValid(birthdateInput);

        // Género
        if (!genderSelect.value) {
            setInvalid(genderSelect);
            genderSelect.focus();
            return;
        }
        setValid(genderSelect);

        // Aviso de privacidad
        if (!privacyCheckbox.checked) {
            setInvalid(privacyCheckbox);
            privacyCheckbox.focus();
            return;
        }
        setValid(privacyCheckbox);

        // Todo correcto
        alert("¡Registro exitoso!");
        form.submit();
    });

    // ==============================
    // REAL-TIME VALIDATION
    // ==============================
    const liveFields = [
        { el: nameInput, regex: expRegName },
        { el: lastNameInput, regex: expRegLastName },
        { el: phoneInput, regex: expRegPhone },
        { el: emailInput, regex: expRegEmail }
    ];

    liveFields.forEach(({ el, regex }) => {
        if (!el) return;
        el.addEventListener("input", () => {
            if (!el.value.trim()) {
                resetValidation(el);
                return;
            }
            regex.test(el.value.trim()) ? setValid(el) : setInvalid(el);
        });
    });

    // Password live validation
    passwordInput.addEventListener("input", () => {
        if (!passwordInput.value) {
            resetValidation(passwordInput);
            return;
        }
        expRegPassword.test(passwordInput.value)
            ? setValid(passwordInput)
            : setInvalid(passwordInput);
    });

    confirmPasswordInput.addEventListener("input", () => {
        if (!confirmPasswordInput.value) {
            resetValidation(confirmPasswordInput);
            return;
        }
        (passwordInput.value === confirmPasswordInput.value &&
         expRegPassword.test(passwordInput.value))
            ? setValid(confirmPasswordInput)
            : setInvalid(confirmPasswordInput);
    });

});
