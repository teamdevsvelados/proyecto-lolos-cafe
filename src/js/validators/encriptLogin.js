const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const submitBtn = document.getElementById("submit-btn")

const getUsers = () => JSON.parse(localStorage.getItem("users")) || []
const saveUsers = users => localStorage.setItem("users", JSON.stringify(users))

const hashPassword = async password => {
    const data = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    return [...new Uint8Array(hashBuffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
}

submitBtn.addEventListener("click", async e => {
    e.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    if (!email || !password) return

    const users = getUsers()
    const hashedPassword = await hashPassword(password)
    const user = users.find(u => u.email === email)

    if (user) {
        if (user.password === hashedPassword) {
            alert("Login correcto")
        } else {
            alert("Contraseña incorrecta")
        }
    } else {
        users.push({ email, password: hashedPassword })
        saveUsers(users)
        alert("Usuario registrado")
    }

    emailInput.value = ""
    passwordInput.value = ""
})
