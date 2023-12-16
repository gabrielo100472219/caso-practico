document.addEventListener("DOMContentLoaded", function() {
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
const anteriorBoton23 = document.getElementById("boton-anterior-2-3"); // Botón "Siguiente Paso de 2 a 3"
const anteriorBoton3 = document.getElementById("boton-anterior-3"); // Botón "Siguiente Paso de 2 a 3"
const pasosBarraSup = document.getElementById("barra-superior-pasos"); // Barra de progreso

    
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

function retrocederSegundoPaso() {
    paso3.style.display = "none"; // Ocultar Paso 3
    paso2.style.display = "block"; // Mostrar Paso 2

    // Actualizar la barra de progreso para el Paso 2
    pasosBarraSup.children[3].classList.remove("cambio-azul");
    pasosBarraSup.children[4].classList.remove("cambio-azul");
}

// Agregar oyente de evento al botón "Anterior Paso 3"
anteriorBoton3.addEventListener("click", function () {
    retrocederSegundoPaso();
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

function retrocederPrimerPaso() {
    paso2.style.display = "none"; // Ocultar Paso 2
    paso1.style.display = "block"; // Mostrar Paso 1

    // Actualizar la barra de progreso para el Paso 1
    pasosBarraSup.children[1].classList.remove("cambio-azul");
    pasosBarraSup.children[2].classList.remove("cambio-azul");
}

// Agregar oyente de evento al botón "Anterior Paso 2"
anteriorBoton23.addEventListener("click", function () {
    retrocederPrimerPaso();
});


//Función para validar la tarjeta de crédito, donde comprobamos con expresiones regulares que el número de la tarjeta tenga 16 dígitos, la fecha se escriba MM/YY y el número CVV tenga 3 números.
function validarTarjeta() {
    var numeroTarjeta = document.getElementById('tarjeta-credito').value.replace(/\s/g, ''); 
    var fechaVencimiento = document.getElementById('vencimiento').value;
    var cvv = document.getElementById('cvv').value;
    // Expresiones regulares para validar los distintos campos.
    var regexNumeroTarjeta = /^\d{16}$/;
    var regexFechaVencimiento = /^(0[1-9]|1[0-2])\/(2[4-9]|2[0-9])$/;
    var regexCVV = /^\d{3}$/;
    // Validamos que los campos sean válidos, en caso de que no lo sea saldrá un mensaje de error y habrá que introducir un valor válido.
    if (!regexNumeroTarjeta.test(numeroTarjeta)) {
        alert('Ingrese un número de tarjeta válido.');
        return;
    }
    if (!regexFechaVencimiento.test(fechaVencimiento)) {
        alert('Ingrese una fecha de vencimiento válida (MM/YY).');
        return;
    }
    if (!regexCVV.test(cvv)) {
        alert('Ingrese un código CVV válido (3 dígitos).');
        return;
    }
    // Si todo está bien, aparece una alareta de que puedes ver el estado del pedido pulsando el botón de siguiente paso que aparecerá al pulsar el botón de pagar.
    alert('¡Pago aceptado! Puedes ver el estado de tu pedido pulsando el botón "Siguiente paso"');
    document.getElementById('boton-siguiente-2-3').style.display = 'block';
}