// Botones que están atentos a interacción
const userForm = document.getElementById("userForm");
const enviarButton = document.getElementById("enviarButton");
const limpiarButton = document.getElementById("limpiarButton");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validarDNI(value) {
    //El dato lo cambiamos a string y a mayuscula para poder compararlo con la lista sin problema
    var str = value.toString().toUpperCase();
    //Creamos el regex del nie y nif
    var regexNif = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    var regexNie = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    //Variable con el orden en el que se asignan las letras
    var letrasValidas = 'TRWAGMYFPDXBNJZSQVHLCKET';
    
    // Comprueba si el valor no coincide ni con el patrón de NIF ni con el patrón de NIE
    if (!regexNif.test(str) && !regexNie.test(str)) return false;

    // Reemplaza X, Y o Z con 0, 1 o 2 respectivamente para homogeneizar el formato (cambia el nif para hacerlo nie).
    var nie = str
        .replace(/^[X]/, '0')
        .replace(/^[Y]/, '1')
        .replace(/^[Z]/, '2');

    // Extrae la última letra del valor y calcula el índice del carácter.
    var letter = str.substr(-1);
    var charIndex = parseInt(nie.substr(0, 8)) % 23;

    // Compara la letra calculada con la letra proporcionada y devuelve verdadero si coinciden.
    return letrasValidas.charAt(charIndex) === letter;
}

// Poner los datos en el formulario
function populateFormWithSavedData() {
    // tener los datos guardados en el localStorage
    const savedNombre = localStorage.getItem("nombre");
    const savedApellido = localStorage.getItem("apellido");
    const savedNumeroTelefono = localStorage.getItem("numeroTelefono");
    const savedEmail = localStorage.getItem("email");
    const savedDni = localStorage.getItem("dni");

    // Llenar los campos con los datos guardados
    if (savedNombre) document.getElementById("nombre").value = savedNombre;
    if (savedApellido) document.getElementById("apellido").value = savedApellido;
    if (savedNumeroTelefono) document.getElementById("numeroTelefono").value = savedNumeroTelefono;
    if (savedEmail) document.getElementById("email").value = savedEmail;
    if (savedDni) document.getElementById("dni").value = savedDni;
}

// Llamar a la función para poner los datos en el formulario
document.addEventListener("DOMContentLoaded", populateFormWithSavedData);

// Eventos
enviarButton.addEventListener("click", () => {
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const numeroTelefono = document.getElementById("numeroTelefono");
    const email = document.getElementById("email");
    const dni = document.getElementById("dni");

    // Validar que todo este rellenado y en su formato correcto
    if (nombre.value.trim() === "" || apellido.value.trim() === "" || email.value.trim() === ""|| numeroTelefono.value.trim() === ""|| dni.value.trim() === "") {
            alert("Rellena todas las casillas");
    } else if (!/^[a-zA-Z\s]*$/.test(nombre.value)) {
        alert("Por favor, rellena el nombre sin números"); 
    } else if (!/^[a-zA-Z\s]*$/.test(apellido.value)) {
        alert("Por favor, rellena el apellido sin números");
    } else if (!validarDNI(dni.value)) {
        alert("Por favor, rellena el DNI or NIE (Documento Nacional de Identidad) correcto.");
    } else if (!/^\d{9}$/.test(numeroTelefono.value)) {
        alert("Por favor, rellena un numero de telefono correcto (9 digitos)");
    } else if (!emailRegex.test(email.value)) {
        alert("Por favor, rellena con un email valido.");
    } else {
        // Comprobar que el dni o la combinacion-nombre apellido no existe en el localStorage
        const nombreRegistrado = localStorage.getItem("nombre") || "";
        const apellidoRegistrado = localStorage.getItem("apellido");
        const dniRegistrado = localStorage.getItem("dni")

        if (nombreRegistrado.toLowerCase() === nombre.value.toLowerCase() && 
            apellidoRegistrado.toLowerCase() === apellido.value.toLowerCase() ||
            dniRegistrado == dni.value)
            {
            alert("Esta persona ya esta registrada.") 
        } else {
            // Guardar en el localStorage
            localStorage.setItem("nombre", nombre.value);
            localStorage.setItem("apellido", apellido.value);
            localStorage.setItem("numeroTelefono", numeroTelefono.value);
            localStorage.setItem("email", email.value);
            localStorage.setItem("dni", dni.value);

            alert("Datos guardados correctamente.");
        }
     }
 });

limpiarButton.addEventListener("click", () => {
    // Limpiar los datos que hay en las casillas.
    userForm.reset();
});