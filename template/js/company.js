import { getIconUrl } from './icons.js';
import Modal from './modal.js';
import { getCompanyWhatsApp } from '../app.js';

export function createCompanyHeader() {
    const section = document.createElement('section');
    section.id = 'companyHeader';
    section.innerHTML = `
    <div class="companyHeaderContent">
        <ol id="companySocialNetworks"></ol>
        <div class="companyHeaderTxt">
            <img id="companyHeaderLogo" src="" alt="logo">
            <h1>Company Name</h1>
            <h2>(description)</h2>
            <button id="horariosModal">> ver horarios</button>
            <button id="whatsappModal">> Whatsapp</button>
        </div>
    </div>
    `;
    return section;
}

export function updateCompanyHeader(companyData) {
    const headerSection = document.getElementById('companyHeader');
    const socialNetworksList = document.getElementById('companySocialNetworks');
    const logoImage = document.getElementById('companyHeaderLogo');
    const companyName = headerSection.querySelector('h1');
    const companyDescription = headerSection.querySelector('h2');

    if (companyData.heroBackgroundImage) {
        headerSection.style.backgroundImage = `url(${companyData.heroBackgroundImage})`;
    }

    if (companyData.socialNetworks) {
        companyData.socialNetworks.forEach(network => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = network.link;

            const iconUrl = getIconUrl(network.name.toLowerCase());
            if (iconUrl) {
                const img = document.createElement('img');
                img.src = iconUrl;
                img.alt = network.name;
                link.appendChild(img);
            }

            listItem.appendChild(link);
            socialNetworksList.appendChild(listItem);
        });
    }

    if (companyData.image) {
        logoImage.src = companyData.image;
    }

    if (companyData.name) {
        companyName.textContent = companyData.name;
    }

    if (companyData.description) {
        companyDescription.textContent = companyData.description;
    }

    // Agregar evento para abrir el modal de horarios
    const horariosModalBtn = document.getElementById('horariosModal');
    horariosModalBtn.addEventListener('click', () => {
        const modal = new Modal({
            title: 'Horarios de Atención',
            content: createHorariosTable(companyData.horarios),
            buttonText: 'Cerrar'
        });
        modal.createModal();
    });

    // Agregar evento para abrir el modal de WhatsApp
    const whatsappModalBtn = document.getElementById('whatsappModal');
    whatsappModalBtn.addEventListener('click', () => {
        const modal = new Modal({
            title: 'Enviar Mensaje por WhatsApp',
            content: createWhatsAppForm(),
            actions: `
                <button id="sendWhatsAppBtn">Enviar WhatsApp</button>
                <button class="modal-close-btn">Cerrar</button>
            `
        });
        modal.createModal();

        // Asegurarse de que el botón existe antes de agregar el evento
        const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
        if (sendWhatsAppBtn) {
            sendWhatsAppBtn.addEventListener('click', sendMessage);
        }
    });
}

function createHorariosTable(horarios) {
    let tableContent = '<table class="horarios-table"><tr><th>Día</th><th>Horario</th></tr>';
    horarios.forEach(horario => {
        tableContent += `<tr><td>${horario.day}</td><td>${horario.hours}</td></tr>`;
    });
    tableContent += '</table>';
    return tableContent;
}

function createWhatsAppForm() {
    return `
        <form id="whatsappForm">
            <label for="firstName">Nombre:</label>
            <input type="text" id="firstName" name="firstName" required>
            <label for="lastName">Apellido:</label>
            <input type="text" id="lastName" name="lastName" required>
            <label for="phoneNumber">Número de Teléfono:</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" required>
            <label for="message">Mensaje:</label>
            <textarea id="message" name="message" required></textarea>
        </form>
    `;
}

function sendMessage() {
    const form = document.getElementById('whatsappForm');
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const phoneNumber = form.phoneNumber.value.trim();
    const message = form.message.value.trim();

    if (!firstName) {
        showAlert('El campo "Nombre" es obligatorio.');
        return;
    }

    if (!lastName) {
        showAlert('El campo "Apellido" es obligatorio.');
        return;
    }

    if (!phoneNumber) {
        showAlert('El campo "Número de Teléfono" es obligatorio.');
        return;
    }

    if (!message) {
        showAlert('El campo "Mensaje" es obligatorio.');
        return;
    }

    const companyWhatsApp = getCompanyWhatsApp();
    if (!companyWhatsApp) {
        showAlert('No se ha configurado un número de WhatsApp para la compañía.');
        return;
    }

    if (companyWhatsApp === '+1111111111') {
        const modal = new Modal({
            message: 'Esta es una versión de prueba',
            buttonText: 'Cerrar',
            type: 'warning'
        });
        modal.createAlert();
        return;
    }

    const whatsappUrl = `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(`Mensaje de ${firstName} ${lastName} (${phoneNumber}): ${message}`)}`;
    window.open(whatsappUrl, '_blank');
}

function showAlert(message) {
    const modal = new Modal({
        message: message,
        buttonText: 'Cerrar',
        type: 'error'
    });
    modal.createAlert();
}
