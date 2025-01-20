/*BUY.HTML*/

// Variables globales
const barraBusqueda = document.getElementById('search-bar');
const contenedorCatalogo = document.getElementById('catalogo-container');
const botonFiltro = document.getElementById('filter-button');
const modalFiltro = document.getElementById('filter-modal');
const cerrarModal = document.getElementById('close-modal');
const botonAplicarFiltros = document.getElementById('apply-filters');
const filtroGenero = document.getElementById('genre-filter');
const filtroPrecioMin = document.getElementById('price-min');
const filtroPrecioMax = document.getElementById('price-max');
const todosjuegos = document.getElementById('todosjuegos');
const carritoButton = document.getElementById('carrito-button');  // Botón del carrito
const carritoContainer = document.getElementById('cart-modal'); // Contenedor del carrito
const cerrarCarritoBtn = document.getElementById('close-cart'); // Botón para cerrar el carrito (la "X")

let todosLosJuegos = [];
let juegosFiltrados = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];  // Cargar carrito desde localStorage
let paginaActual = 1;

// Funciones globales

// Función para agregar los botones de compra a los juegos en el catálogo
function agregarBotonesCompra() {
    const botonesCompra = document.querySelectorAll('.buy-button');
    botonesCompra.forEach(boton => {
        boton.addEventListener('click', function () {
            const id = this.dataset.id;
            const nombre = this.dataset.nombre;
            const precio = this.dataset.precio;
            const imagen = this.dataset.imagen;
            manejarCompra(id, nombre, precio, imagen);
        });
    });
}

// Función para mostrar los juegos en el catálogo
function mostrarJuegos(juegos) {
    const contenedorCatalogo = document.getElementById('catalogo-container');
    contenedorCatalogo.innerHTML = '';  // Limpiar el contenido previo
    juegos.forEach(juego => {
        // Crear un nuevo contenedor para cada juego
        const itemJuego = document.createElement('div');
        itemJuego.classList.add('game-item');
        itemJuego.innerHTML = `
            <div class="game-image" style="background-image: url('${juego.background_image}');"></div>
            <div class="game-details">
                <h4>${juego.name}</h4>
                <p>${juego.genres.map(genre => genre.name).join(', ')}</p>
                <p><strong>Precio: $${juego.price}</strong></p>
                <button class="buy-button" data-id="${juego.id}" data-nombre="${juego.name}" data-precio="${juego.price}" data-imagen="${juego.background_image}">Comprar<span class="arrow">&#8594;</span></button>
            </div>
        `;
        contenedorCatalogo.appendChild(itemJuego);
    });

    // Agregar los event listeners a los botones de compra
    agregarBotonesCompra();
}

