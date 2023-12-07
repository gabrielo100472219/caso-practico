document.addEventListener("DOMContentLoaded", function() {
  cargarReseñas();
  cargarSeleccionesDeLocalStorage();
});

//Constantes para HACER PEDIDO
const anadirBoton = document.querySelectorAll(".boton-suma"); // Botones para agregar productos
const restarBoton = document.querySelectorAll(".boton-resta"); // Botones para quitar productos
const productoCantidades = document.querySelectorAll(".cantidad-producto"); // Cantidad de cada producto
const productoContador = document.getElementById("contador-superior-elementos"); // Contador de artículos
const productContainers = document.querySelectorAll(".producto"); // Contenedores de productos
const precioTotalProductos = document.getElementById("precio-total-cantidad"); // Elemento para el precio total
const paso1 = document.getElementById("paso-1"); // Paso 1
const paso2 = document.getElementById("paso-2"); // Paso 2
const paso3 = document.getElementById("paso-3"); // Paso 3
const siguienteBoton12 = document.getElementById("boton-siguiente-1-2"); // Botón "Siguiente Paso de 1 a 2"
const siguienteBoton23 = document.getElementById("boton-siguiente-2-3"); // Botón "Siguiente Paso de 2 a 3"
const pasosBarraSup = document.getElementById("barra-superior-pasos"); // Barra de progreso


//Constantes para el registro de usuario
const userForm = document.getElementById("userForm");
const enviarButton = document.getElementById("enviarButton");
const cancelarButton = document.getElementById("cancelarButton");
const limpiarButton = document.getElementById("limpiarButton");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//Funciones para el registro de usuario
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

            // Limpiar si esta bien
            userForm.reset();
        }
    }
});

cancelarButton.addEventListener("click", () => {
    // Cerrar la pantalla.
    window.close();
});

limpiarButton.addEventListener("click", () => {
    // Limpiar los datos que hay en las casillas.
    userForm.reset();
});


//Pasos y funciones de HACER PEDIDO
// Establecer el estilo de la barra de progreso para el Paso 1
pasosBarraSup.children[0].classList.add("cambio-azul");
let totalElementos = 0; // Inicializar el contador de artículos

// Función para aumentar la cantidad de productos
function incrementarCantidadProducto(index) {
    const cantidadProducto = productoCantidades[index];
    const cantidadActual = parseInt(cantidadProducto.innerText);
    cantidadProducto.innerText = cantidadActual + 1;
    restarBoton[index].style.display = "block"; // Mostrar el botón de eliminar
    actualizarTotalElementos(1); // Actualizar el contador de artículos
    guardarSeleccionEnLocalStorage();
}

// Función para disminuir la cantidad de productos
function disminuirCantidadProducto(index) {
    const cantidadProducto = productoCantidades[index];
    const cantidadActual = parseInt(cantidadProducto.innerText);
    if (cantidadActual > 0) { //Parar de restar cuando la cantidad es 0
        cantidadProducto.innerText = cantidadActual - 1;
        actualizarTotalElementos(-1); // Actualizar el contador de artículos solo si había productos
        guardarSeleccionEnLocalStorage();
    }
}

function guardarSeleccionEnLocalStorage() {
  const selecciones = Array.from(productoCantidades).map(cantidad => cantidad.innerText);
  localStorage.setItem('seleccionesMenu', JSON.stringify(selecciones));
}

// Función para actualizar el contador de artículos
function actualizarTotalElementos(change) {
    totalElementos += change;
    productoContador.innerText = totalElementos;
}

// Función para actualizar el precio total
function actualizarTotalPrecio() {
  let precioTotal = 0;

  productContainers.forEach((container) => {
      const cantidad = parseInt(container.querySelector(".cantidad-producto").textContent);
      const price = parseFloat(container.getAttribute("data-precio"));

      // Update precioTotal based on the quantity and price of the current product
      precioTotal += cantidad * price;
  });

  // Display the total quantity and total price in the #precio-total-cantidad element
  precioTotalProductos.textContent = `${precioTotal.toFixed(2)}€`;
}

// Función para iniciar el temporizador
function empezarTemporizador(durazion) {
    // Obtener el elemento del temporizador y la barra de progreso
    const temporizadorEl = document.getElementById("contador");
    const barraProgresoEl = document.querySelector(".progreso-pedido");

    let contador = durazion; // Duración en milisegundos
    let minutos, segundos;

    // Configurar un intervalo que se ejecutará cada segundo
    const interval = setInterval(function () {
        minutos = parseInt(contador / 60000, 10); // Calcular los minutos restantes
        segundos = parseInt((contador % 60000) / 1000, 10); // Calcular los segundos restantes

        // Formatear minutos y segundos para mostrar en el temporizador
        minutos = minutos < 10 ? "0" + minutos : minutos;
        segundos = segundos < 10 ? "0" + segundos : segundos;

        // Actualizar el contenido del elemento del temporizador
        temporizadorEl.textContent = minutos + ":" + segundos;

        // Calcular y actualizar el progreso en la barra de progreso
        const progress = ((durazion - contador) / durazion) * 100;
        barraProgresoEl.style.width = `${progress}%`;

        if (contador <= 0) {
            clearInterval(interval); // Detener el intervalo cuando el temporizador llega a cero
            barraProgresoEl.style.width = "100%"; // Asegurarse de que la barra de progreso esté completa
            temporizadorEl.textContent = "¡El pedido ha llegado!";
        }

        contador -= 1000; // Decrementar el temporizador en 1 segundo (1000 milisegundos)
    }, 1000); // El intervalo se ejecuta cada segundo (1000 milisegundos)
}


