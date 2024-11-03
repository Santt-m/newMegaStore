import Modal from './modal.js';
import { getIconUrl } from '../icon/icons.js';

/**
 * Función para renderizar la sección de la compañía
 * @param {Object} companyData - Datos de la compañía obtenidos desde company.json
 * @returns {HTMLElement} - Elemento HTML con la sección de la compañía
 */
export function renderCompanySection(companyData) {
    const secCompany = document.createElement('section');
    secCompany.id = 'secCompany';

    // Crear la lista de redes sociales en la parte superior
    const socialNetworksList = document.createElement('ul');
    socialNetworksList.className = 'socialNetworksList';

    if (companyData.socialNetworks?.length) {
        companyData.socialNetworks.forEach(social => {
            const socialItem = document.createElement('li');
            const socialLink = document.createElement('a');
            socialLink.href = social.link.startsWith('http') ? social.link : `https://${social.link}`;
            socialLink.target = '_blank';

            // Obtener el icono de la red social y añadirlo al enlace
            const iconUrl = getIconUrl(social.name.toLowerCase());
            const socialIcon = document.createElement('img');
            socialIcon.src = iconUrl;
            socialIcon.alt = `${social.name} icon`;
            socialIcon.className = 'socialIcon';

            socialLink.appendChild(socialIcon);
            socialItem.appendChild(socialLink);
            socialNetworksList.appendChild(socialItem);
        });
    }

    // Insertar socialNetworksList antes de secCompany
    secCompany.appendChild(socialNetworksList);

    // Estructura principal de la sección de la compañía
    secCompany.innerHTML += `
        <div class="companyDesc">
            <img class="companyLogo" id="companyLogo" src="${companyData.image || './assets/img/placeholder.webp'}" alt="${companyData.name ? `Logo de ${companyData.name}` : 'Logo de la empresa'}">
            <div class="companyHeader">
                ${companyData.name ? `<h1>${companyData.name}</h1>` : ''}
                ${companyData.description ? `<h2>${companyData.description}</h2>` : ''}
            </div>
            <div class="companyInfo">
                ${companyData.address ? `<p>Dirección: ${companyData.address}</p>` : ''}
                ${companyData.phone ? `<p>Teléfono: <a href="tel:${companyData.phone}">${companyData.phone}</a></p>` : ''}
                ${companyData.email ? `<p>Email: <a href="mailto:${companyData.email}">${companyData.email}</a></p>` : ''}
                ${companyData.whatsapp ? `<p><a href="https://wa.me/${companyData.whatsapp}?text=Hola,%20me%20comunico%20desde%20la%20página%20web" target="_blank"><img class="icon" src="./src/icon/whatsapp.svg" alt="whatsapp icon"> WhatsApp</a></p>` : ''}
                ${getStoreStatus(companyData.horarios)}
                ${getDeliveryStatus(companyData.envios)}
            </div>
            <div id="company"></div>
            <div class="companyActions">
                ${companyData.horarios?.length ? `<button class="btn" id="btnHorarios" aria-label="Ver horarios de atención">Ver Horarios</button>` : ''}
                ${companyData.envios?.length ? `<button class="btn" id="btnEnvios" aria-label="Ver horarios de envíos">Ver Envíos</button>` : ''}
                ${companyData.socialNetworks?.length ? `<button class="btn" id="btnRedesSociales" aria-label="Ver redes sociales">Ver Redes Sociales</button>` : ''}
            </div>
        </div>
    `;

    // Aplicar fondo a companyDesc si heroBackgroundImage está presente
    const companyDesc = secCompany.querySelector('.companyDesc');
    if (companyData.heroBackgroundImage) {
        companyDesc.style.backgroundImage = `url(${companyData.heroBackgroundImage})`;
        companyDesc.style.backgroundSize = 'cover';
        companyDesc.style.backgroundPosition = 'center';
    }

    // Eventos para abrir los modales solo si los datos existen
    if (companyData.horarios?.length) {
        secCompany.querySelector('#btnHorarios').addEventListener('click', () => {
            renderHorariosModal(companyData.horarios);
        });
    }
    if (companyData.envios?.length) {
        secCompany.querySelector('#btnEnvios').addEventListener('click', () => {
            renderEnviosModal(companyData.envios);
        });
    }
    if (companyData.socialNetworks?.length) {
        secCompany.querySelector('#btnRedesSociales').addEventListener('click', () => {
            renderSocialNetworksModal(companyData.socialNetworks);
        });
    }

    return secCompany;
}

