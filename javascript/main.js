// Función para manejar el inicio de sesión
function gestionarInicioSesion() {
    const mensajeBienvenida = document.getElementById('welcome-message');
    const usuario = localStorage.getItem('username');

    if (usuario) {
        // Si ya hay un usuario, mostramos el mensaje de bienvenida
        mensajeBienvenida.innerHTML = `Bienvenido, ${usuario}!`;
    } else {
        // Si no hay usuario, mostramos el formulario de inicio de sesión con SweetAlert
        Swal.fire({
            title: 'Iniciar Sesión',
            html: `
                <input type="text" id="username" class="swal2-input" placeholder="Usuario">
                <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
            `,
            confirmButtonText: 'Entrar',
            focusConfirm: false,
            allowOutsideClick: false,
            preConfirm: () => {
                const nombreUsuario = document.getElementById('username').value;
                const contraseña = document.getElementById('password').value;

                if (!nombreUsuario || !contraseña) {
                    Swal.showValidationMessage('Por favor completa ambos campos');
                } else {
                    localStorage.setItem('username', nombreUsuario);
                    mensajeBienvenida.innerHTML = `Bienvenido, ${nombreUsuario}!`;
                }
            }
        });
    }
}

// Función para configurar el carrusel de juegos
function configurarCarrusel(juegos) {
    const imagenCarrusel = document.querySelector('.carousel-content img');
    const infoJuego = document.querySelector('.game-info');

    let indiceActual = 0;
    const juegosCarrusel = juegos.slice(0, 12);

    function actualizarCarrusel() {
        const juego = juegosCarrusel[indiceActual];
        imagenCarrusel.src = juego.background_image;
        infoJuego.querySelector('h3').textContent = juego.name;
        infoJuego.querySelector('p').textContent = juego.genres.map(genre => genre.name).join(', ') || "Categorías no disponibles";

        document.body.style.backgroundImage = `url(${juego.background_image})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        indiceActual = (indiceActual + 1) % juegosCarrusel.length;
    }

    setInterval(actualizarCarrusel, 5000);
    actualizarCarrusel();
}

// Función para mostrar los juegos adicionales
function mostrarJuegosAdicionales(juegos) {
    const contenedorJuegos = document.querySelector('.games-container');
    const otrosJuegos = juegos.slice(12, 18);

    otrosJuegos.forEach(juego => {
        const itemJuego = document.createElement('div');
        itemJuego.classList.add('game-item');
        itemJuego.innerHTML = `
            <img src="${juego.background_image}" alt="${juego.name}" style="width: 100%; height: auto; border-radius: 0.5rem;">
            <h4>${juego.name}</h4>
            <p>${juego.genres.map(genre => genre.name).join(', ')}</p>
        `;
        contenedorJuegos.appendChild(itemJuego);
    });
}

// Función para obtener los datos de los juegos
function obtenerJuegos() {
    fetch('https://api.rawg.io/api/games?key=0f17cb5e138b45619507646513477518')
        .then(response => response.json())
        .then(data => {
            const juegos = data.results;

            // Configuramos el carrusel y mostramos los juegos adicionales
            configurarCarrusel(juegos);
            mostrarJuegosAdicionales(juegos);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

// Iniciamos todo cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
    gestionarInicioSesion(); // Manejo de inicio de sesión
    obtenerJuegos(); // Llamada a la API y configuración del contenido
});
