// Show date in spanish format
function showCurrentDate() {
    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const currentDate = new Date();
    const weekDay = weekDays[currentDate.getDay()];
    const day = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    
    const formattedDate = `${weekDay}, ${day.toString().padStart(2, '0')} de ${month} de ${year}`;
    
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
}

// Execute the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', showCurrentDate);
