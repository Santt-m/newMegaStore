import Modal from './modal.js'; // Importar Modal
import { currentStoreName } from './cart.js'; // Importar currentStoreName

let productsDataGlobal = []; // Variable global para almacenar los productos
let whatsappNumber = ''; // Variable global para almacenar el número de WhatsApp

// Función para validar los datos del usuario
function validateUserData(userData) {
    const errors = [];
    if (!userData.name || !/^[a-zA-Z\s]+$/.test(userData.name)) {
        errors.push('Nombre inválido o faltante');
    }
    if (!userData.lastName || !/^[a-zA-Z\s]+$/.test(userData.lastName)) {
        errors.push('Apellido inválido o faltante');
    }
    if (!userData.phone || !/^\d+$/.test(userData.phone)) {
        errors.push('Teléfono inválido o faltante');
    }
    return errors;
}

// Función para validar los datos de envío
function validateDeliveryData(deliveryData) {
    const errors = [];
    if (!deliveryData.address) {
        errors.push('Dirección inválida o faltante');
    }
    if (!deliveryData.addressNumber) {
        errors.push('Número de dirección inválido o faltante');
    }
    return errors;
}

// Función para guardar los datos del usuario en localStorage
function saveUserData() {
    const userData = {
        name: document.getElementById('name').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
    };
    const errors = validateUserData(userData);
    if (errors.length > 0) {
        const modal = new Modal({
            message: errors.join('<br>'),
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
        return;
    }
    try {
        const existingUserData = JSON.parse(localStorage.getItem('userData')) || {};
        const isDataChanged = 
            existingUserData.name !== userData.name ||
            existingUserData.lastName !== userData.lastName ||
            existingUserData.phone !== userData.phone;

        if (isDataChanged) {
            localStorage.setItem('userData', JSON.stringify(userData));
            const modal = new Modal({
                message: 'Datos del usuario guardados correctamente',
                buttonText: 'Cerrar',
                type: 'success'
            });
            modal.createAlert();
        }
    } catch (error) {
        console.error('Error al guardar los datos del usuario en localStorage:', error);
    }
}

// Función para guardar los datos de envío en localStorage
function saveDeliveryData() {
    const deliveryData = {
        address: document.getElementById('address').value,
        addressNumber: document.getElementById('addressNumber').value,
        departamento: document.getElementById('departamento').value,
        notas: document.getElementById('notas').value,
    };
    const errors = validateDeliveryData(deliveryData);
    if (errors.length > 0) {
        const modal = new Modal({
            message: errors.join('<br>'),
            buttonText: 'Cerrar',
            type: 'error'
        });
        modal.createAlert();
        return;
    }
    try {
        localStorage.setItem('deliveryData', JSON.stringify(deliveryData));
        const modal = new Modal({
            message: 'Datos de envío guardados correctamente',
            buttonText: 'Cerrar',
            type: 'success'
        });
        modal.createAlert();
    } catch (error) {
        console.error('Error al guardar los datos de envío en localStorage:', error);
    }
}

// Función para cargar los datos del usuario desde localStorage
function loadUserData() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        document.getElementById('name').value = userData.name || '';
        document.getElementById('lastName').value = userData.lastName || '';
        document.getElementById('phone').value = userData.phone || '';
    } catch (error) {
        console.error('Error al cargar los datos del usuario desde localStorage:', error);
    }
}

// Función para cargar los datos de envío desde localStorage
function loadDeliveryData() {
    try {
        const deliveryData = JSON.parse(localStorage.getItem('deliveryData')) || {};
        document.getElementById('address').value = deliveryData.address || '';
        document.getElementById('addressNumber').value = deliveryData.addressNumber || '';
        document.getElementById('departamento').value = deliveryData.departamento || '';
        document.getElementById('notas').value = deliveryData.notas || '';
    } catch (error) {
        console.error('Error al cargar los datos de envío desde localStorage:', error);
    }
}

// Función para mostrar los datos del usuario en userData
function displayUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const userDataList = document.getElementById('userData');
    userDataList.innerHTML = `
        <li>Nombre: ${userData.name || ''}</li>
        <li>Apellido: ${userData.lastName || ''}</li>
        <li>Teléfono: ${userData.phone || ''}</li>
    `;
}

