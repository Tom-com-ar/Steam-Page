
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
const juegosPorPagina = 30;

// Funciones globales



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

function mostrarJuegos(juegos) {
    const contenedorCatalogo = document.getElementById('catalogo-container');
    contenedorCatalogo.innerHTML = '';
    juegos.forEach(juego => {
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

function manejarCompra(id, nombre, precio, imagen) {
    if (carrito.some(item => item.id === id)) {
        Swal.fire({
            title: '¡Este juego ya está en el carrito!',
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    } else {
        carrito.push({ id, nombre, precio, imagen });

        // Guardar carrito en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Actualizamos la vista del carrito
        mostrarCarrito();

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

function mostrarCarrito() {
    const carritoContainer = document.getElementById('cart-modal');
    const carritoContenedor = document.getElementById('cart-items');
    carritoContenedor.innerHTML = '';

    if (carrito.length === 0) {
        carritoContainer.style.display = 'none';
        Swal.fire({
            position: 'top-end',
            title: 'Carrito vacío',
            text: 'No tienes ningún juego en el carrito.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    } else {
        carritoContainer.style.display = 'block';

        carrito.forEach((juego, index) => {
            const juegoCarrito = document.createElement('div');
            juegoCarrito.classList.add('carrito-item');
            juegoCarrito.innerHTML = `
                <div class="carrito-item-img" style="background-image: url('${juego.imagen}');"></div>
                <p>${juego.nombre} - $${juego.precio}</p>
                <button class="eliminar-item" data-index="${index}">Eliminar</button>
            `;
            carritoContenedor.appendChild(juegoCarrito);
        });

        const finalizarCompraBtn = document.createElement('button');
        finalizarCompraBtn.id = 'finalizar-compra';
        finalizarCompraBtn.textContent = 'Finalizar Compra';
        finalizarCompraBtn.classList.add('finalizar-compra-btn');
        carritoContenedor.appendChild(finalizarCompraBtn);

        // Modificar la función del evento click para finalizar la compra
        finalizarCompraBtn.addEventListener('click', function () {
            // Guardamos los juegos comprados en el localStorage
            localStorage.setItem('comprasFinalizadas', JSON.stringify(carrito));

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


        const botonesEliminar = document.querySelectorAll('.eliminar-item');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', function () {
                const index = this.dataset.index;
                carrito.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
            });
        });
    }
}

function cargarMasJuegos() {
    fetch(`https://api.rawg.io/api/games?key=0f17cb5e138b45619507646513477518&page=${paginaActual}&page_size=${juegosPorPagina}`)
        .then(response => response.json())
        .then(data => {
            const juegosConPrecio = data.results.map(juego => ({
                ...juego,
                price: (Math.random() * (70 - 10) + 10).toFixed(2)
            }));

            const juegosNoRepetidos = juegosConPrecio.filter(juego => {
                return !todosLosJuegos.some(j => j.id === juego.id);
            });

            todosLosJuegos = todosLosJuegos.concat(juegosNoRepetidos);
            juegosFiltrados = todosLosJuegos;
            mostrarJuegos(juegosFiltrados);
            paginaActual++;
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

function buscarJuegos(query) {
    juegosFiltrados = todosLosJuegos.filter(juego => juego.name.toLowerCase().includes(query.toLowerCase()));
    mostrarJuegos(juegosFiltrados);
}

botonAplicarFiltros.addEventListener('click', function () {
    const generosSeleccionados = Array.from(filtroGenero.querySelectorAll('input:checked')).map(input => input.value);
    const precioMin = parseFloat(filtroPrecioMin.value) || 0;
    const precioMax = parseFloat(filtroPrecioMax.value) || 100;

    juegosFiltrados = todosLosJuegos.filter(juego => {
        const generosDelJuego = juego.genres.map(genre => genre.name);
        const esGeneroCoincidente = generosSeleccionados.length === 0 || generosSeleccionados.some(genre => generosDelJuego.includes(genre));
        const esPrecioCoincidente = parseFloat(juego.price) >= precioMin && parseFloat(juego.price) <= precioMax;
        return esGeneroCoincidente && esPrecioCoincidente;
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
