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

//Uso del menu de hamburguesa
var botonHamburguesa = document.getElementById('hamburguesa');
var menu = document.getElementById('container-links');
botonHamburguesa.addEventListener('click', function() {
  menu.classList.toggle('mostrar');
});