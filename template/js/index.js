import { fetchDataList } from '../../js/dataIO.js';

// Función para renderizar la sección de índice con autocompletado
export async function renderIndexSection(main) {
    const dataList = await fetchDataList();

    const secIndex = document.createElement('section');
    secIndex.id = 'secIndex';
    secIndex.innerHTML = `
        <h2>Buscar tienda</h2>
        <input type="text" id="searchInput" list="storeSuggestions" placeholder="Escribe el nombre de la tienda...">
        <datalist id="storeSuggestions"></datalist>
        <h3>Tiendas disponibles</h3>
        <ul id="storeList"></ul>
    `;

    main.appendChild(secIndex);

    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('storeSuggestions');
    const storeList = document.getElementById('storeList');

    // Llenar el datalist con las tiendas disponibles
    dataList.forEach(store => {
        const option = document.createElement('option');
        option.value = store.name;
        suggestions.appendChild(option);

        // Crear una lista de tiendas disponibles con más información
        const listItem = document.createElement('li');
        listItem.classList.add('store-card');
        listItem.style.backgroundImage = store.heroBackgroundImage ? `url(${store.heroBackgroundImage})` : 'none';
        listItem.innerHTML = `
            <div class="store-card-content">
                <img src="${store.image || './src/icon/default-store.png'}" alt="${store.name} logo" class="store-image">
                <div class="store-info">
                    <h4>${store.name}</h4>
                    <p>${store.description}</p>
                    <a href="app.html?store=${store.name}" class="store-link">Visitar tienda</a>
                    <div class="store-social-networks">
                        ${store.socialNetworks ? store.socialNetworks.map(network => `
                            <a href="${network.link}" target="_blank">
                                <img src="./src/icon/${network.name.toLowerCase()}.svg" alt="${network.name} icon">
                            </a>
                        `).join('') : ''}
                    </div>
                </div>
            </div>
        `;
        storeList.appendChild(listItem);
    });

    // Evento de selección de sugerencia para redirigir a la tienda seleccionada
    searchInput.addEventListener('change', () => {
        const selectedStore = searchInput.value;
        const foundStore = dataList.find(store => store.name === selectedStore);
        if (foundStore) {
            window.location.href = `app.html?store=${foundStore.name}`;
        }
    });
}
