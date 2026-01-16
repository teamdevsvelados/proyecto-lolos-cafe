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
        alert("Name field is required");
        username.focus();
        return false;
    }
    if (!expRegName.test(username.value)) {
        alert("Name field accepts letters and spaces only.");
        username.focus();
        return false;
    }
    
    // Last name validation
    if (!lastName.value.trim()) {
        alert("Last name field is required");
        lastName.focus();
        return false;
    }
    if (!expRegLastName.test(lastName.value)) {
        alert("Last name field accepts letters and spaces only.");
        lastName.focus();
        return false;
    }
    
    // Contact validation
    const isEmailValid = expRegEmail.test(email.value);
    const isPhoneValid = expRegPhone.test(phone.value);
    
    if (!isEmailValid && !isPhoneValid) {
        alert("Please provide a valid email address or phone number.");
        !email.value ? email.focus() : phone.focus();
        return false;
    }
    
    if (email.value && phone.value) {
        if (!isEmailValid || !isPhoneValid) {
            alert("One of the contact fields is not valid.");
            !isEmailValid ? email.focus() : phone.focus();
            return false;
        }
    }
    
    // Date validation
    if (!birthdate.value) {
        alert("Date of birth is required");
        birthdate.focus();
        return false;
    }
    
    // Gender validation
    if (!genre.value) {
        alert("Gender field is required");
        genre.focus();
        return false;
    }
    
    // Privacy checkbox validation
    const privacyCheckbox = document.getElementById('privacy');
    if (!privacyCheckbox.checked) {
        alert("You must accept the privacy notice");
        privacyCheckbox.focus();
        return false;
    }
    
    // If everything is valid
    alert("Registration successful and submitted!");
    
    // Clear localStorage after success
    localStorage.removeItem('userData');
    localStorage.removeItem('dataType');
    localStorage.removeItem('password');
    
    // Submit form to Formspree
    this.submit();
    
    return true;
});