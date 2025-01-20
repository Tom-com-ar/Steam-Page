// Variables globales
const biblioteca = JSON.parse(localStorage.getItem('biblioteca')) || []; // Cargar juegos de la biblioteca
const body = document.body;
const gameTitle = document.getElementById('game-title');
const carruselContainer = document.getElementById('carrusel-container');
const carruselWrapper = document.getElementById('carrusel-items-wrapper');
let currentIndex = 0;

console.log(biblioteca);

// Función para actualizar el fondo, título y resaltar el juego activo
function actualizarFondoYTitulo() {
    // Si no hay juegos en la biblioteca, muestra mensaje y quita el carrusel
    if (biblioteca.length === 0) {
        body.style.backgroundImage = ''; // Elimina el fondo
        gameTitle.textContent = 'No tienes juegos en tu biblioteca.'; // Mensaje de no juegos
        carruselContainer.innerHTML = ''; // Elimina el carrusel
        return;
    }

    const juegoActivo = biblioteca[currentIndex]; // Juego activo en la biblioteca
    body.classList.add('fade'); // Agrega animación de fade
    setTimeout(() => {
        body.style.backgroundImage = `url('${juegoActivo.imagen}')`; // Cambia el fondo por la imagen del juego activo
        body.classList.remove('fade'); // Elimina la animación
    }, 300); // Tiempo de animación
    body.style.backgroundSize = 'cover'; // Ajusta el tamaño del fondo
    body.style.backgroundPosition = 'center'; // Centra el fondo
    gameTitle.textContent = juegoActivo.nombre; // Muestra el nombre del juego activo

    actualizarCarrusel(); // Actualiza el carrusel con el juego seleccionado
}

// Función para actualizar el carrusel con las previsualizaciones
function actualizarCarrusel() {
    carruselWrapper.innerHTML = ''; // Limpia el carrusel antes de agregar nuevos elementos

    biblioteca.forEach((juego, index) => {
        const juegoElemento = document.createElement('div'); // Crea un contenedor para cada juego en el carrusel
        juegoElemento.classList.add('carrusel-item');
        if (index === currentIndex) {
            juegoElemento.classList.add('activo'); // Resalta el juego seleccionado
        }
        juegoElemento.style.backgroundImage = `url('${juego.imagen}')`; // Asigna la imagen de fondo del juego

        // Crea la previsualización del juego
        const previsualizacion = document.createElement('div');
        previsualizacion.classList.add('previsualizacion');
        const img = document.createElement('img');
        img.src = juego.imagen; // Usamos la misma imagen para la previsualización
        previsualizacion.appendChild(img);

        juegoElemento.appendChild(previsualizacion);
        carruselWrapper.appendChild(juegoElemento); // Añade el juego al carrusel
    });

    // Asegura que solo se vean 7 juegos en el carrusel al inicio
    carruselWrapper.style.transform = `translateX(-${currentIndex * 135}px)`; // Mueve el carrusel
}

// Función para mover el carrusel con las flechas del teclado
function moverCarrusel(event) {
    if (biblioteca.length === 0) return; // Si no hay juegos, no hace nada

    // Si se presiona la flecha derecha, pasa al siguiente juego
    if (event.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % biblioteca.length; // Avanza al siguiente juego
    }

    // Si se presiona la flecha izquierda, retrocede al juego anterior
    if (event.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + biblioteca.length) % biblioteca.length; // Retrocede al juego anterior
    }

    actualizarFondoYTitulo(); // Actualiza el fondo y el título según el juego seleccionado
}

// Agregar el evento para mover el carrusel con las flechas del teclado
document.addEventListener('keydown', moverCarrusel);

// Ejecuta la función al cargar la página
document.addEventListener('DOMContentLoaded', actualizarFondoYTitulo);