// Función para obtener el estado del local
function getStoreStatus(horarios) {
    if (!horarios?.length) return '';

    const now = new Date();
    const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' });
    const currentTime = now.getHours() + ':' + now.getMinutes();

    const todaySchedule = horarios.find(horario => horario.day.toLowerCase() === currentDay.toLowerCase());

    if (!todaySchedule) return '';

    const [openTime, closeTime] = todaySchedule.hours.split(' - ');

    const timeToClose = new Date();
    const [closeHour, closeMinute] = closeTime.split(':');
    timeToClose.setHours(closeHour, closeMinute, 0, 0);
    const minutesToClose = (timeToClose - now) / 60000;

    if (currentTime >= openTime && currentTime <= closeTime) {
        if (minutesToClose <= 30) {
            return `<p>Dejaremos de atender pronto</p>`;
        }
        return `<p>Estamos atendiendo</p>`;
    } else if (currentTime < openTime) {
        return `<p>Comenzaremos a atender pronto</p>`;
    } else {
        return `<p>No estamos atendiendo ahora</p>`;
    }
}

// Función para obtener el estado de los envíos
function getDeliveryStatus(envios) {
    if (!envios?.length) return '';

    const now = new Date();
    const currentDay = now.toLocaleDateString('es-ES', { weekday: 'long' });
    const currentTime = now.getHours() + ':' + now.getMinutes();

    const todayDelivery = envios.find(envio => envio.day.toLowerCase() === currentDay.toLowerCase());

    if (!todayDelivery) return '';

    const [openTime, closeTime] = todayDelivery.hours.split(' - ');

    const timeToClose = new Date();
    const [closeHour, closeMinute] = closeTime.split(':');
    timeToClose.setHours(closeHour, closeMinute, 0, 0);
    const minutesToClose = (timeToClose - now) / 60000;

    if (currentTime >= openTime && currentTime <= closeTime) {
        if (minutesToClose <= 30) {
            return `<p>Pronto a dejar de recibir pedidos</p>`;
        }
        return `<p>Envíos Disponible</p>`;
    } else if (currentTime < openTime) {
        return `<p>Envios disponible en breve</p>`;
    } else {
        return `<p>Envios no disponible ahora</p>`;
    }
}

// Modal en formato tabla para horarios
function renderHorariosModal(horarios) {
    const modalContent = `
        <table class="horariosTable">
            <thead>
                <tr>
                    <th>Día</th>
                    <th>Horario</th>
                </tr>
            </thead>
            <tbody>
                ${horarios.map(horario => `
                    <tr>
                        <td>${horario.day}</td>
                        <td>${horario.hours}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    new Modal({
        title: 'Horarios de atención',
        content: modalContent,
        buttonText: 'Cerrar'
    }).createModal();
}

// Modal en formato tabla para envíos
function renderEnviosModal(envios) {
    const modalContent = `
        <table class="enviosTable">
            <thead>
                <tr>
                    <th>Día</th>
                    <th>Horario de Envíos</th>
                </tr>
            </thead>
            <tbody>
                ${envios.map(envio => `
                    <tr>
                        <td>${envio.day}</td>
                        <td>${envio.hours}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    new Modal({
        title: 'Horarios de Envíos',
        content: modalContent,
        buttonText: 'Cerrar'
    }).createModal();
}

// Modal para mostrar redes sociales
function renderSocialNetworksModal(socialNetworks) {
    const modalContent = `
        <table class="socialNetworksTable">
            <thead>
                <tr>
                    <th>Red Social</th>
                    <th>Enlace</th>
                </tr>
            </thead>
            <tbody>
                ${socialNetworks.map(social => `
                    <tr>
                        <td>${social.name}</td>
                        <td><a href="${social.link.startsWith('http') ? social.link : 'https://' + social.link}" target="_blank">Visitar</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    new Modal({
        title: 'Redes Sociales',
        content: modalContent,
        buttonText: 'Cerrar'
    }).createModal();
}
