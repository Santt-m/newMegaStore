import "../components/header/header.js";

// Importa las funciones necesarias
import { loadCompanyData, loadProducts, fetchDataList } from '../../../data/dataIO.js'; // Importa fetchMenuFile
import Modal from './modal.js';
import { renderCompanySection } from './companyCard.js'; 
import { renderMenuProductSections } from './menuProductsCard.js'; // Importa renderMenuProductSections para la sección de productos
import { renderCart, agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, initCart } from './cart.js'; // Importa funciones del carrito
import { initUser } from './user.js'; // Importa funciones de user.js
import { renderPromoCards } from './promoCard.js'; // Importa renderPromoCards para la sección de promociones

// Función para obtener el parámetro "menu" de la URL
function getMenuFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('menu');
}

// Función principal para cargar y renderizar el menú o mostrar la búsqueda si no hay menú especificado
async function loadMenu() {
    const menuName = getMenuFromURL();
    const main = document.querySelector('main');

    // Limpia el contenido de main antes de cargar un nuevo menú
    main.innerHTML = '';

    if (!menuName) {
        renderSearchSection(main);
        return;
    }

    try {
        // Cargar datos de la compañía
        const companyDataArray = await loadCompanyData(menuName);
        const companyData = companyDataArray[0];

        if (!companyData) {
            throw new Error(`No se encontró el menú: ${menuName}`);
        }

        // Renderiza la sección de la empresa
        const companySection = renderCompanySection(companyData);
        main.appendChild(companySection); // Asegúrate de agregarla al main

        // Obtener el número de WhatsApp de los datos de la compañía
        const whatsappNumber = companyData.whatsapp;

        // Cargar productos
        const productsData = await loadProducts(menuName);
        console.log("Productos cargados:", productsData); // Verifica los datos de productos

        if (productsData && Array.isArray(productsData) && productsData.length > 0) {
            // Filtrar productos promocionales
            const promoData = productsData.filter(product => product.promo);
            console.log("Promociones cargadas:", promoData); // Verifica los datos de promociones
            if (promoData.length > 0) {
                const promoSection = renderPromoCards(promoData);
                main.appendChild(promoSection); // Agrega la sección de promociones debajo de secCompany
            }

            renderMenuProductSections(productsData); // Llama a la función para renderizar productos
            renderCart(productsData, menuName); // Renderiza el carrito con los datos de productos y menuName
            initCart(productsData, menuName); // Inicializa el carrito con los datos de productos y menuName
            initUser(productsData, whatsappNumber, menuName); // Inicializa los datos del usuario y el pedido con menuName
        } else {
            console.warn(`No hay productos disponibles para el menú: ${menuName}`);
            // Mostrar una advertencia o un mensaje, en vez de lanzar el error y el modal
            const emptyProductsSection = document.createElement('section');
            emptyProductsSection.classList.add('product-section');
            emptyProductsSection.innerHTML = `<p>No hay productos disponibles para el menú: ${menuName}</p>`;
            main.appendChild(emptyProductsSection);
        }
    } catch (error) {
        displayErrorModal(`Error al cargar el menú: ${error.message}`);
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

// Función para renderizar la sección de búsqueda con autocompletado
async function renderSearchSection(main) {
    const dataList = await fetchDataList();

    const secSearch = document.createElement('section');
    secSearch.id = 'secSearch';
    secSearch.innerHTML = `
        <h2>Buscar menú</h2>
        <input type="text" id="searchInput" list="menuSuggestions" placeholder="Escribe el nombre del menú...">
        <datalist id="menuSuggestions"></datalist>
    `;

    main.appendChild(secSearch);

    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('menuSuggestions');

    // Llenar el datalist con los menús disponibles
    dataList.forEach(menu => {
        const option = document.createElement('option');
        option.value = menu.company;
        suggestions.appendChild(option);
    });

    // Evento de selección de sugerencia para redirigir al menú seleccionado
    searchInput.addEventListener('change', () => {
        const selectedMenu = searchInput.value;
        const foundMenu = dataList.find(menu => menu.company === selectedMenu);
        if (foundMenu) {
            window.location.href = `menu.html?menu=${foundMenu.company}`;
        }
    });
}

// Inicia la carga del menú al cargar el script
document.addEventListener('DOMContentLoaded', loadMenu);
