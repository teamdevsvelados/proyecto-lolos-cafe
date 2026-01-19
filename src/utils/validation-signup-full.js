// Regular expressions
const expRegName = /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/;
const expRegLastName = /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/;
const expRegEmail = /^\w+([.-]\w+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z]{2,63})+$/;
const expRegPhone = /^[0-9]{10}$/;

// Form elements
const form = document.querySelector('form[name="registration-form-complete"]');
const username = document.getElementById('name');
const lastName = document.getElementById('last-name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const birthdate = document.getElementById('birthdate');
const genre = document.getElementById('gender');

// Autocomplete with data from first form
document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('userData');
    const dataType = localStorage.getItem('dataType');
    
    if (storedData && dataType) {
        if (dataType === 'email' && email) {
            email.value = storedData;
            console.log("Autocompleted email:", storedData);
        } else if (dataType === 'phone' && phone) {
            phone.value = storedData;
            console.log("Autocompleted phone:", storedData);
        }
    }
});

// Complete form validation
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Name validation
    if (!username.value.trim()) {
        alert("Campo nombre es requerido");
        username.focus();
        return false;
    }
    if (!expRegName.test(username.value)) {
        alert("Campo nombre acepta letras y espacios únicamente");
        username.focus();
        return false;
    }
    
    // Last name validation
    if (!lastName.value.trim()) {
        alert("Campo apellido es requerido");
        lastName.focus();
        return false;
    }
    if (!expRegLastName.test(lastName.value)) {
        alert("Campo apellido acepta letras y números únicamente");
        lastName.focus();
        return false;
    }
    
    // Contact validation
    const isEmailValid = expRegEmail.test(email.value);
    const isPhoneValid = expRegPhone.test(phone.value);
    
    if (!isEmailValid && !isPhoneValid) {
        alert("Por favor indique un número o correo válido");
        !email.value ? email.focus() : phone.focus();
        return false;
    }
    
    if (email.value && phone.value) {
        if (!isEmailValid || !isPhoneValid) {
            alert("Uno de los campos de contacto no es válido");
            !isEmailValid ? email.focus() : phone.focus();
            return false;
        }
    }
    
    // Date validation
    if (!birthdate.value) {
        alert("El campo cumpleaños es requerido");
        birthdate.focus();
        return false;
    }
    
    // Gender validation
    if (!genre.value) {
        alert("Campo género es requerido");
        genre.focus();
        return false;
    }
    
    // Privacy checkbox validation
    const privacyCheckbox = document.getElementById('privacy');
    if (!privacyCheckbox.checked) {
        alert("Debes aceptar el aviso de privacidad.");
        privacyCheckbox.focus();
        return false;
    }
    
    // If everything is valid
    alert("¡Registro exitoso y enviado!.");
    
    // Clear localStorage after success
    localStorage.removeItem('userData');
    localStorage.removeItem('dataType');
    localStorage.removeItem('password');
    
    // Submit form to Formspree
    this.submit();
    
    return true;
});