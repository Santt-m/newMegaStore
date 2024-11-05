// Validación del formulario de contacto y envío por WhatsApp
const contactForm = document.querySelector("#contacto form");
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
