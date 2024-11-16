// ./src/js/modal.js

/* 

import Modal from './modal.js;

EJEMPLO Modal !

const modal = new Modal({
  title: "Título del Modal",
  content: "Contenido del Modal",
  actions: '<button class="custom-action-btn">Acción Personalizada</button>',
  type: "success",
});
modal.createModal(); // Mostrar el modal

const modal = new Modal({
  message: 'mensaje del alerta',
  buttonText: 'Cerrar',
  type: 'error'
});
modal.createAlert(); // Mostrar la alerta

*/

class Modal {
  constructor(options) {
    this.options = options;
    this.alertContainer = document.querySelector(".alert-container") || this.createAlertContainer();
  }

  createModal() {
    openModalOverlay();
    const modalContent = this.createModalContent();
    document.body.appendChild(modalContent);

    this.addCloseEvent(modalContent, '.modal-close-icon');
    this.addCloseEvent(modalContent, '.modal-close-btn');
  }

  createModalContent() {
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
    modalContent.innerHTML = `
      <div class="modal-header">
        <h2>${this.options.title}</h2>
        <span class="modal-close-icon">&times;</span>
      </div>
      <div class="modal-body">
        ${this.options.content}
      </div>
      <div class="modal-footer">
        ${this.options.actions || '<button class="modal-close-btn">Cerrar</button>'}
      </div>
    `;
    return modalContent;
  }

  createOverlay(className) {
    const overlay = document.createElement("div");
    overlay.classList.add(className);
    return overlay;
  }

  addCloseEvent(element, selector) {
    const closeElement = element.querySelector(selector);
    if (closeElement) {
      closeElement.addEventListener("click", () => {
        this.closeOverlay(element);
      });
    }
  }

  closeOverlay(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    closeModalOverlay();
  }

  createAlertContainer() {
    const container = document.createElement("div");
    container.classList.add("alert-container");
    document.body.appendChild(container);
    return container;
  }

  createAlert() {
    const alert = this.createOverlay('alert-overlay');
    if (this.options.type) {
      alert.classList.add(`alert-${this.options.type}`);
    }

    alert.innerHTML = `
      <p>${this.options.message}</p>
      <button class="alert-close-btn">${this.options.buttonText}</button>
    `;

    this.alertContainer.appendChild(alert);
    this.addCloseEvent(alert, '.alert-close-btn');

    setTimeout(() => {
      this.closeOverlay(alert);
    }, 5000);
  }
}

export default Modal;

export function openOverlay() {
  let overlay = document.querySelector(".overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

export function closeOverlay() {
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.style.display = 'none';
  }
}

export function openModalOverlay() {
  let overlay = document.querySelector(".modal-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

export function closeModalOverlay() {
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) {
    overlay.style.display = 'none';
  }
}


