const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const submitBtn = document.getElementById("submit-btn")

const getUsers = () => JSON.parse(localStorage.getItem("users")) || []

const saveUsers = users => {
    localStorage.setItem("users", JSON.stringify(users))
}

submitBtn.addEventListener("click", e => {
    e.preventDefault()
    
    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    if (!email || !password) return

    const users = getUsers()
    const existingUser = users.find(user => user.email === email)

    if (existingUser) {
        if (existingUser.password === password) {
            alert("Inicio de sesión exitoso")
        } else {
            alert("Contraseña incorrecta")
        }
    } else {
        users.push({ email, password })
        saveUsers(users)
        alert("Usuario registrado correctamente")
    }

    emailInput.value = ""
    passwordInput.value = ""
})
