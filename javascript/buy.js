document.addEventListener("DOMContentLoaded", function () {
    const barraBusqueda = document.getElementById('search-bar');
    const contenedorCatalogo = document.getElementById('catalogo-container');
    const botonFiltro = document.getElementById('filter-button');
    const modalFiltro = document.getElementById('filter-modal');
    const cerrarModal = document.getElementById('close-modal');
    const botonAplicarFiltros = document.getElementById('apply-filters');
    const filtroGenero = document.getElementById('genre-filter'); // Contenedor de los géneros
    const filtroPrecioMin = document.getElementById('price-min');
    const filtroPrecioMax = document.getElementById('price-max');
    let todosLosJuegos = [];
    let juegosFiltrados = [];
    let paginaActual = 1;  // Página inicial para cargar los juegos
    const juegosPorPagina = 30; // Número de juegos que cargaremos por página

    // Función para mostrar los juegos en el contenedor
    function mostrarJuegos(juegos) {
        contenedorCatalogo.innerHTML = ''; // Limpiar contenedor antes de agregar nuevos juegos
        juegos.forEach(juego => {
            const itemJuego = document.createElement('div');
            itemJuego.classList.add('game-item');
            itemJuego.innerHTML = `
                <img src="${juego.background_image}" alt="${juego.name}" class="game-image" loading="lazy">
                <h4>${juego.name}</h4>
                <p>${juego.genres.map(genre => genre.name).join(', ')}</p>
                <p><strong>Precio: $${juego.price}</strong></p>  <!-- Usar el precio preasignado -->
                <button class="buy-button">Comprar</button>
            `;
            contenedorCatalogo.appendChild(itemJuego);
        });
    }

    // Función para cargar más juegos desde la API
    function cargarMasJuegos() {
        console.log('Cargando más juegos...');
        fetch(`https://api.rawg.io/api/games?key=0f17cb5e138b45619507646513477518&page=${paginaActual}&page_size=${juegosPorPagina}`)
            .then(response => response.json())
            .then(data => {
                console.log('Juegos cargados:', data.results);
                const juegosConPrecio = data.results.map(juego => ({
                    ...juego,
                    price: (Math.random() * (70 - 10) + 10).toFixed(2)  // Asignar precio aleatorio al cargar
                }));
                todosLosJuegos = todosLosJuegos.concat(juegosConPrecio); // Agregar los juegos nuevos
                juegosFiltrados = todosLosJuegos;
                mostrarJuegos(juegosFiltrados); // Mostrar los juegos
                paginaActual++; // Aumentar el número de la página
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                contenedorCatalogo.innerHTML = '<p>No se pudo cargar la información de los juegos.</p>';
            });
    }

    // Función de búsqueda que filtra los juegos por nombre
    function buscarJuegos(query) {
        juegosFiltrados = todosLosJuegos.filter(juego => juego.name.toLowerCase().includes(query.toLowerCase()));
        mostrarJuegos(juegosFiltrados);
    }

    // Detectar el scroll en el contenedor principal
    document.getElementById('main').addEventListener('scroll', function() {
        console.log("Detectado scroll");
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 100) {
            console.log("Cargar más juegos");
            cargarMasJuegos(); // Cargar más juegos cuando el usuario esté cerca del final
        }
    });

    // Agregar un event listener para la barra de búsqueda
    barraBusqueda.addEventListener('input', function() {
        const query = barraBusqueda.value;
        buscarJuegos(query);  // Filtrar los juegos según lo que se escribe en la barra de búsqueda
    });

    // Mostrar el modal de filtros
    botonFiltro.addEventListener('click', function() {
        modalFiltro.style.display = 'block';  // Mostrar modal
    });

    // Cerrar el modal de filtros
    cerrarModal.addEventListener('click', function() {
        modalFiltro.style.display = 'none';  // Ocultar modal
    });

    // Aplicar los filtros seleccionados
    botonAplicarFiltros.addEventListener('click', function() {
        const generosSeleccionados = Array.from(filtroGenero.querySelectorAll('input:checked')).map(input => input.value);
        const precioMin = parseFloat(filtroPrecioMin.value) || 0;
        const precioMax = parseFloat(filtroPrecioMax.value) || 100;

        // Filtrar los juegos
        juegosFiltrados = todosLosJuegos.filter(juego => {
            const generosDelJuego = juego.genres.map(genre => genre.name);
            const esGeneroCoincidente = generosSeleccionados.length === 0 || generosSeleccionados.some(genre => generosDelJuego.includes(genre));
            const esPrecioCoincidente = parseFloat(juego.price) >= precioMin && parseFloat(juego.price) <= precioMax;  // Filtrar correctamente por precio
            return esGeneroCoincidente && esPrecioCoincidente;
        });

        mostrarJuegos(juegosFiltrados);  // Mostrar juegos filtrados
        modalFiltro.style.display = 'none';  // Cerrar modal
    });

    // Obtener los primeros juegos desde la API
    cargarMasJuegos();
});
