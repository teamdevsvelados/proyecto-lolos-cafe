const expRegEmail = /^\w+([.-]\w+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z]{2,63})+$/;
const expRegPhone = /^[0-9]{10}$/;
const expRegPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 1 letter and 1 number, with minimum 8 characters

const input = document.getElementById('phone-email');
const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeat-password');
const privacyCheckbox = document.getElementById('privacy');

// Real-time validation for main input
input.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    const isEmail = expRegEmail.test(value);
    const isPhone = expRegPhone.test(value);
    
    if (isEmail || isPhone) input.style.borderColor = isEmail ? 'blue' : 'green';
});

// Initial form validation when clicking "COMPLETE YOUR REGISTRATION"
document.querySelector('.btn-submit').addEventListener('click', function(e) {

    e.preventDefault();
    
    const value = input.value.trim();
    const isEmail = expRegEmail.test(value);
    const isPhone = expRegPhone.test(value);
    const passwordValue = password.value;
    
    // Validate email or phone
    if (!isEmail && !isPhone) {
        alert("Por favor ingresa un email o número de teléfono válido");
        input.focus();
        return false;
    }
    
    // Validate password length
    if (passwordValue.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres");
        password.focus();
        return false;
    }
    
    // Validate that password contains only letters and numbers
    if (!/^[A-Za-z0-9]+$/.test(passwordValue)) {
        alert("La contraseña sólo pueden contener letras y números");
        password.focus();
        return false;
    }
    
    // Validate that password contains at least one letter
    if (!/[A-Za-z]/.test(passwordValue)) {
        alert("La contraseña debe contener al menos una letra");
        password.focus();
        return false;
    }
    
    // Validate that password contains at least one number
    if (!/\d/.test(passwordValue)) {
        alert("La contraseña debe contener al menos un número");
        password.focus();
        return false;
    }
    
    // Validate password match
    if (password.value !== repeatPassword.value) {
        alert("Las contraseñas no coinciden");
        repeatPassword.focus();
        return false;
    }

    // Validate privacy checkbox
    if (!privacyCheckbox.checked) {
        alert("Debes aceptar el aviso de privacidad");
        privacyCheckbox.focus();
        return false;
    }
    
    // Save data for next form
    localStorage.setItem('userData', value);
    localStorage.setItem('dataType', isEmail ? 'email' : 'phone');
    localStorage.setItem('password', password.value); // Save password if needed
    
    console.log("Data saved for complete form");
    
    // Redirect to complete form
    window.location.href = "./signup/details.html";
    
    return true;
});