// Función para mostrar el resumen del pedido en orderData
function displayOrderData() {
    const cart = JSON.parse(localStorage.getItem(`cart_${currentStoreName}`)) || {}; // Cambiar el nombre del carrito
    const orderDataList = document.getElementById('orderData');
    orderDataList.innerHTML = '';

    Object.entries(cart).forEach(([productId, cantidad]) => {
        const product = productsDataGlobal.find(p => p.id == productId);
        if (product) {
            const orderItem = document.createElement('li');
            orderItem.innerHTML = `
                ${product.name} - Cantidad: ${cantidad} - Total: $${(product.price * cantidad).toFixed(2)}
            `;
            orderDataList.appendChild(orderItem);
        }
    });

    const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
    if (deliveryOption === 'delivery') {
        const deliveryData = JSON.parse(localStorage.getItem('deliveryData')) || {};
        const deliveryInfo = document.createElement('li');
        deliveryInfo.innerHTML = `
            <strong>Información de Envío:</strong><br>
            Dirección: ${deliveryData.address || ''} ${deliveryData.addressNumber || ''}<br>
            Departamento: ${deliveryData.departamento || ''}<br>
            Notas: ${deliveryData.notas || ''}
        `;
        orderDataList.appendChild(deliveryInfo);
    }
}

// Función para verificar si el local está abierto
function isStoreOpen() {
    const currentHour = new Date().getHours();
    const openHour = 9; // Hora de apertura del local
    const closeHour = 21; // Hora de cierre del local
    return currentHour >= openHour && currentHour < closeHour;
}

// Función para verificar si los datos del usuario están completos
function isUserDataComplete() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    return userData.name && userData.lastName && userData.phone;
}

// Función para verificar si los datos de envío están completos
function isDeliveryDataComplete() {
    const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
    if (deliveryOption === 'delivery') {
        const address = document.getElementById('address').value;
        const addressNumber = document.getElementById('addressNumber').value;
        return address && addressNumber;
    }
    return true;
}

// Función para mostrar el modal de validación
function showValidationModal(messages) {
    const modal = new Modal({
        title: 'Validación de Pedido',
        content: `<p>${messages.join('<br>')}</p>`,
        buttonText: 'Cerrar',
        secondaryButtonText: '<img class="icon" src="./src/icon/whatsapp.svg" alt="whatsapp icon"> Enviar de todas formas',
        onSecondaryButtonClick: enviarPedidoPorWhatsApp
    });
    modal.createModal();
}

