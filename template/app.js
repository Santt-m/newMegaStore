import './js/header.js';
import './js/cart.js';
import Modal from './js/modal.js';
import { createCompanyHeader, updateCompanyHeader } from './js/company.js';
import { createStatusElement, updateStatus } from './js/status.js';
import { renderProducts } from './js/products.js';

let companyWhatsApp = '';
const companyDataUrl = './data/company.json';
const productsDataUrl = './data/products.json';

// Función para obtener el número de WhatsApp de la compañía
export function getCompanyWhatsApp() {
    return companyWhatsApp;  
}

// Función principal para cargar y renderizar la tienda
async function loadApp() {
    const main = document.querySelector('main');

    // Limpia el contenido de main antes de cargar una nueva tienda
    main.innerHTML = '';

    try {
        // Cargar datos de la compañía
        const companyResponse = await fetch(companyDataUrl);
        if (!companyResponse.ok) {
            throw new Error(`Error al cargar los datos de la compañía: ${companyResponse.statusText}`);
        }
        const companyDataArray = await companyResponse.json();
        if (!companyDataArray || !Array.isArray(companyDataArray) || companyDataArray.length === 0) {
            throw new Error(`No se encontraron datos de la compañía`);
        }
        const companyInfo = companyDataArray[0];

        companyWhatsApp = companyInfo.whatsapp; // Guardar el número de WhatsApp de la compañía

        // Crear y actualizar el estado del local
        const statusElement = createStatusElement();
        main.appendChild(statusElement);
        updateStatus(companyInfo);

        // Crear y actualizar el encabezado de la compañía
        const companyHeader = createCompanyHeader();
        main.appendChild(companyHeader);
        updateCompanyHeader(companyInfo); // Asegurarse de que los datos de horarios se pasen correctamente

        // Cargar productos
        const productsResponse = await fetch(productsDataUrl);
        if (!productsResponse.ok) {
            throw new Error(`Error al cargar los productos: ${productsResponse.statusText}`);
        }
        const products = await productsResponse.json();
        if (products && Array.isArray(products) && products.length > 0) {
            renderProducts(products);
        } else {
            console.warn(`No hay productos disponibles`);
        }
    } catch (error) {
        displayErrorModal(`Error al cargar la tienda: ${error.message}`);
    }
}

// Función para mostrar un modal de error
function displayErrorModal(message) {
    const modal = new Modal({
        title: 'Error',
        content: `<p>${message}</p>`,
        buttonText: 'Cerrar'
    });
    modal.createModal();
}

// Inicia la carga de la tienda al cargar el script
document.addEventListener('DOMContentLoaded', loadApp);