// Función para pasar al Paso 2
function cambiarSegundoPaso() {
    // Ocultar Paso 1
    paso1.style.display = "none";

    // Mostrar Paso 2
    paso2.style.display = "block";
    pasosBarraSup.children[1].classList.add("cambio-azul");
    pasosBarraSup.children[2].classList.add("cambio-azul");

    //Calcular el precio total
    actualizarTotalPrecio();

    // Recopilar los nombres de productos seleccionados
    const elementosSeleccionados = [];
    productContainers.forEach((container) => {
        const nombreProducto = container.querySelector("h2").textContent;
        const cantidad = container.querySelector(".cantidad-producto").textContent;
        if (parseInt(cantidad) > 0) {
            elementosSeleccionados.push(`${nombreProducto} - Cantidad: ${cantidad}`);
        }
    });

    // Mostrar la lista en el Paso 2
    const elementosSeleccionadosLista = document.getElementById("lista-productos-seleccionados"); // Obtener el elemento de la lista de elementos
    // Recorrer la lista de elementos seleccionados
    elementosSeleccionados.forEach((item) => {
        const listItem = document.createElement("li"); // Crear un nuevo elemento <li> para cada elemento seleccionado
        listItem.textContent = item; // Asignar el contenido de texto del <li> con el elemento seleccionado
        elementosSeleccionadosLista.appendChild(listItem); // Agregar el <li> al elemento de la lista de elementos seleccionados
    });
}

// Función para pasar al Paso 3
function cambiarTercerPaso() {
    paso2.style.display = "none"; // Ocultar Paso 2
    paso3.style.display = "block"; // Mostrar Paso 3

    // Actualizar la barra de progreso para el Paso 3
    pasosBarraSup.children[3].classList.add("cambio-azul");
    pasosBarraSup.children[4].classList.add("cambio-azul");

    // Iniciar el temporizador durante 10 minutos (600,000 milisegundos)
    empezarTemporizador(600000);
}

// Agregar oyentes de eventos a los botones "Agregar" de los productos
anadirBoton.forEach((button, index) => {
    button.addEventListener("click", function () {
        incrementarCantidadProducto(index);
    });
});

// Agregar oyentes de eventos a los botones "Eliminar" de los productos
restarBoton.forEach((button, index) => {
    button.addEventListener("click", function () {
        disminuirCantidadProducto(index);
    });
});

// Agregar oyente de evento al botón "Siguiente Paso"
siguienteBoton12.addEventListener("click", function () {
    cambiarSegundoPaso();
});

// Agregar oyente de evento al botón "Siguiente Paso 2"
siguienteBoton23.addEventListener("click", function () {
    cambiarTercerPaso();
});

function cargarSeleccionesDeLocalStorage() {
  const seleccionesGuardadas = JSON.parse(localStorage.getItem('seleccionesMenu'));
  if (seleccionesGuardadas) {
      seleccionesGuardadas.forEach((cantidad, index) => {
          productoCantidades[index].innerText = cantidad;
          actualizarTotalElementos(parseInt(cantidad)); // Update the total count
      });
      actualizarTotalPrecio(); // Update the total price
  }
}
function cargarReseñas() {
  const reseñasList = document.getElementById("reseñas-list");
  const storedReseñas = getCookie("reseñas");

  if (storedReseñas) {
    const reseñas = JSON.parse(storedReseñas);
    reseñas.forEach(function(reseña) {
      agregarReseñaDOM(reseña);
    });
  }
}

function agregarReseña() {
  const reseñaInput = document.getElementById("reseña-input");
  const nuevaReseña = reseñaInput.value;

  if (nuevaReseña.trim() !== "") {
    // Obtener el nombre de usuario (puedes implementar tu propio sistema de autenticación)
    const usuario = "Usuario"; // Puedes cambiar esto según tus necesidades

    // Construir la reseña con el nombre de usuario
    const reseñaConUsuario = usuario + ": " + nuevaReseña;

    // Mostrar la reseña en la lista y guardarla en la cookie
    agregarReseñaDOM(reseñaConUsuario);
    guardarReseñaEnCookie(reseñaConUsuario);

    // Limpiar el cuadro de texto
    reseñaInput.value = "";
  }
}

function agregarReseñaDOM(reseña) {
  const reseñasList = document.getElementById("reseñas-list");
  const reseñaElement = document.createElement("div");
  reseñaElement.textContent = reseña;
  reseñasList.appendChild(reseñaElement);
}

function guardarReseñaEnCookie(reseña) {
  const storedReseñas = getCookie("reseñas");
  const reseñas = storedReseñas ? JSON.parse(storedReseñas) : [];
  reseñas.push(reseña);
  setCookie("reseñas", JSON.stringify(reseñas), 30);
}

function getCookie(nombre) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === nombre) {
      return decodeURIComponent(value);
    }
  }
  return "";
}

function setCookie(nombre, valor, días) {
  const fechaExpiracion = new Date();
  fechaExpiracion.setTime(fechaExpiracion.getTime() + días * 24 * 60 * 60 * 1000);
  const expires = "expires=" + fechaExpiracion.toUTCString();
  document.cookie = nombre + "=" + encodeURIComponent(valor) + "; " + expires + "; path=/";
}


