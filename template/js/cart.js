import Modal from './modal.js';
import { getCompanyWhatsApp } from '../app.js';
import { getIconUrl } from './icons.js';

const cart = [];
let cartList, cartTotal, cartCount, emptyCartButton, cartBtnCart, cartBtnUser, cartBtnFinish, cartDiv, userDataContent, buyDiv, saveUserDataButton, userList, buyList, buyTotal, buyBtn, cartImg;
const companyName = 'company';

function closeCartContent() {
    const cartContent = document.getElementById('cartContent');
    if (cartContent) {
      cartContent.style.display = 'none';
      closeOverlay();
    }
  }
// Guarda el carrito en el almacenamiento local
function saveCartToLocalStorage() {
    localStorage.setItem(`${companyName}_cart`, JSON.stringify(cart));
}

// Carga el carrito desde el almacenamiento local
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem(`${companyName}_cart`);
    const savedUserData = localStorage.getItem('userData');
    
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.forEach(product => cart.push(product));
        updateCart();
        updateAllProductQuantities();
        if (parsedCart.length > 0) {
            showAlert('Tiene una pedido pendiente', 'warning');
        }
    }

    if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        document.getElementById('name').value = userData.name || '';
        document.getElementById('lastName').value = userData.lastName || '';
        document.getElementById('number').value = userData.number || '';
        document.getElementById('envio').checked = userData.envioChecked || false;
        document.getElementById('address').value = userData.address || '';
        document.getElementById('addressNumber').value = userData.addressNumber || '';
        document.getElementById('city').value = userData.city || '';
        document.getElementById('country').value = userData.country || '';
        document.getElementById('postalCode').value = userData.postalCode || '';
        document.getElementById('floor').value = userData.floor || '';
        document.getElementById('apartment').value = userData.apartment || '';
        document.getElementById('reference').value = userData.reference || '';

        showAlert('Datos de usuario cargados desde el almacenamiento local.', 'success');
    }
}

// Guarda los datos del usuario en el almacenamiento local
function saveUserDataToLocalStorage() {
    const userData = {
        name: document.getElementById('name').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        number: document.getElementById('number').value.trim(),
        envioChecked: document.getElementById('envio').checked,
        address: document.getElementById('address').value.trim(),
        addressNumber: document.getElementById('addressNumber').value.trim(),
        city: document.getElementById('city').value.trim(),
        country: document.getElementById('country').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim(),
        floor: document.getElementById('floor').value.trim(),
        apartment: document.getElementById('apartment').value.trim(),
        reference: document.getElementById('reference').value.trim()
    };
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Agrega un producto al carrito
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    updateCart();
    animateCartCount('fadein');
    updateProductQuantity(product.id);
    saveCartToLocalStorage();
    showAlert(`Se agregó ${product.name} al carrito.`, 'success');
}

// Elimina un producto del carrito
function removeFromCart(productId) {
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity -= 1;
        if (existingProduct.quantity <= 0) {
            cart.splice(cart.indexOf(existingProduct), 1);
            showAlert(`Se eliminó ${existingProduct.name} del carrito.`, 'error');
        } else {
            showAlert(`Se restó una unidad de ${existingProduct.name} del carrito.`, 'error');
        }
    }
    updateCart();
    animateCartCount('fadeout');
    updateProductQuantity(productId);
    saveCartToLocalStorage();
}

// Vacía el carrito
function emptyCart() {
    const productIds = cart.map(product => product.id);
    cart.length = 0;
    updateCart();
    productIds.forEach(updateProductQuantity);
    saveCartToLocalStorage();
    showAlert('Se vació el carrito.', 'warning');
}

