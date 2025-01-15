document.addEventListener("DOMContentLoaded", function () {
    const mensajeBienvenida = document.getElementById('welcome-message');

    const usuario = localStorage.getItem('username');

    // Si ya hay un nombre de usuario, mostrar el mensaje de bienvenida
    if (usuario) {
        mensajeBienvenida.innerHTML = `Bienvenido, ${usuario}!`;
    } else {
        // Mostrar SweetAlert solo si no hay usuario guardado
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
                    // Guardar el nombre de usuario en el localStorage
                    localStorage.setItem('username', nombreUsuario);

                    // Actualizar el mensaje de bienvenida
                    mensajeBienvenida.innerHTML = `Bienvenido, ${nombreUsuario}!`;
                }
            }
        });
    }

    fetch('https://api.rawg.io/api/games?key=0f17cb5e138b45619507646513477518')
    
        .then(response => response.json())
        .then(data => {
            
            const juegos = data.results;
            const imagenCarrusel = document.querySelector('.carousel-content img');
            const infoJuego = document.querySelector('.game-info');
            const contenedorJuegos = document.querySelector('.games-container');

            let indiceActual = 0;

            const juegosCarrusel = juegos.slice(0, 12); 
            const otrosJuegos = juegos.slice(12,18);

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

            // Mostrar 6 juegos en el contenedor
            otrosJuegos.forEach(juego => {
                const itemJuego = document.createElement('div');
                itemJuego.classList.add('game-item');
                itemJuego.innerHTML = `
                    <img src="${juego.background_image}" alt="${juego.name}" style="width: 100%; height: auto; border-radius: 0.5rem;">
                    <h4>${juego.name}</h4>
                    <p>${juego.genres.map(genre => genre.name).join(', ')}</p>
                    <button class="buy-button">Comprar</button>
                `;
                contenedorJuegos.appendChild(itemJuego);
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
});
