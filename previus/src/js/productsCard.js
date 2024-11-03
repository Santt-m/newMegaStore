// productsCard.js

import { agregarAlCarrito, restarDelCarrito, obtenerCantidadEnCarrito, renderCart, initCart } from './cart.js';

// Función para renderizar las secciones de productos
export function renderProductSections(productsData) {
    const main = document.querySelector('main');
    const productsByType = agruparPor(productsData, 'type'); // Agrupar productos por tipo

    // Limpiar el contenedor principal antes de renderizar
    main.querySelectorAll('.product-section').forEach(section => section.remove());

    let isFirstSection = true; // Variable para controlar el primer section

    for (const [type, productsOfType] of Object.entries(productsByType)) {
        const secProducts = document.createElement('section');
        secProducts.classList.add('product-section');
        
        if (isFirstSection) {
            secProducts.id = 'secProducts'; // Asignar id solo al primer section
            isFirstSection = false; // Cambiar el estado después del primer section
        } else {
            secProducts.id = `section-${type}`;
        }

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);

        const filterContainer = document.createElement('div');
        filterContainer.classList.add('filter-container');

        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Buscar producto...');
        searchInput.oninput = () => buscarProducto(secProducts, productsOfType, searchInput.value);

        filterContainer.appendChild(searchInput);

        // Filtrar por tags
        const tagsUnicos = [...new Set(productsOfType.flatMap(producto => producto.tag))];
        tagsUnicos.forEach(tag => {
            const filterButton = document.createElement('button');
            filterButton.textContent = tag;
            filterButton.addEventListener('click', () => filtrarPorTag(secProducts, productsOfType, tag));
            filterContainer.appendChild(filterButton);
        });

        // Botón para ver todos los productos
        const verTodosButton = document.createElement('button');
        verTodosButton.textContent = 'Ver Todos';
        verTodosButton.addEventListener('click', () => mostrarTodosProductos(secProducts, productsOfType));
        filterContainer.appendChild(verTodosButton);

        secProducts.appendChild(sectionTitle);
        secProducts.appendChild(filterContainer);

        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');
        secProducts.appendChild(productContainer);

        mostrarProductos(productContainer, productsOfType, productsData); // Pasar productsData
        main.appendChild(secProducts);
    }

    // Renderizar el carrito al final de la carga de productos
    initCart(productsData); // Inicializa el carrito con los datos de productos
    initLazyLoading(); // Inicializa el lazy loading después de renderizar los productos
}

// Función para mostrar todos los productos sin filtros
function mostrarTodosProductos(section, productos) {
    const productContainer = section.querySelector('.product-container');
    productContainer.innerHTML = ''; // Limpiar la sección antes de renderizar
    mostrarProductos(productContainer, productos);
    initLazyLoading(); // Inicializa el lazy loading después de mostrar todos los productos
}

// Función para agrupar productos por una propiedad (en este caso 'type')
function agruparPor(array, propiedad) {
    return array.reduce((acc, obj) => {
        const key = obj[propiedad];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

// Función para mostrar todos los productos usando la estructura proporcionada
function mostrarProductos(container, productos, productsData) { // Asegúrate de pasar productsData
    container.innerHTML = ''; // Limpiar el contenedor antes de renderizar
    productos.forEach(producto => {
        const productCard = crearProductCard(producto, productsData); // Pasar productsData
        container.appendChild(productCard);
    });
    initLazyLoading(); // Inicializa el lazy loading después de mostrar los productos
}

// Función para filtrar productos por tag
function filtrarPorTag(section, productos, tag) {
    const productosFiltrados = productos.filter(producto => producto.tag.includes(tag));
    const productContainer = section.querySelector('.product-container');
    productContainer.innerHTML = ''; // Limpiar la sección antes de renderizar
    mostrarProductos(productContainer, productosFiltrados);
    initLazyLoading(); // Inicializa el lazy loading después de filtrar los productos
}

// Función para buscar productos por nombre
function buscarProducto(section, productos, query) {
    const productosFiltrados = productos.filter(producto =>
        producto.name.toLowerCase().includes(query.toLowerCase())
    );
    const productContainer = section.querySelector('.product-container');
    productContainer.innerHTML = ''; // Limpiar la sección antes de renderizar
    mostrarProductos(productContainer, productosFiltrados);
    initLazyLoading(); // Inicializa el lazy loading después de buscar productos
}

// Función para crear las tarjetas de productos usando la estructura proporcionada
function crearProductCard(producto, productsData) { // Asegúrate de pasar productsData
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
        <img data-src="${producto.image}" alt="${producto.name}" class="lazy-image">
        <h3>${producto.name}</h3>
        <p>${producto.description}</p>
        <p>$ ${producto.price}</p>
        <div class="product-controls">
            <button class="btn-restar" data-id="${producto.id}">-</button>
            <span id="cantidad-producto-${producto.id}">${obtenerCantidadEnCarrito(producto.id)}</span>
            <button class="btn-sumar" data-id="${producto.id}">+</button>
        </div>
    `;

    // Eventos para sumar y restar productos en el carrito
    card.querySelector('.btn-sumar').addEventListener('click', () => {
        agregarAlCarrito(producto.id); // No es necesario pasar productsData aquí
        actualizarCantidadEnSpan(producto.id); // Actualiza el span después de agregar
    });

    card.querySelector('.btn-restar').addEventListener('click', () => {
        restarDelCarrito(producto.id); // No es necesario pasar productsData aquí
        actualizarCantidadEnSpan(producto.id); // Actualiza el span después de restar
    });

    return card;
}

// Función para actualizar el span de cantidad del producto
function actualizarCantidadEnSpan(productId) {
    const cantidadSpan = document.getElementById(`cantidad-producto-${productId}`);
    if (cantidadSpan) {
        cantidadSpan.textContent = obtenerCantidadEnCarrito(productId); // Actualiza el contenido del span
    }
}

// Función para inicializar el lazy loading de imágenes
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}