// Actualiza la visualización del carrito
function updateCart() {
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="cart-item-details">
                <h4>${product.name}</h4>
                <h5>1 x $${product.price.toFixed(2)}</h5>
                <span>x ${product.quantity} = $${(product.price * product.quantity).toFixed(2)}</span>
                <div class="cart-item-actions">
                <button class="decrease-quantity">-</button>
                <span class="product-quantity">${product.quantity}</span>
                <button class="increase-quantity">+</button>
                
            </div>
            
            </div>
            <button class="remove-item">x</button>
            
        `;
        li.querySelector('.decrease-quantity').addEventListener('click', () => removeFromCart(product.id));
        li.querySelector('.increase-quantity').addEventListener('click', () => addToCart(product));
        li.querySelector('.remove-item').addEventListener('click', () => {
            cart.splice(cart.indexOf(product), 1);
            updateCart();
            updateProductQuantity(product.id);
            saveCartToLocalStorage();
            showAlert(`Se eliminó ${product.name} del carrito.`, 'error');
        });
        cartList.appendChild(li);
        total += product.price * product.quantity;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, product) => sum + product.quantity, 0);

    updateCartImage();
}

// Actualiza la imagen del carrito
function updateCartImage() {
    if (cart.length > 0) {
        cartImg.src = getIconUrl('cart-full');
    } else {
        cartImg.src = getIconUrl('cart-empty');
    }
}

// Anima el contador del carrito
function animateCartCount(animation) {
    cartCount.classList.add(animation);
    setTimeout(() => {
        cartCount.classList.remove(animation);
    }, 500); // Duración de la animación
}

// Muestra la vista del carrito
function showCart() {
    cartDiv.style.display = 'flex';
    userDataContent.style.display = 'none';
    buyDiv.style.display = 'none';
}

// Muestra la vista de datos del usuario
function showUserData() {
    cartDiv.style.display = 'none';
    userDataContent.style.display = 'flex';
    buyDiv.style.display = 'none';
}

// Muestra la vista de finalizar compra
function showBuy() {
    cartDiv.style.display = 'none';
    userDataContent.style.display = 'none';
    buyDiv.style.display = 'flex';
    displayUserData();
    displayOrderSummary();
}

// Obtiene el carrito actual
function getCart() {
    return cart;
}

// Actualiza la cantidad de un producto en la visualización
function updateProductQuantity(productId) {
    const productCards = document.querySelectorAll(`.product-card[data-id="${productId}"]`);
    const cart = getCart();
    const productInCart = cart.find(product => product.id === productId);
    const quantity = productInCart ? productInCart.quantity : 0;

    productCards.forEach(card => {
        const quantitySpan = card.querySelector('.product-quantity');
        quantitySpan.textContent = `${quantity}`;
    });
}

// Actualiza la cantidad de todos los productos en la visualización
function updateAllProductQuantities() {
    const cart = getCart();
    cart.forEach(product => updateProductQuantity(product.id));
}

// Muestra una alerta con un mensaje y tipo especificado
function showAlert(message, type) {
    const modal = new Modal({
        message: message,
        buttonText: 'Cerrar',
        type: type
    });
    modal.createAlert();
}

// Valida los datos del usuario
function validateUserData() {
    const name = document.getElementById('name').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const number = document.getElementById('number').value.trim();
    const envioChecked = document.getElementById('envio').checked;

    if (!name || !lastName || !number) {
        showAlert('Por favor, complete todos los campos obligatorios.', 'error');
        return false;
    }

    if (envioChecked) {
        const address = document.getElementById('address').value.trim();
        const addressNumber = document.getElementById('addressNumber').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();

        if (!address || !addressNumber || !city || !country || !postalCode) {
            showAlert('Por favor, complete todos los campos de dirección para el envío.', 'error');
            return false;
        }
    }

    showAlert('Datos guardados correctamente.', 'success');
    saveUserDataToLocalStorage();
    return true;
}

// Muestra los datos del usuario en la vista de finalizar compra
function displayUserData() {
    userList.innerHTML = '';

    const name = document.getElementById('name').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const number = document.getElementById('number').value.trim();
    const envioChecked = document.getElementById('envio').checked;

    userList.innerHTML += `<li>Nombre: ${name}</li>`;
    userList.innerHTML += `<li>Apellido: ${lastName}</li>`;
    userList.innerHTML += `<li>Nº de celular: ${number}</li>`;

    if (envioChecked) {
        const address = document.getElementById('address').value.trim();
        const addressNumber = document.getElementById('addressNumber').value.trim();
        const floor = document.getElementById('floor').value.trim();
        const apartment = document.getElementById('apartment').value.trim();
        const reference = document.getElementById('reference').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();

        userList.innerHTML += `<li>Dirección: ${address} ${addressNumber}</li>`;
        if (floor) userList.innerHTML += `<li>Piso: ${floor}</li>`;
        if (apartment) userList.innerHTML += `<li>Departamento: ${apartment}</li>`;
        if (reference) userList.innerHTML += `<li>Referencia: ${reference}</li>`;
        userList.innerHTML += `<li>Ciudad: ${city}</li>`;
        userList.innerHTML += `<li>País: ${country}</li>`;
        userList.innerHTML += `<li>Código Postal: ${postalCode}</li>`;
    }
}

// Muestra el resumen del pedido en la vista de finalizar compra
function displayOrderSummary() {
    buyList.innerHTML = '';
    let total = 0;

    cart.forEach(product => {
        buyList.innerHTML += `<li>${product.name} x ${product.quantity} = $${(product.price * product.quantity).toFixed(2)}</li>`;
        total += product.price * product.quantity;
    });

    buyTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Valida los datos del pedido
function validateOrderData() {
    const errors = [];
    const name = document.getElementById('name').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const number = document.getElementById('number').value.trim();
    const envioChecked = document.getElementById('envio').checked;

    if (!name) errors.push('Nombre es obligatorio.');
    if (!lastName) errors.push('Apellido es obligatorio.');
    if (!number) errors.push('Número de celular es obligatorio.');

    if (envioChecked) {
        const address = document.getElementById('address').value.trim();
        const addressNumber = document.getElementById('addressNumber').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();

        if (!address) errors.push('Dirección es obligatoria.');
        if (!addressNumber) errors.push('Número de dirección es obligatorio.');
        if (!city) errors.push('Ciudad es obligatoria.');
        if (!country) errors.push('País es obligatorio.');
        if (!postalCode) errors.push('Código Postal es obligatorio.');
    }

    if (cart.length === 0) {
        errors.push('El carrito está vacío. Agregue productos antes de finalizar el pedido.');
    }

    if (errors.length > 0) {
        showModalErrors(errors);
        return false;
    }

    return true;
}

// Muestra un modal con los errores de validación
function showModalErrors(errors) {
    const modalContent = errors.map(error => `<p>${error}</p>`).join('');
    const modal = new Modal({
        title: 'Errores de Validación',
        content: modalContent,
        actions: '<button class="modal-close-btn">Cerrar</button>',
        type: 'error'
    });
    modal.createModal();
}

// Envía un mensaje de WhatsApp con los detalles del pedido
function sendWhatsAppMessage() {
    if (!validateOrderData()) {
        return;
    }

    const name = document.getElementById('name').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const number = document.getElementById('number').value.trim();
    const envioChecked = document.getElementById('envio').checked;
    const companyWhatsApp = getCompanyWhatsApp();

    let message = `Hola, me gustaría realizar un pedido:\n\n`;
    message += `Nombre: ${name}\n`;
    message += `Apellido: ${lastName}\n`;
    message += `Nº de celular: ${number}\n\n`;
    message += `Resumen del pedido:\n`;

    cart.forEach(product => {
        message += `${product.name} x ${product.quantity} = $${(product.price * product.quantity).toFixed(2)}\n`;
    });

    message += `\nTotal: ${buyTotal.textContent}\n`;

    if (envioChecked) {
        const address = document.getElementById('address').value.trim();
        const addressNumber = document.getElementById('addressNumber').value.trim();
        const floor = document.getElementById('floor').value.trim();
        const apartment = document.getElementById('apartment').value.trim();
        const reference = document.getElementById('reference').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country').value.trim();
        const postalCode = document.getElementById('postalCode').value.trim();

        message += `\nDatos de envío:\n`;
        message += `Dirección: ${address} ${addressNumber}\n`;
        if (floor) message += `Piso: ${floor}\n`;
        if (apartment) message += `Departamento: ${apartment}\n`;
        if (reference) message += `Referencia: ${reference}\n`;
        message += `Ciudad: ${city}\n`;
        message += `País: ${country}\n`;
        message += `Código Postal: ${postalCode}\n`;
    }

    if (companyWhatsApp === '+1111111111') {
        const modal = new Modal({
            title: 'Mensaje de WhatsApp',
            content: `<p>${message.replace(/\n/g, '<br>')}</p>`,
            actions: '<button class="modal-close-btn">Cerrar</button>',
            type: 'info'
        });
        modal.createModal();
    } else {
        const whatsappUrl = `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Inicializa los elementos y eventos del carrito al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    cartList = document.getElementById('cartList');
    cartTotal = document.getElementById('cartTotal');
    cartCount = document.getElementById('cartCount');
    emptyCartButton = document.querySelector('#cart button');
    cartBtnCart = document.getElementById('cartBtnCart');
    cartBtnUser = document.getElementById('cartBtnUser');
    cartBtnFinish = document.getElementById('cartBtnFinish');
    cartDiv = document.getElementById('cart');
    userDataContent = document.getElementById('userDataContent');
    buyDiv = document.getElementById('buy');
    saveUserDataButton = document.getElementById('saveUserData');
    userList = document.getElementById('userList');
    buyList = document.getElementById('buyList');
    buyTotal = document.getElementById('buyTotal');
    buyBtn = document.getElementById('buyBtn');
    cartImg = document.getElementById('cartImg');

    cartBtnCart.addEventListener('click', showCart);
    cartBtnUser.addEventListener('click', showUserData);
    cartBtnFinish.addEventListener('click', showBuy);
    emptyCartButton.addEventListener('click', emptyCart);
    saveUserDataButton.addEventListener('click', validateUserData);
    buyBtn.addEventListener('click', sendWhatsAppMessage);

    const envioRadio = document.getElementById('envio');
    const takeAwayRadio = document.getElementById('takeAway');
    const envioDetails = document.getElementById('envioDetails');

    envioRadio.addEventListener('change', () => {
        if (envioRadio.checked) {
            envioDetails.style.display = 'flex';
        }
    });

    takeAwayRadio.addEventListener('change', () => {
        if (takeAwayRadio.checked) {
            envioDetails.style.display = 'none';
        }
    });

    const cartBtnClose = document.getElementById('cartBtnClose');
    cartBtnClose.addEventListener('click', closeCartContent);

    loadCartFromLocalStorage();

    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.getCart = getCart;
    window.updateProductQuantity = updateProductQuantity;
    window.updateAllProductQuantities = updateAllProductQuantities;
});
