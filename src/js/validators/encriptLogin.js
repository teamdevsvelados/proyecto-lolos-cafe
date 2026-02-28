const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const submitBtn = document.getElementById("submit-btn")
const feedbackMessage = document.querySelector('#message')
// ---
// Last ip for deployment
// ---
// const url = 'http://3.132.214.155:8080/api/v1/users/'
// ---
// Current url for testing
// ---
const url = 'http://localhost:8080/api/v1/users' 

const getUsers = async () => {
    try {
        const response = await fetch(url)

        if(!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)        
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Fetch error: ', error)
    }
}

const saveUserSession = user => localStorage.setItem("userSession", JSON.stringify(user))

const userLoggedIn = localStorage.getItem('userSession')

const hashPassword = async password => {
    const data = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    return [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}
// const registerUser = async (user) => {
//     try {
//         const response = await fetch(url+'/new-user', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(user),
//         });

//         if(!response.ok) {
//             throw new Error(`HTTP error: ${response.status}`)        
//         }

//         return await response.json()
//     } catch (error) {
//         console.error('Fetch error: ', error)
//     }
// }


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
    
    const users = await getUsers()
    const userExists = users.find(user => user.email === email)
    const hashedPassword = await hashPassword(password)
    
    // Object for user session
    const user = {
        nameOf: 'Antonio',
        email,
        password: hashedPassword,
        available: true,
        role: userExists.role ? userExists.role : 'Admin' 
    }

    if (userExists) {
        if (userExists.password === hashedPassword) {
            saveUserSession(user)
            if(userExists.role && userExists.role === 'Admin') {
                window.location.href = "/ui/menu.html"
            } else {
                window.location.href = "/ui/account.html"
            }
        } else {
            feedbackMessage.textContent = 'Contraseña incorrecta, inténtalo nuevamente'
            setTimeout(() => {
                feedbackMessage.textContent = ''
            }, 3000);
        }
    } else {
        // Functions to register users without form
        // const registeredUser = await registerUser(user)
        // console.log(registeredUser)
        feedbackMessage.textContent = 'El email ingresado aún no tiene una cuenta asociada'
        setTimeout(() => {
            feedbackMessage.textContent = ''
        }, 3000);
    }

    // emailInput.value = ""
    // passwordInput.value = ""
})

if(userLoggedIn) {
    if(userLoggedIn.role === 'Admin') {
        window.location.href = "/admin/dashboard.html"
    } else {
        window.location.href = "/ui/account.html"
    }
} else {
    window.location.href = '/'
}
