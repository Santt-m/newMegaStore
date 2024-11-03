// ./data/dataIO.js

const BASE_URL = './data/';

/**
 * Función para obtener el contenido de dataList.json
 * @returns {Promise<Array>} Lista de tiendas en JSON
 */
export async function fetchDataList() {
    return fetchDataFromUrl(`${BASE_URL}dataList.json`);
}

/**
 * Función para obtener el contenido de un archivo JSON específico por URL
 * @param {string} url - Ruta del archivo JSON a cargar
 * @returns {Promise<Object|null>} Datos contenidos en el JSON o null si no se encuentra
 */
async function fetchDataFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar el archivo JSON en ${url}`);
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

/**
 * Función para obtener los detalles de una tienda específica de dataList.json
 * @param {string} storeName - Nombre de la tienda
 * @returns {Promise<Object|null>} Detalles de la tienda o null si no existe
 */
async function getStoreInfo(storeName) {
    const dataList = await fetchDataList();
    return dataList.find(item => item.company === storeName) || null;
}

/**
 * Función para cargar archivos de la tienda (company.json o products.json)
 * @param {string} storeName - Nombre de la tienda
 * @param {string} fileName - Nombre del archivo a cargar
 * @returns {Promise<Object|null>} Datos del archivo o null si no existe
 */
export async function fetchStoreFile(storeName, fileName) {
    try {
        const storeInfo = await getStoreInfo(storeName);
        if (!storeInfo) throw new Error(`No se encontró la tienda ${storeName} en dataList.json`);
        
        const fileUrl = `${BASE_URL}${storeInfo.url}/${fileName}`;
        return await fetchDataFromUrl(fileUrl);
    } catch (error) {
        console.error(`Error al cargar ${fileName} de la tienda ${storeName}:`, error);
        return null;
    }
}

/**
 * Función para cargar los datos de la tienda desde company.json
 * @param {string} storeName - Nombre de la tienda
 * @returns {Promise<Object|null>} Datos de la tienda o null si no existe
 */
export function loadCompanyData(storeName) {
    return fetchStoreFile(storeName, 'company.json');
}

/**
 * Función para cargar los productos de la tienda desde products.json
 * @param {string} storeName - Nombre de la tienda
 * @returns {Promise<Array|null>} Lista de productos o null si no existen
 */
export function loadProducts(storeName) {
    return fetchStoreFile(storeName, 'products.json');
}
