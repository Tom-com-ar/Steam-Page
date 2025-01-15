document.addEventListener("DOMContentLoaded", function () {
    fetch('https://api.rawg.io/api/games?key=0f17cb5e138b45619507646513477518')
        .then(response => response.json())
        .then(data => {
            const games = data.results;
            let currentIndex = 0;

            function updateCarousel() {
                const carouselImg = document.querySelector('.carousel-content img');
                const gameInfo = document.querySelector('.game-info');

                const game = games[currentIndex];
                carouselImg.src = game.background_image;  // Imagen del juego
                gameInfo.querySelector('h3').textContent = game.name;  // Nombre del juego

                // Mostrar las categorías
                const genres = game.genres.map(genre => genre.name).join(', ');
                gameInfo.querySelector('p').textContent = genres || "Categorías no disponibles";  // Categorías del juego

                // Cambiar el fondo de la página
                document.body.style.backgroundImage = `url(${game.background_image})`;
                document.body.style.backgroundSize = "cover";  // Asegura que la imagen ocupe toda la pantalla
                document.body.style.backgroundPosition = "center";  // Centra la imagen

                currentIndex = (currentIndex + 1) % games.length;
            }

            setInterval(updateCarousel, 5000);  // Cambiar cada 5 segundos
            updateCarousel();  // Llamada inicial para mostrar la primera imagen
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
});
