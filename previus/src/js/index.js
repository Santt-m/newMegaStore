import { fetchDataList } from '../../data/dataIO.js';
import "../components/header/header.js";
import Modal from './modal.js';

document.addEventListener("DOMContentLoaded", async () => {
    const examplesList = document.getElementById("examples-list");

    if (!examplesList) {
        console.error("No se encontró el elemento examples-list");
        return;
    }

    // Carga los datos desde dataList.json
    const dataList = await fetchDataList();

    // Genera una tarjeta para cada tienda en dataList
    dataList.forEach((item) => {
        const card = document.createElement("li");
        card.className = "store-card";
        
        // Genera el contenido HTML de la tarjeta
        card.innerHTML = `
            <h3>${item.company}</h3>
            <p>${item.description}</p>
            <a class="btn" href="../store.html?store=${item.company}" target="_blank">Ver tienda</a>
        `;

        // Agrega la tarjeta al contenedor examples-list
        examplesList.appendChild(card);
    });

    // Parámetros de desplazamiento
    const scrollSpeed = 2; // Ajusta este valor para controlar el avance automático
    let scrollInterval;

    function autoScroll() {
        // Incrementa la posición de desplazamiento sumando scrollSpeed a la posición actual
        examplesList.scrollLeft += scrollSpeed;

        // Reinicia al principio si llega al final
        if (examplesList.scrollLeft >= examplesList.scrollWidth - examplesList.clientWidth) {
            examplesList.scrollLeft = 0;
        }
    }

    // Inicia el desplazamiento automático
    function startAutoScroll() {
        scrollInterval = setInterval(autoScroll, 100); // Ajusta el intervalo según prefieras
    }

    // Inicia el desplazamiento automático al cargar la página
    startAutoScroll();

    // Validación del formulario de contacto y envío por WhatsApp
    const contactForm = document.querySelector("#secContact form");
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name) {
            const modal = new Modal({
                message: "Por favor, ingresa tu nombre.",
                buttonText: "Cerrar",
                type: "error"
            });
            modal.createAlert();
            return;
        }

        if (!email) {
            const modal = new Modal({
                message: "Por favor, ingresa tu correo electrónico.",
                buttonText: "Cerrar",
                type: "error"
            });
            modal.createAlert();
            return;
        }

        if (!message) {
            const modal = new Modal({
                message: "Por favor, ingresa tu mensaje.",
                buttonText: "Cerrar",
                type: "error"
            });
            modal.createAlert();
            return;
        }

        const whatsappNumber = "541135966247";
        const whatsappMessage = `Hola, soy ${name}. Mi correo es ${email}. ${message}`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappUrl, "_blank");
    });

    document.querySelectorAll("#venta li").forEach((li) => {
        const hat = li.querySelector(".hat");
        if (hat && hat.textContent.trim() !== "Mas popular") {
            hat.style.display = "none";
        }

        li.addEventListener("mouseover", () => {
            if (hat) {
                hat.style.display = "flex";
            }
        });

        li.addEventListener("mouseout", () => {
            if (hat && hat.textContent.trim() !== "Mas popular") {
                hat.style.display = "none";
            }
        });
    });

    function animateOnScroll() {
        const elements = document.querySelectorAll("section,ol, #hero");
        const triggerBottom = window.innerHeight / 5 * 4;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add("show");
            } else {
                element.classList.remove("show");
            }
        });
    }

    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll(); // Para animar los elementos visibles al cargar la página

    document.getElementById("btnAsesorate").addEventListener("click", () => {
        const modal = new Modal({
            title: "Formulario de Asesoramiento",
            content: `
                <form>
                    <label for="modal-name">Nombre</label>
                    <input type="text" id="modal-name" placeholder="Nombre" required>
                    <label for="modal-email">Email</label>
                    <input type="email" id="modal-email" placeholder="Email" required>
                    <label for="modal-message">Mensaje</label>
                    <textarea id="modal-message" placeholder="Mensaje" required></textarea>
                </form>
            `,
            buttonText: "Cerrar"
        });
        modal.createModal();

        // Enviar el formulario por WhatsApp
        document.querySelector(".modal-footer").insertAdjacentHTML('afterbegin', `
            <button class="modal-send-btn">Enviar</button>
        `);

        document.querySelector(".modal-send-btn").addEventListener("click", () => {
            const name = document.getElementById("modal-name").value.trim();
            const email = document.getElementById("modal-email").value.trim();
            const message = document.getElementById("modal-message").value.trim();

            if (name && email && message) {
                const whatsappNumber = "541135966247";
                const whatsappMessage = `Hola, soy ${name}. Mi correo es ${email}. ${message}`;
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(whatsappUrl, "_blank");
                modal.closeModal(document.querySelector(".modal-overlay"));
            } else {
                const alertModal = new Modal({
                    message: "Por favor, completa todos los campos.",
                    buttonText: "Cerrar",
                    type: "error"
                });
                alertModal.createAlert();
            }
        });
    });
});
