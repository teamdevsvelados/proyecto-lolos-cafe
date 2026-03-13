const API_URL = "http://localhost:8080/api/v1/users/new-user";

document.getElementById('registration-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const name = document.getElementById('name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    const userData = {
        nameOf: `${name} ${lastName}`,
        email: email,
        password: password,
        available: true
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const newUser = await response.json();
            alert(`¡Registro exitoso! Bienvenido ${newUser.nameOf}`);
            window.location.href = "/login/login.html"; // Redirigir al login
        } else if (response.status === 409) {
            alert("Error: El correo electrónico ya está registrado en Lolo's Café.");
        } else {
            alert("Error en el servidor. Inténtalo más tarde.");
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor. Verifica que tu Backend esté corriendo.");
    }
});