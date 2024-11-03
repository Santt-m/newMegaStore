// store.js
import "../components/header/header.js";

// Importa las funciones necesarias
import { loadCompanyData, loadProducts, fetchDataList, fetchStoreFile } from '../../../data/dataIO.js'; // Importa fetchStoreFile
import Modal from './modal.js';
import { renderCompanySection } from './companyCard.js'; 
import { renderProductSections } from './productsCard.js'; // Importa renderProductSections para la sección de productos
import { renderCart, agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, initCart } from './cart.js'; // Importa funciones del carrito
import { initUser } from './user.js'; // Importa funciones de user.js
import { renderPromoCards } from './promoCard.js'; // Importa renderPromoCards para la sección de promociones

// Función para obtener el parámetro "store" de la URL
function getStoreFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('store');
}

// Función principal para cargar y renderizar la tienda o mostrar la búsqueda si no hay tienda especificada
async function loadStore() {
    const storeName = getStoreFromURL();
    const main = document.querySelector('main');

    // Limpia el contenido de main antes de cargar una nueva tienda
    main.innerHTML = '';

    if (!storeName) {
        renderSearchSection(main);
        return;
    }

    try {
        // Cargar datos de la compañía
        const companyDataArray = await loadCompanyData(storeName);
        const companyData = companyDataArray[0];

        if (!companyData) {
            throw new Error(`No se encontró la tienda: ${storeName}`);
        }

        // Renderiza la sección de la empresa
        const companySection = renderCompanySection(companyData);
        main.appendChild(companySection); // Asegúrate de agregarla al main

        // Obtener el número de WhatsApp de los datos de la compañía
        const whatsappNumber = companyData.whatsapp;

        // Cargar productos
        const productsData = await loadProducts(storeName);
        console.log("Productos cargados:", productsData); // Verifica los datos de productos

        if (productsData && Array.isArray(productsData) && productsData.length > 0) {
            // Filtrar productos promocionales
            const promoData = productsData.filter(product => product.promo);
            console.log("Promociones cargadas:", promoData); // Verifica los datos de promociones
            if (promoData.length > 0) {
                const promoSection = renderPromoCards(promoData);
                main.appendChild(promoSection); // Agrega la sección de promociones debajo de secCompany
            }

            renderProductSections(productsData); // Llama a la función para renderizar productos
            renderCart(productsData, storeName); // Renderiza el carrito con los datos de productos y storeName
            initCart(productsData, storeName); // Inicializa el carrito con los datos de productos y storeName
            initUser(productsData, whatsappNumber, storeName); // Inicializa los datos del usuario y el pedido con storeName
        } else {
            console.warn(`No hay productos disponibles para la tienda: ${storeName}`);
            // Mostrar una advertencia o un mensaje, en vez de lanzar el error y el modal
            const emptyProductsSection = document.createElement('section');
            emptyProductsSection.classList.add('product-section');
            emptyProductsSection.innerHTML = `<p>No hay productos disponibles para la tienda: ${storeName}</p>`;
            main.appendChild(emptyProductsSection);
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

// Función para renderizar la sección de búsqueda con autocompletado
async function renderSearchSection(main) {
    const dataList = await fetchDataList();

    const secSearch = document.createElement('section');
    secSearch.id = 'secSearch';
    secSearch.innerHTML = `
        <h2>Buscar tienda</h2>
        <input type="text" id="searchInput" list="storeSuggestions" placeholder="Escribe el nombre de la tienda...">
        <datalist id="storeSuggestions"></datalist>
    `;

    main.appendChild(secSearch);

    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('storeSuggestions');

    // Llenar el datalist con las tiendas disponibles
    dataList.forEach(store => {
        const option = document.createElement('option');
        option.value = store.company;
        suggestions.appendChild(option);
    });

    // Evento de selección de sugerencia para redirigir a la tienda seleccionada
    searchInput.addEventListener('change', () => {
        const selectedStore = searchInput.value;
        const foundStore = dataList.find(store => store.company === selectedStore);
        if (foundStore) {
            window.location.href = `store.html?store=${foundStore.company}`;
        }
    });
}

// Inicia la carga de la tienda al cargar el script
document.addEventListener('DOMContentLoaded', loadStore);
