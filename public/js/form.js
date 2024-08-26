const form = document.getElementById("form");

const inputs = document.querySelectorAll("#form input,#form textarea"); //ACCEDER A TODOS LOS INPUTS QUE AHY DENTRO DE FORM


const expresiones = {
    message: /^[\s\S]{1,100}$/, // Letras, números, simbolos, espacios todo
    name: /^[a-zA-ZÀ-ÿ\s]{3,40}$/, // Letras y espacios, pueden llevar acentos.
    phone: /^\d{7,14}$/, // 7 a 14 números.
    password: /^.{4,12}$/, // 4 a 12 dígitos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

const ValidFields = {

    name: false,
    phone: false,
    message: false

}

const validateForm = (e) => {
    // Verificar si el campo tiene algún valor antes de aplicar la validación
    if (e.target.value.trim() === "") {

        return;
    }

    switch (e.target.name) {
        case "name":
            fieldvalidation(expresiones.name, e.target, 'name', 'add a correct value');            
            break;

        case "phone":
            fieldvalidation(expresiones.phone, e.target, 'phone', 'add a correct number');

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


const fieldvalidation = (expresion, input, campo, place) => {

    if (expresion.test(input.value)) {
        document.getElementById(`${campo}`).classList.remove("input-text-error");
        document.getElementById(`${campo}`).placeholder = `${campo}`;
        document.querySelector("#contenedor-campos h3").classList.remove("title-error");
        ValidFields[campo] = true;
    } else {
        document.getElementById(`${campo}`).classList.add("input-text-error");
        document.getElementById(`${campo}`).placeholder = `${place}`;
        document.querySelector("#contenedor-campos h3").classList.add("title-error");
        ValidFields[campo] = false;
    }

}

inputs.forEach((input) => {
    input.addEventListener("keyup", validateForm);
    input.addEventListener("blur", validateForm);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();



    // Validar todos los campos manualmente con las expresiones correctas
    fieldvalidation(expresiones.name, document.getElementById('name'), 'name', 'add a correct value');
    fieldvalidation(expresiones.phone, document.getElementById('phone'), 'phone', 'add a correct number');
    fieldvalidation(expresiones.message, document.getElementById('message'), 'message', 'add a message');


    if (ValidFields.name && ValidFields.phone && ValidFields.message) {
        console.log("Formulario enviado");
        
        //Recoger datos del formulario
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Formatear el mensaje para WhatsApp
        const formattedMessage = `Hola, soy ${name}, mi número es ${phone}. ${message}`;

        // Codificar el mensaje para que se envíe correctamente en la URL
        const encodedMessage = encodeURIComponent(formattedMessage);

        // Número de teléfono (formato internacional)
        const phoneNumber = "573219145165"; // Cambia este número por el que necesites

        // Crear la URL de WhatsApp con el número y el mensaje
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        // Abrir WhatsApp Web en una nueva pestaña
        window.open(whatsappUrl, '_blank');
        form.reset();
    }


});