// Función para enviar el pedido por WhatsApp
function enviarPedidoPorWhatsApp() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const cart = JSON.parse(localStorage.getItem(`cart_${currentStoreName}`)) || {}; // Cambiar el nombre del carrito
    const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
    const address = document.getElementById('address').value;
    const addressNumber = document.getElementById('addressNumber').value;
    const notas = document.getElementById('notas').value;

    let mensaje = `Hola, me gustaría hacer un pedido:\n\nUsuario:\nNombre: ${userData.name}\nApellido: ${userData.lastName}\nTeléfono: ${userData.phone}\n\nPedido:\n`;

    Object.entries(cart).forEach(([productId, cantidad]) => {
        const product = productsDataGlobal.find(p => p.id == productId);
        if (product) {
            mensaje += `${product.name} - Cantidad: ${cantidad} - Total: $${(product.price * cantidad).toFixed(2)}\n`;
        }
    });

    mensaje += `\nOpción de entrega: ${deliveryOption === 'takeAway' ? 'Pasar a buscar por el local' : 'Envío a domicilio'}`;

    if (deliveryOption === 'delivery') {
        mensaje += `\nDirección: ${address} ${addressNumber}\nNotas: ${notas}`;
    }

    if (whatsappNumber === '+1111111111') {
        const modal = new Modal({
            title: 'Versión de Muestra',
            content: `
                <div class="sample-modal-content">
                    <p><strong>Este es el mensaje que se enviaría por WhatsApp:</strong></p>
                    <div class="sample-modal-message">
                        <p>${mensaje.replace(/\n/g, '<br>')}</p>
                    </div>
                    <p class="sample-modal-footer">Esta es una versión de muestra. Descubre las ventajas de nuestro sistema.</p>
                </div>
            `,
            buttonText: 'Cerrar',
            type: 'info'
        });
        modal.createModal();
    } else {
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Función para validar el pedido y mostrar el modal si hay errores
function validateOrder() {
    const userMessages = [];
    const orderMessages = [];

    if (!isStoreOpen()) {
        orderMessages.push('El local no está atendiendo ahora');
    }
    if (!isUserDataComplete()) {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        if (!userData.name) userMessages.push('Falta el nombre del usuario');
        if (!userData.lastName) userMessages.push('Falta el apellido del usuario');
        if (!userData.phone) userMessages.push('Falta el teléfono del usuario');
        if (userData.phone && !/^\d+$/.test(userData.phone)) userMessages.push('El teléfono no es correcto');
    }
    if (!isDeliveryDataComplete()) {
        const address = document.getElementById('address').value;
        const addressNumber = document.getElementById('addressNumber').value;
        if (!address) orderMessages.push('Falta la dirección de envío');
        if (!addressNumber) orderMessages.push('Falta el número de la dirección de envío');
    }

    if (userMessages.length > 0 || orderMessages.length > 0) {
        showValidationModal([...userMessages, ...orderMessages]);
    } else {
        enviarPedidoPorWhatsApp();
    }
}

// Función para mostrar/ocultar el formulario de envío
function toggleEnvioForm() {
    const deliveryOption = document.querySelector('input[name="deliveryOption"]:checked').value;
    const envioForm = document.getElementById('envioForm');
    if (deliveryOption === 'delivery') {
        envioForm.style.display = 'flex';
    } else {
        envioForm.style.display = 'none';
    }
}

// Función para inicializar los datos del usuario y el pedido
export function initUser(productsData, whatsapp) {
    productsDataGlobal = productsData; // Almacena los datos de productos en la variable global
    whatsappNumber = whatsapp; // Almacena el número de WhatsApp
    loadUserData(); // Carga los datos del usuario desde localStorage
    loadDeliveryData(); // Carga los datos de envío desde localStorage
    displayUserData(); // Muestra los datos del usuario en userData
    displayOrderData(); // Muestra el resumen del pedido en orderData

    // Verifica si el local está abierto y muestra el botón de enviar pedido o el mensaje de cerrado
    const btnWpOrder = document.querySelector('.btn-wp-order');
    if (btnWpOrder) {
        btnWpOrder.style.display = 'flex';
        btnWpOrder.addEventListener('click', () => {
            validateOrder(); // Validar el pedido y mostrar el modal de validación si es necesario
        });
    }

    // Agregar EventListener para la opción de entrega
    const deliveryOptions = document.querySelectorAll('input[name="deliveryOption"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', () => {
            toggleEnvioForm(); // Mostrar/ocultar el formulario de envío
        });
    });

    // Inicializar el formulario de envío basado en la opción seleccionada
    toggleEnvioForm();

    // Regenerar el contenido del div completarPedido al hacer clic en el botón de completar pedido
    const completarPedidoBtn = document.querySelector('.btn[data-target="completarPedido"]');
    if (completarPedidoBtn) {
        completarPedidoBtn.addEventListener('click', () => {
            displayUserData(); // Muestra los datos del usuario en userData
            displayOrderData(); // Muestra el resumen del pedido en orderData
        });
    }
}

// Agregar el EventListener al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    // Guardar los datos del usuario al cambiar los campos del formulario
    const userFormInputs = document.querySelectorAll('#userForm input');
    userFormInputs.forEach(input => {
        input.addEventListener('change', () => {
            saveUserData();
        });
    });

    // Agregar EventListener para la opción de entrega
    const deliveryOptions = document.querySelectorAll('input[name="deliveryOption"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', () => {
            toggleEnvioForm(); // Mostrar/ocultar el formulario de envío
        });
    });

    // Guardar los datos de envío al hacer clic en el botón
    const saveDeliveryDataBtn = document.getElementById('saveDeliveryDataBtn');
    if (saveDeliveryDataBtn) {
        saveDeliveryDataBtn.addEventListener('click', () => {
            saveDeliveryData();
        });
    }
});