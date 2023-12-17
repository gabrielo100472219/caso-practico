document.addEventListener("DOMContentLoaded", function() {
  cargarReseñas();
});

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

let contadorUsuarios = 1;
const maxUsuarios = 6;

function agregarReseña() {
  const reseñaInput = document.getElementById("reseña");
  const nuevaReseña = reseñaInput.value;

  if (nuevaReseña.trim() !== "" && contadorUsuarios <= maxUsuarios) {
    // Obtener el nombre de usuario con el contador
    const usuario = "Usuario " + contadorUsuarios;

    // Incrementar el contador
    contadorUsuarios++;

    // Construir la reseña con el nombre de usuario
    const reseñaConUsuario = usuario + ": " + nuevaReseña;

    // Mostrar la reseña en la lista y guardarla en la cookie
    agregarReseñaDOM(reseñaConUsuario);
    guardarReseñaEnCookie(reseñaConUsuario);

    // Limpiar el cuadro de texto
    reseñaInput.value = "";

    // Desactivar el cuadro de entrada después de alcanzar el límite
    if (contadorUsuarios > maxUsuarios) {
      reseñaInput.disabled = true;
    }
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


/*Función para borrar las cookies cuando se presiona la tecla F5 */
function borrarCookies() {
  // Borrar la cookie llamada "reseñas"
  document.cookie = "reseñas=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

window.addEventListener("keydown", function (e) {
  if (e.key === "F5") {
    borrarCookies();
  }
});


//Uso del menu de hamburguesa
var botonHamburguesa = document.getElementById('hamburguesa');
var menu = document.getElementById('container-links');
botonHamburguesa.addEventListener('click', function() {
  menu.classList.toggle('mostrar');
});


var botonhaztupedido = document.getElementById('boton_haz_tu_pedido');
botonhaztupedido.addEventListener('click', function() {
  window.location.href = 'hacerpedido.html';
});


var botonhaztupedidot = document.getElementById('boton_haz_tu_pedido_tablet');
botonhaztupedidot.addEventListener('click', function() {
  window.location.href = 'hacerpedido.html';
});