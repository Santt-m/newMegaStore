export function renderProducts(products) {
    const main = document.querySelector('main');
    const section = document.createElement('section');
    section.id = 'productsContent';

    const nav = document.createElement('nav');
    nav.id = 'productsContentNav';

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

    types.forEach(type => {
        const li = document.createElement('li');
        li.id = type;

        const h2 = document.createElement('h2');
        h2.textContent = type;
        li.appendChild(h2);

        const filters = document.createElement('ol');
        filters.id = `filters-${type}`;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar...';
        searchInput.addEventListener('input', () => filterProductsBySearch(type, searchInput.value, products));
        filters.appendChild(searchInput);

        const viewAllButton = document.createElement('button');
        viewAllButton.textContent = 'Ver todos';
        viewAllButton.addEventListener('click', () => displayProducts(type, products.filter(product => product.type === type)));
        filters.appendChild(viewAllButton);

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

    products.forEach(product => {
        const productCard = document.createElement('li');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-cardTxt">
                <h3>${product.name}</h3>
                <h4>${product.description}</h4>
                <h5>$ ${product.price}</h5>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}
