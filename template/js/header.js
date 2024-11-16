import { openOverlay, closeOverlay } from './modal.js';

const cartBtn = document.getElementById('cartBtn');
const cartContent = document.getElementById('cartContent');

function openCart() {
    cartContent.style.display = 'flex';
    cartContent.classList.remove('closing');
    cartBtn.classList.add('active');
    openOverlay();
}

function closeCart() {
    cartContent.classList.add('closing');
    setTimeout(() => {
        cartContent.style.display = 'none';
        cartContent.classList.remove('closing');
        cartBtn.classList.remove('active');
        closeOverlay();
    }, 500); // Esperar a que termine la animación
}

function toggleCart() {
    if (cartContent.style.display === 'flex') {
        closeCart();
    } else {
        openCart();
    }
}

function handleClickOutside(evento) {
    const overlay = document.querySelector('.overlay');
    if (overlay && !overlay.contains(evento.target)) overlay.addEventListener('click', () => {
        closeCart();
    });
}

function init() {
    cartBtn.addEventListener('click', toggleCart);
    document.addEventListener('click', handleClickOutside);
}

document.addEventListener('DOMContentLoaded', init);