// Función para manejar la compra de un juego
function manejarCompra(id, nombre, precio, imagen) {
    let biblioteca = JSON.parse(localStorage.getItem('biblioteca')) || [];  // Cargar la biblioteca desde localStorage

    // Comprobar si el juego ya está en la biblioteca
    if (biblioteca.some(item => item.id === id)) {
        Swal.fire({
            title: '¡Ya tienes este juego en tu biblioteca!',
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    } else if (carrito.some(item => item.id === id)) {
        // Si el juego ya está en el carrito
        Swal.fire({
            title: '¡Este juego ya está en el carrito!',
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    } else {
        // Agregar el juego al carrito
        carrito.push({ id, nombre, precio, imagen });

        // Guardar carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Actualizamos la vista del carrito
        mostrarCarrito();

        // Mostrar notificación de éxito
        Swal.fire({
            position: 'top-end',
            title: '¡Juego agregado al carrito!',
            text: `${nombre} se ha añadido con éxito.`,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const carritoContainer = document.getElementById('cart-modal');
    const carritoContenedor = document.getElementById('cart-items');
    carritoContenedor.innerHTML = '';  // Limpiar el contenido del carrito

    if (carrito.length === 0) {
        carritoContainer.style.display = 'none';  // Si el carrito está vacío, ocultarlo
        Swal.fire({
            position: 'top-end',
            title: 'Carrito vacío',
            text: 'No tienes ningún juego en el carrito.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    } else {
        carritoContainer.style.display = 'block';  // Mostrar el carrito si no está vacío

        carrito.forEach((juego, index) => {
            // Crear un contenedor para cada juego en el carrito
            const juegoCarrito = document.createElement('div');
            juegoCarrito.classList.add('carrito-item');
            juegoCarrito.innerHTML = `
                <div class="carrito-item-img" style="background-image: url('${juego.imagen}');"></div>
                <p>${juego.nombre} - $${juego.precio}</p>
                <button class="eliminar-item" data-index="${index}">Eliminar</button>
            `;
            carritoContenedor.appendChild(juegoCarrito);
        });

        // Crear un botón para finalizar la compra
        let biblioteca = JSON.parse(localStorage.getItem('biblioteca')) || [];
        const finalizarCompraBtn = document.createElement('button');
        finalizarCompraBtn.id = 'finalizar-compra';
        finalizarCompraBtn.textContent = 'Finalizar Compra';
        finalizarCompraBtn.classList.add('finalizar-compra-btn');
        carritoContenedor.appendChild(finalizarCompraBtn);

        // Función para finalizar la compra
        finalizarCompraBtn.addEventListener('click', function () {
            // Agregar los juegos comprados a la biblioteca
            biblioteca.push(...carrito);
        
            // Guardar la biblioteca actualizada en localStorage
            localStorage.setItem('biblioteca', JSON.stringify(biblioteca));
        
            Swal.fire({
                position: 'top-end',
                title: '¡Gracias por tu compra!',
                text: 'Tu compra ha sido finalizada.',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                carrito = [];  // Vaciar el carrito
                localStorage.removeItem('carrito');  // Remover el carrito del localStorage
                carritoContenedor.innerHTML = '<p style="color: black;">Gracias por tu compra. Tu carrito está vacío.</p>';
            });
        });

        // Función para eliminar un juego del carrito
        const botonesEliminar = document.querySelectorAll('.eliminar-item');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', function () {
                const index = this.dataset.index;
                carrito.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();  // Volver a mostrar el carrito actualizado
            });
        });
    }
}

// Función para cargar más juegos al catálogo
const juegosPorPagina = 30;
const juegosDeseados = 350;

function cargarMasJuegos() {
    let juegosCargados = 0;
    let juegosTotales = [];

    // Mostrar el mensaje de carga
    const loadingContainer = document.getElementById('loading-container');
    loadingContainer.style.display = 'block';

    // Función para cargar juegos en paralelo
    function cargarJuegosEnParalelo() {
        const promesas = [];
        let paginasNecesarias = Math.ceil(juegosDeseados / juegosPorPagina);

        for (let i = 1; i <= paginasNecesarias; i++) {
            promesas.push(fetch(`https://api.rawg.io/api/games?key=0f17cb5e138b45619507646513477518&page=${i}&page_size=${juegosPorPagina}`)
                .then(response => response.json())
                .then(data => {
                    const juegosConPrecio = data.results.map(juego => ({
                        ...juego,
                        price: (Math.random() * (70 - 10) + 10).toFixed(2)  // Asignar un precio aleatorio
                    }));

                    // Concatenar los nuevos juegos cargados
                    juegosTotales = juegosTotales.concat(juegosConPrecio);
                    juegosCargados += juegosConPrecio.length;

                    // Mostrar los juegos a medida que se cargan
                    mostrarJuegos(juegosTotales.slice(0, juegosCargados));
                })
                .catch(error => {
                    console.error('Error al obtener los datos:', error);
                }));
        }

        // Esperar a que todas las promesas se resuelvan
        Promise.all(promesas).then(() => {
            // Ocultar el mensaje de carga después de 7.5 segundos
            setTimeout(() => {
                loadingContainer.style.display = 'none';
            }, 7500);
        });
    }

    cargarJuegosEnParalelo();
}

// Filtrado de juegos
botonFiltro.addEventListener('click', () => {
    modalFiltro.style.display = 'block';
});

cerrarModal.addEventListener('click', () => {
    modalFiltro.style.display = 'none';
});

// Filtrar juegos por género y precio
botonAplicarFiltros.addEventListener('click', () => {
    const filtroGeneroSeleccionado = filtroGenero.value;
    const precioMin = parseFloat(filtroPrecioMin.value) || 0;
    const precioMax = parseFloat(filtroPrecioMax.value) || Infinity;

    juegosFiltrados = todosLosJuegos.filter(juego => {
        const estaEnRangoDePrecio = juego.price >= precioMin && juego.price <= precioMax;
        const coincideGenero = filtroGeneroSeleccionado ? juego.genres.some(genre => genre.name === filtroGeneroSeleccionado) : true;
        return estaEnRangoDePrecio && coincideGenero;
    });

    mostrarJuegos(juegosFiltrados);
    modalFiltro.style.display = 'none';
});


// Listeners y manipulación del DOM
document.addEventListener('DOMContentLoaded', function () {
    barraBusqueda.addEventListener('input', function () {
        buscarJuegos(barraBusqueda.value);
    });

    carritoButton.addEventListener('click', function () {
        const carritoContainer = document.getElementById('cart-modal');
        carritoContainer.style.display = carritoContainer.style.display === 'block' ? 'none' : 'block';
        mostrarCarrito();
    });

    cerrarCarritoBtn.addEventListener('click', function () {
        const carritoContainer = document.getElementById('cart-modal');
        carritoContainer.style.display = 'none';
    });

    botonFiltro.addEventListener('click', function () {
        modalFiltro.style.display = 'block';
    });

    cerrarModal.addEventListener('click', function () {
        modalFiltro.style.display = 'none';
    });

    cargarMasJuegos();
    mostrarCarrito();
});
