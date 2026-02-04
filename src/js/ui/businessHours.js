document.addEventListener("DOMContentLoaded", function () {
    const businessHoursContainer = document.getElementById("businessHours");

    const businessHoursData = [
        { day: "Lunes", hours: "11:00 - 21:00" },
        { day: "Martes", hours: false },
        { day: "Miércoles", hours: "11:00 - 21:00" },
        { day: "Jueves", hours: "11:00 - 21:00" },
        { day: "Viernes", hours: "11:00 - 21:00" },
        { day: "Sábado", hours: "11:00 - 21:00" },
        { day: "Domingo", hours: "11:00 - 21:00" },
    ];

    const todayIndex = (new Date().getDay() + 6) % 7;

    let htmlContent = "";

    businessHoursData.forEach((item, index) => {
        const isToday = index === todayIndex;
        const activeClass = isToday ? "active-day rounded-0 shadow-sm" : "";
        const displayHours = item.hours
            ? item.hours
            : '<span class="text-muted fw-light">Cerrado</span>';

        htmlContent += `
            <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-3 py-2 ${activeClass}">
                <span class="fw-medium">${item.day} ${isToday ? '<small class="ms-1">(Hoy)</small>' : ""}</span>
                <span>${displayHours}</span>
            </li>
        `;
    });

    businessHoursContainer.innerHTML = htmlContent;
});
