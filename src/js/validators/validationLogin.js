const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const submitBtn = document.getElementById("submit-btn")

passwordInput.disabled = true

emailInput.addEventListener("input", () => {
    const emailValue = emailInput.value
    const isValidEmail = emailValue.includes("@") && emailValue.includes(".")

    if (isValidEmail) {
        passwordInput.disabled = false
        emailInput.classList.remove("is-invalid")
        emailInput.classList.add("is-valid")
    } else {
        passwordInput.disabled = true
        passwordInput.value = ""
        emailInput.classList.add("is-invalid")
        emailInput.classList.remove("is-valid")
    }
})

passwordInput.addEventListener("input", () => {
    const passwordValue = passwordInput.value
    const isValidPassword =
        passwordValue.length >= 8 &&
        /[0-9]/.test(passwordValue) &&
        /[^a-zA-Z0-9]/.test(passwordValue)

    if (isValidPassword) {
        passwordInput.classList.add("is-valid")
        passwordInput.classList.remove("is-invalid")
    } else {
        passwordInput.classList.add("is-invalid")
        passwordInput.classList.remove("is-valid")
    }
})
