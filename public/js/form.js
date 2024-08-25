const form = document.getElementById("form");

const inputs = document.querySelectorAll("#form input,#form textarea"); //ACCEDER A TODOS LOS INPUTS QUE AHY DENTRO DE FORM


const expresiones = {
    message: /^[\s\S]{1,100}$/, // Letras, números, simbolos, espacios todo
    name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    password: /^.{4,12}$/, // 4 a 12 dígitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    phone: /^\d{7,14}$/, // 7 a 14 números.
};

const validateForm = (e) => {
    // Verificar si el campo tiene algún valor antes de aplicar la validación
    if (e.target.value.trim() === "") {
        // No hacer nada si el campo está vacío
        return;
    }

    switch (e.target.name) {
        case "name":
            if (expresiones.name.test(e.target.value)) {
                document.getElementById("nombre").classList.remove("input-text-error");
                document.getElementById("nombre").placeholder = "name";
                document.querySelector("#contenedor-campos h3").classList.remove("title-error");
            } else {
                document.getElementById("nombre").classList.add("input-text-error");
                document.getElementById("nombre").placeholder = "add a correct value";       
                document.querySelector("#contenedor-campos h3").classList.add("title-error");
            }
            break;

        case "phone":
            if (expresiones.phone.test(e.target.value)) {
                document.getElementById("phone").classList.remove("input-text-error");
                document.getElementById("phone").placeholder = "phone";
                document.querySelector("#contenedor-campos h3").classList.remove("title-error");
            } else {
                document.getElementById("phone").classList.add("input-text-error");
                document.getElementById("phone").placeholder = "add a correct number";
                document.querySelector("#contenedor-campos h3").classList.add("title-error");
            }
            break;
        case "message":
            if (expresiones.message.test(e.target.value)) {
                document.getElementById("message").classList.remove("input-text-error");
                
            } else {
                document.getElementById("message").classList.add("input-text-error");
                
            }
            break;
    }
};

inputs.forEach((input) => {
    input.addEventListener("keyup", validateForm);
    input.addEventListener("blur", validateForm);
});

form.addEventListener("submit", (e) => {
    e.preventDefault(); //EVITAR QUE EL FORM SE ENVIE SIN LOS  DATOS COMPLETOS
});

// document.getElementById('form').addEventListener('submit', function(e) {
//     e.preventDefault(); // Evita que el formulario se envíe de manera predeterminada

//     // Recoger datos del formulario
//     const name = document.getElementById('nombre').value;
//     const phone = document.getElementById('phone').value;
//     const message = document.getElementById('message').value;

//     // Formatear el mensaje para WhatsApp
//     const formattedMessage = `Hola, soy ${name}, mi número es ${phone}. ${message}`;

//     // Codificar el mensaje para que se envíe correctamente en la URL
//     const encodedMessage = encodeURIComponent(formattedMessage);

//     // Número de teléfono (formato internacional)
//     const phoneNumber = "573219145165"; // Cambia este número por el que necesites

//     // Crear la URL de WhatsApp con el número y el mensaje
//     const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

//     // Abrir WhatsApp Web en una nueva pestaña
//     window.open(whatsappUrl, '_blank');
// });
