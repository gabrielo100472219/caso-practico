//Función para enviar un mensaje en la página informacion.
function enviarMensaje() {
    var nombre = document.getElementById('nombre').value;
    var email = document.getElementById('email').value;
    var mensaje = document.getElementById('mensaje').value;

    // Primero verificamos si los campos nombre, email y mensaje han sido introducidos. También verificamos si el email es correcto con la expresión regular /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!nombre || !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) || !mensaje) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Ahora verificamos si, con el mismo nombre o con el mismo email se ha comentado anteriormente, puesto que los datos los almacenamos en una cookie.
    if (yaHaComentado(nombre, email)) {
        alert('¡' + nombre + ' o ' + email + ' ya ha comentado sobre el restaurante! Inténtelo con otro nombre o correo electrónico.');
        return;
    }

    // Si todos los campos han sido introducidos y no hay ningún campo repetido anteriormente saldrá el pop-up con el siguiente mensaje:
    popup('¡Gracias por tu comentario, ' + nombre + '! Te enviaremos una respuesta a ' + email + ' sobre tu mensaje: ' + mensaje);

    //por último guardamos el comentario en una cookie.
    guardarComentario(nombre, email);
}


// Verificamos con la función yaHaComentado que el nombre o el email no ha comentado anteriormente.
function yaHaComentado(nombre, email) {
    var comentariosAnteriores = getCookie();
    return comentariosAnteriores.hasOwnProperty(nombre) || comentariosAnteriores.hasOwnProperty(email);
}

// Guardamos en una cookie el comentario introducido por el usuario.
function guardarComentario(nombre, email) {
    var comentariosAnteriores = getCookie();
    comentariosAnteriores[nombre] = true;
    comentariosAnteriores[email] = true;
    setCookie(comentariosAnteriores);
}

//set y get cookie
function getCookie() {
    var comentarios = {};
    var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)comentarios\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (cookieValue) {
        comentarios = JSON.parse(decodeURIComponent(cookieValue));
    }
    return comentarios;
}

function setCookie(comentarios) {
    var cookieString = 'comentarios=' + encodeURIComponent(JSON.stringify(comentarios)) + ';path=/';
    document.cookie = cookieString;
}

//Con esta funcion creamos el popup, que desaparecerá a los 3 segundos con la función setTimeout
function popup(mensaje) {
    var popup = document.getElementById('popup');
    popup.innerText = mensaje;
    popup.style.display = 'block';
    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000);
}

//Para limpiar las Cookies, presionamos la tecla F5
document.addEventListener('keydown', function(event) {
    if (event.key === 'F5') {
        limpiarCookies();
    }
});

function limpiarCookies() {
    document.cookie = 'comentarios=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}