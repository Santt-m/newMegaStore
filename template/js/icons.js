// ./src/icon/icons.js

const icons = [
    { name: 'plus', url: './src/icon/plus.svg' },
    { name: 'minus', url: './src/icon/minus.svg' },
    { name: 'bard', url: './src/icon/bard.svg' },
    { name: 'cart-empty', url: './src/icon/cart-emply.svg' },
    { name: 'cart-full', url: './src/icon/cart-full.svg' },
    { name: 'facebook', url: './src/icon/facebook.svg' },
    { name: 'github', url: './src/icon/github-light.svg' },
    { name: 'gmail', url: './src/icon/gmail.svg' },
    { name: 'instagram', url: './src/icon/instagram.svg' },
    { name: 'linkedin', url: './src/icon/linkedin.svg' },
    { name: 'telegram', url: './src/icon/telegram.svg' },
    { name: 'tiktok', url: './src/icon/tiktok.svg' },
    { name: 'twitter', url: './src/icon/twitter.svg' },
    { name: 'whatsapp', url: './src/icon/whatsapp.svg' },
    { name: 'youtube', url: './src/icon/youtube.svg' }
];

/**
 * Función para obtener la URL de un icono a partir de su nombre.
 * @param {string} iconName - Nombre del icono.
 * @returns {string|null} - URL del icono si se encuentra, de lo contrario null.
 */
export function getIconUrl(iconName) {
    const icon = icons.find(item => item.name === iconName);
    return icon ? icon.url : null;
}

export default icons;
