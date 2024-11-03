export function createStatusElement() {
    const statusElement = document.createElement('p');
    statusElement.id = 'status';
    return statusElement;
}

export function updateStatus(companyData) {
    const statusElement = document.getElementById('status');
    const now = new Date();
    const currentDay = now.toLocaleString('es-ES', { weekday: 'long' });
    const currentTime = now.toTimeString().slice(0, 5); // Formato HH:MM

    if (!companyData.horarios) {
        statusElement.textContent = 'no companyData.horarios';
        statusElement.className = 'closed';
        return;
    }

    const horario = companyData.horarios.find(h => h.day.toLowerCase() === currentDay.toLowerCase());

    if (!horario) {
        statusElement.textContent = 'Horario no disponible';
        statusElement.className = 'closed';
        return;
    }

    const [openTime, closeTime] = horario.hours.split(' - ');

    if (currentTime >= openTime && currentTime <= closeTime) {
        statusElement.textContent = `Abierto hasta las ${closeTime}`;
        statusElement.className = 'open';
    } else {
        statusElement.textContent = `Cerrado, abre a las ${openTime}`;
        statusElement.className = 'closed';
    }
}
