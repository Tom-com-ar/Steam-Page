// Función para manejar el inicio de sesión
function gestionarInicioSesion() {
    const mensajeBienvenida = document.getElementById('welcome-message');
    const usuario = localStorage.getItem('username'); // Obtener el nombre del usuario guardado

    if (usuario) {
        // Si ya hay un usuario guardado, mostrar el mensaje de bienvenida
        mensajeBienvenida.innerHTML = `Bienvenido, ${usuario}!`;
    } else {
        // Si no hay usuario guardado, mostrar formulario de inicio de sesión
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
                    localStorage.setItem('username', nombreUsuario); // Guardar el nombre de usuario
                    mensajeBienvenida.innerHTML = `Bienvenido, ${nombreUsuario}!`; // Mostrar bienvenida
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
    const juegosCarrusel = juegos.slice(0, 12); // Limitar a los primeros 12 juegos

    function actualizarCarrusel() {
        const juego = juegosCarrusel[indiceActual];
        imagenCarrusel.src = juego.background_image; // Actualizar la imagen del carrusel
        infoJuego.querySelector('h3').textContent = juego.name; // Nombre del juego
        infoJuego.querySelector('p').textContent = juego.genres.map(genre => genre.name).join(', ') || "Categorías no disponibles"; // Géneros del juego

        document.body.style.backgroundImage = `url(${juego.background_image})`; // Fondo con la imagen del juego
        document.body.style.backgroundSize = "cover"; // Ajustar el tamaño del fondo
        document.body.style.backgroundPosition = "center"; // Centrar el fondo

        // Avanzar al siguiente juego del carrusel
        indiceActual = (indiceActual + 1) % juegosCarrusel.length;
    }

    setInterval(actualizarCarrusel, 5000); // Actualizar cada 5 segundos
    actualizarCarrusel(); // Llamar por primera vez para inicializar
}

// Función para mostrar los juegos adicionales
function mostrarJuegosAdicionales(juegos) {
    const contenedorJuegos = document.querySelector('.games-container');
    const otrosJuegos = juegos.slice(12, 18); // Mostrar juegos adicionales (del 13 al 18)

    otrosJuegos.forEach(juego => {
        const itemJuego = document.createElement('div');
        itemJuego.classList.add('game-item');
        itemJuego.innerHTML = `
            <img src="${juego.background_image}" alt="${juego.name}" style="width: 100%; height: auto; border-radius: 0.5rem;">
            <h4>${juego.name}</h4>
            <p>${juego.genres.map(genre => genre.name).join(', ')}</p>
        `;
        contenedorJuegos.appendChild(itemJuego); // Añadir cada juego al contenedor
    });
}

// Función para obtener los datos de los juegos desde la API
function obtenerJuegos() {
    fetch('https://api.rawg.io/api/games?key=0f17cb5e138b45619507646513477518')
        .then(response => response.json()) // Parsear la respuesta a JSON
        .then(data => {
            const juegos = data.results; // Guardar los resultados de los juegos

            // Configuramos el carrusel y mostramos los juegos adicionales
            configurarCarrusel(juegos);
            mostrarJuegosAdicionales(juegos);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error); // En caso de error
        });
}

// Ejecutar todo cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function () {
    gestionarInicioSesion(); // Manejo de inicio de sesión
    obtenerJuegos(); // Llamada a la API y configuración del contenido
});
