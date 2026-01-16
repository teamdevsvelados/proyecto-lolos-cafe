const expRegName=/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/;                                                       //validation regex for name
const expRegLastName=/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/;                                                   //validation regex for last name
const expRegEmail =/^\w+([.-]\w+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z]{2,63})+$/;  //validation characters
const expRegPhone = /^[0-9]{10}$/;

//later this expression would be eliminated for use libphonenumber.js

//daf-universitpower.3342@intel.com
//domains could have 63 characters and minimum 2
//just it can only contain numbers, letters and hyphens (-) but can't begin or end with it.

const input = document.getElementById('phone-email'); //for register simple

const username = document.getElementById("name");
const lastName = document.getElementById("last-name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const birthdate = document.getElementById("birthdate");
const genre = document.getElementById("genre");

input.addEventListener('input', (e) => {
    const value = e.target.value.trim(); // .trim() removes accidental spaces at the beginning/end
    
    //Check that it meets the conditions according to the regular expressions. 
    const isEmail = expRegEmail.test(value);
    const isPhone = expRegPhone.test(value);

    if (isEmail || isPhone) {
        // Store the value in localStorage with label 'userData'
        localStorage.setItem('userData', value);
        
        // Save the data type 
        localStorage.setItem('dataType', isEmail ? 'email' : 'phone');
        
        // If dataType is email set the color blue otherwise green
        input.style.borderColor = isEmail ? 'blue' : 'green'
        
        console.log("Data saved, ready for the next view");
    }
});

//Autocomplete form with the previus data.
document.addEventListener('DOMContentLoaded', () => {
    const storedData = localStorage.getItem('userData');
    const dataType = localStorage.getItem('dataType');

    if (storedData && dataType) {
        // Use the retrieved 'dataType' to determine which ID to place the value in.
        const destinationField = document.getElementById(dataType); 
        
        if (destinationField) {
            destinationField.value = storedData;
            console.log(`Autocompletado el campo: ${dataType}`);
        }
    }
});

//Form Complete
registrationFormComplete.addEventListener("submit", function (event) {

    const { username, lastName, phone, email,  birthdate, genre} = registrationFormComplete.elements;

    // --- VALIDACIÓN DE NOMBRE ---
    if (!username.value.trim()) {
        alert("El campo nombre es requerido");
        username.focus();
        return false;
    }
    if (!expRegName.test(username.value)) {
        alert("El campo nombre admite letras y espacios.");
        username.focus();
        return false;
    }

    // --- VALIDACIÓN DE APELLIDOS ---
    if (!lastName.value.trim()) {
        alert("El campo apellidos es requerido");
        lastName.focus();
        return false;
    }
    if (!expRegLastName.test(lastName.value)) {
        alert("El campo apellidos admite letras y espacios.");
        lastName.focus();
        return false;
    }

    // --- VALIDACIÓN DE CONTACTO (Lógica adaptada) ---
    // Verificamos que al menos uno de los dos campos tenga un formato válido
    const isEmailValid = expRegEmail.test(email.value);
    const isPhoneValid = expRegPhone.test(phone.value);

    if (!isEmailValid && !isPhoneValid) {
        alert("Debe proporcionar un correo electrónico o un teléfono válido.");
        // Devolvemos el foco al que esté vacío
        !email.value ? email.focus() : phone.focus();
        return false;
    }

    // --- VALIDACIÓN DE FECHA ---
    if (!birthdate.value) {
        alert("La fecha de nacimiento es requerida");
        birthdate.focus();
        return false;
    }

    // --- VALIDACIÓN DE GÉNERO ---
    if (!genre.value) {
        alert("El campo género es requerido");
        genre.focus();
        return false;
    }

    alert("¡Registro correcto y enviado!");

    return true;
});
