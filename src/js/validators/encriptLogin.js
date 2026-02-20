const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const submitBtn = document.getElementById("submit-btn")
const url = 'http://localhost:3000/api/v1/users/'
const feedbackMessage = document.querySelector('#message')

const getUsers = () => JSON.parse(localStorage.getItem("users")) || []
// const getUsersApi = async () => {
//     try {
//         const response = await fetch(url)

//         if(!response.ok) {
//             throw new Error(`HTTP error: ${response.status}`)        
//         }

//         const data = await response.json()
//          console.log(data)
//     } catch (error) {
//         console.error('Fetch error: ', error)
//     }
// }

const saveUsers = users => localStorage.setItem("users", JSON.stringify(users))
// const saveUsersApi = async () => {
//     try {
//         const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(newPost),
        // });

//         if(!response.ok) {
//             throw new Error(`HTTP error: ${response.status}`)        
//         }

//         return response.json()
//     } catch (error) {
//         console.error('Fetch error: ', error)
//     }
// }

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
    
    if (email === '' || password === '') {
        feedbackMessage.textContent = 'El email y contraseña son requeridos'
        setTimeout(() => {
            feedbackMessage.textContent = ''
        }, 3000);
        return
    }

    const users = getUsers()
    // const users = getUsersApi()
    const userExists = users.find(user => user.email === email)
    const hashedPassword = await hashPassword(password)

    if (userExists) {
        if (userExists.password === hashedPassword) {
            window.location.href = "/menu.html"
        } else {
            feedbackMessage.textContent = 'Contraseña incorrecta, inténtalo nuevamente'
            setTimeout(() => {
                feedbackMessage.textContent = ''
            }, 3000);
        }
    } else {
        feedbackMessage.textContent = 'El email ingresado aún no tiene una cuenta asociada'
        setTimeout(() => {
            feedbackMessage.textContent = ''
        }, 3000);
    }

    // emailInput.value = ""
    // passwordInput.value = ""
})
