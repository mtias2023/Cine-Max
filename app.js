
document.addEventListener('DOMContentLoaded', () => {
    const botonBuscar = document.getElementById('botonBuscar');
    const tituloPelicula = document.getElementById('tituloPelicula');
    const resultados = document.getElementById('resultados');

    botonBuscar.addEventListener('click', buscarPeliculas);

    function buscarPeliculas() {
        const titulo = tituloPelicula.value.trim();
        if (titulo === '') return;

        fetch(`https://www.omdbapi.com/?apikey=e7449990&s=${titulo}`)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True') {
                    mostrarResultados(data.Search);
                } else {
                    resultados.innerHTML = `<p>No se encontraron resultados para "${titulo}".</p>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                
            });
    }

    function mostrarResultados(peliculas) {
        resultados.innerHTML = '';
        peliculas.forEach(pelicula => {
            const peliculaHTML = `
                <div class="pelicula">
                    <h2>${pelicula.Title}</h2>
                    <p><strong>Año:</strong> ${pelicula.Year}</p>
                    <img src="${pelicula.Poster !== "N/A" ? pelicula.Poster : 'images/placeholder.jpg'}" alt="Póster de ${pelicula.Title}">
                    <button onclick="agregarAFavoritos('${pelicula.imdbID}', '${pelicula.Title}', '${pelicula.Year}', '${pelicula.Poster}')" class="btn btn-primary">Agregar a favoritos</button>
                </div>
            `;
            resultados.innerHTML += peliculaHTML;
        });

        // Guardar en el historial
        const historial = JSON.parse(sessionStorage.getItem('historialPeliculas')) || [];
        peliculas.forEach(pelicula => {
            if (!historial.find(item => item.imdbID === pelicula.imdbID)) {
                historial.push(pelicula);
            }
        });
        sessionStorage.setItem('historialPeliculas', JSON.stringify(historial));
    }
});

//agregar a favoritos
function agregarAFavoritos(imdbID, title, year, poster) {
    const favoritos = JSON.parse(localStorage.getItem('favoritosPeliculas')) || [];
    if (!favoritos.find(item => item.imdbID === imdbID)) {
        favoritos.push({ imdbID, Title: title, Year: year, Poster: poster });
        localStorage.setItem('favoritosPeliculas', JSON.stringify(favoritos));
        mostrarMensaje('Película agregada a favoritos exitosamente');
    }
}

//mostrar mensaje
function mostrarMensaje(mensaje) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.classList.add('mostrar');
    setTimeout(() => {
        mensajeDiv.classList.remove('mostrar');
    }, 3000);
}

//eliminar de favoritos
function eliminarDeFavoritos(imdbID) {
    let favoritos = JSON.parse(localStorage.getItem('favoritosPeliculas')) || [];
    favoritos = favoritos.filter(item => item.imdbID !== imdbID);
    localStorage.setItem('favoritosPeliculas', JSON.stringify(favoritos));
}


