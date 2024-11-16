const icons = [
    { name: 'plus', url: '../icon/plus.svg' },
    { name: 'minus', url: '../icon/minus.svg' },
    { name: 'bard', url: '../icon/bard.svg' },
    { name: 'cart-empty', url: '../icon/cart-emply.svg' },
    { name: 'cart-full', url: '../icon/cart-full.svg' },
    { name: 'facebook', url: '../icon/facebook.svg' },
    { name: 'github', url: '../icon/github-light.svg' },
    { name: 'gmail', url: '../icon/gmail.svg' },
    { name: 'instagram', url: '../icon/instagram.svg' },
    { name: 'linkedin', url: '../icon/linkedin.svg' },
    { name: 'telegram', url: '../icon/telegram.svg' },
    { name: 'tiktok', url: '../icon/tiktok.svg' },
    { name: 'twitter', url: '../icon/twitter.svg' },
    { name: 'whatsapp', url: '../icon/whatsapp.svg' },
    { name: 'youtube', url: '../icon/youtube.svg' }
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
