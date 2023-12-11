/*Función para reservar mesa en el restaurante, con esta función se checkea la hora seleccionada, el nombre del usuario y se hace la reserva apareciendo un pop up */
function reservarMesa() {
  var horaSeleccionada = document.getElementById('desple').value;
  var nombre = document.getElementById('name').value;
  var comensales = document.getElementById('com').value;

  // Validar que el campo nombre tenga un valor
  if (!nombre) {
      alert('Por favor, ingresa tu nombre.');
      return;
  }

  // Validar que el campo comensales tenga al menos 1 persona
  if (isNaN(comensales) || comensales < 1) {
      alert('Por favor, ingresa un número válido de comensales (mínimo 1).');
      return;
  }

  var reservas = obtenerReservas();
  if (reservas.hasOwnProperty(horaSeleccionada)) {
      alert('¡Esta hora ya está reservada por ' + reservas[horaSeleccionada] + '!');
  } else {
      reservas[horaSeleccionada] = nombre;
      guardarReservas(reservas);
      alert(nombre + ' ha reservado mesa a las ' + horaSeleccionada + ' para ' + comensales + ' comensales!');
  }
}

/*Funciones para guardar las reservas en cookies */
function obtenerReservas() {
    var reservas = {};
    var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)reservas\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (cookieValue) {
        reservas = JSON.parse(decodeURIComponent(cookieValue));
    }
    return reservas;
}

function guardarReservas(reservas) {
    var cookieString = 'reservas=' + encodeURIComponent(JSON.stringify(reservas)) + ';path=/';
    document.cookie = cookieString;
}

/*Función y EventListener para borrar las cookies al refrescar la página con la tecla F5*/

document.addEventListener('keydown', function(event) {
    if (event.key === 'F5') {
      limpiarCookies();
    }
});

function limpiarCookies() {
    document.cookie = 'reservas=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}