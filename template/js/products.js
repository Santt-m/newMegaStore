export function renderProducts(products) {
    const main = document.querySelector('main');
    const section = document.createElement('section');
    section.id = 'productsContent';

    const nav = document.createElement('nav');
    nav.id = 'productsContentNav';

    // Crear enlaces de navegación para cada tipo de producto
    const types = [...new Set(products.map(product => product.type))];
    types.forEach(type => {
        const link = document.createElement('a');
        link.href = `#${type}`;
        link.textContent = type;
        nav.appendChild(link);
    });

    section.appendChild(nav);

    const typeContent = document.createElement('ol');
    typeContent.id = 'typeContent';

    // Crear secciones para cada tipo de producto
    types.forEach(type => {
        const li = document.createElement('li');
        li.id = type;

        const h2 = document.createElement('h2');
        h2.textContent = type;
        li.appendChild(h2);

        const filters = document.createElement('ol');
        filters.id = `filters-${type}`;

        // Añadir campo de búsqueda
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar...';
        searchInput.addEventListener('input', () => filterProductsBySearch(type, searchInput.value, products));
        filters.appendChild(searchInput);

        // Añadir botón para ver todos los productos
        const viewAllButton = document.createElement('button');
        viewAllButton.textContent = 'Ver todos';
        viewAllButton.addEventListener('click', () => displayProducts(type, products.filter(product => product.type === type)));
        filters.appendChild(viewAllButton);

        // Añadir botones de filtro por etiquetas
        const tags = [...new Set(products.filter(product => product.type === type).flatMap(product => product.tag))];
        tags.forEach(tag => {
            const button = document.createElement('button');
            button.textContent = tag;
            button.addEventListener('click', () => filterProductsByTag(type, tag, products));
            filters.appendChild(button);
        });

        li.appendChild(filters);

        const productsContainer = document.createElement('ol');
        productsContainer.id = `productsContainer-${type}`;
        li.appendChild(productsContainer);

        typeContent.appendChild(li);
    });

    section.appendChild(typeContent);
    main.appendChild(section);

    // Mostrar todos los productos inicialmente
    types.forEach(type => {
        displayProducts(type, products.filter(product => product.type === type));
    });

    // Actualizar las cantidades de los productos en la interfaz
    window.updateAllProductQuantities();
}

function filterProductsByTag(type, tag, products) {
    const productsContainer = document.getElementById(`productsContainer-${type}`);
    const filteredProducts = products.filter(product => product.type === type && product.tag && product.tag.includes(tag));
    displayProducts(type, filteredProducts);
}

function filterProductsBySearch(type, searchTerm, products) {
    const productsContainer = document.getElementById(`productsContainer-${type}`);
    const filteredProducts = products.filter(product => product.type === type && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    displayProducts(type, filteredProducts);
}

function displayProducts(type, products) {
    const productsContainer = document.getElementById(`productsContainer-${type}`);
    productsContainer.innerHTML = ''; // Limpiar contenedor

    products.forEach((product, index) => {
        const productCard = document.createElement('li');
        productCard.classList.add('product-card');
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-cardTxt">
                <h3>${product.name}</h3>
                <h4>${product.description}</h4>
                <h5>$ ${product.price}</h5>
                <div class="cart-btns-container">
                    <button class="remove-from-cart">-</button>
                    <span class="product-quantity">0</span>
                    <button class="add-to-cart">+</button>
            </div>
        `;
        productCard.querySelector('.add-to-cart').addEventListener('click', () => {
            window.addToCart(product);
            window.updateProductQuantity(product.id);
        });
        productCard.querySelector('.remove-from-cart').addEventListener('click', () => {
            window.removeFromCart(product.id);
            window.updateProductQuantity(product.id);
        });
        productsContainer.appendChild(productCard);

        // Hacer visibles los productos filtrados inmediatamente
        productCard.style.transitionDelay = `${(index % 3) * 0.2}s`;
        productCard.classList.add('visible');
    });

    // Actualizar las cantidades de los productos en la interfaz
    window.updateAllProductQuantities();
}
