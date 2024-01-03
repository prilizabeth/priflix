/* Instancia de Axios con la creamos la variable de la api para usarla en las consultas */
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-type': 'application/json;charset=utf-8',
    },
    params: { // son los query parameters
        'api_key': apiKey,
        'language': 'es-ES'
    },
});

/* Funcion que devuelve el objeto de peliculas guardadas en localStorage */
function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies')); //obtenemos lo guardado en localStorage
    let movies;

    if(item) {
        movies = item; // si hay algo guardado, nos devuelve ese algo
    } else {
        movies = {}; // si no hay nada, devuelve un objeto vacio
    }

    return movies;
}

/* Funcion para guardar o remover peliculas de favoritos */
function likeMovie(movie) {
    const likedMovies = likedMoviesList(); // guardamos en una constante el objeto con las peliculas guardadas en localStorage

    if(likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined; // si existe el id, lo removemos
    } else {
        likedMovies[movie.id] = movie; // si no existe, lo agregamos
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies)); // guardamos lo modificado a localStorage en string
}

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            const imgUrl = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', imgUrl);
            lazyLoader.unobserve(entry.target);
        }
    });
});

// Funciones para crear card contenedora de peliculas y contenedor de categoria, se invocan en de otras funciones
function createMovieContainer(
    movies, 
    container, 
    {
        lazyLoad = false, //parametros nombrados para lazyloading y limpiar el html
        clean = true,
    } = {}, //si no son necesarios, no se pasan
    ) {
    if(clean) {
        container.innerHTML = ""; // si es true, que limpie el html
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        const movieImg = document.createElement('img');
        const likeBtn = document.createElement('button');//boton de favoritos

        movieContainer.className = 'col-2 my-2 px-3 movie-container';
        movieImg.className = 'rounded movie-img';
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute( lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        likeBtn.classList.add('movie-btn');

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://i.postimg.cc/t44G8Mmf/No-Image.png');
        });
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
        likedMoviesList()[movie.id] && likeBtn.classList.add('movie-btn--liked');
        likeBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // para evitar que el otro evento de click en el contenedor se sobreponga
            likeBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
        });

        if(lazyLoad) {
            lazyLoader.observe(movieImg); //para el evento de lazy loading
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(likeBtn);
        container.appendChild(movieContainer);
    });
}

function createCategoryContainer(categories, container) {
    container.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        const categoryTitle = document.createElement('h4');

        categoryContainer.className = 'col-2 m-1 category-container';
        categoryTitle.className = 'category-title';
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`; // agregamos un evento para cuando demos click a una categoria, el location.hash se ubique en la categoria correspondiente
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}

/* Funcion para obtener preview de peliculas en tendencia */
async function getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day'); // no necesitamos hacer json porque axios ya lo hace por defecto
    const movies = data.results;

    createMovieContainer(movies, trendingMoviesPreviewList);
}

/* Funcion para obtener lista preview de categorias */
async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    createCategoryContainer(categories, categoriesPreviewList);
}

/* Funcion para obtener peliculas segun la categoria */
async function getMoviesByCategory(id) {
    const {data} = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovieContainer(movies, genreMoviesList, { lazyLoad: true });
}

/* Funcion para infinite scrolling en sección categoria de pelicula */
function getPaginatedMoviesByCategory(id) {
    return async function () {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); 
        const pageIsNotMax = page < maxPage; 

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
        });
        const movies = data.results;

        createMovieContainer(movies, genreMoviesList, {lazyLoad: true, clean: false});
    }
    }
}

/* Funcion para obtener peliculas segun la busqueda */
async function getMoviesBySearch(query) {
    const {data} = await api('search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);

    createMovieContainer(movies, genreMoviesList);
}

/* Funcion para infinite scrolling en sección busqueda */
function getPaginatedMoviesBySearch(query) {
    return async function () {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); 
        const pageIsNotMax = page < maxPage; 

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const {data} = await api('search/movie', {
                params: {
                    query,
                    page,
                },
        });
        const movies = data.results;

        createMovieContainer(movies, genreMoviesList, {lazyLoad: true, clean: false}); //que no limpie el html sino no carga más
    }
    }
}

/* Funcion para obtener la lista completa de las peliculas en tendencia */
async function getTrendingMovies() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;
    maxPage = data.total_pages; // le damos un máximo de página para que no de error al llegar al final

    createMovieContainer(movies, genreMoviesList, {lazyLoad: true, clean: true});
}

/* Funcion para infinite scrolling en sección películas en tendencia */
async function getPaginatedTrendingMovies() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15); //valida si llegamos al final de la pag
    const pageIsNotMax = page < maxPage; // valida que no sea la última página

    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const {data} = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;

        createMovieContainer(movies, genreMoviesList, {lazyLoad: true, clean: false}); //que no limpie el html sino no carga más
    }
}

/* Funcion para obtener los detalles de una pelicula */
async function getMovieById(id) {
    const {data: movie} = await api('movie/' + id);

   
    movieDetailImg.setAttribute('src', 'https://image.tmdb.org/t/p/w500' + movie.poster_path)

    movieDetailTitle.textContent = movie.title;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);
    movieDetailDescription.textContent = movie.overview;

    createCategoryContainer(movie.genres, movieDetailCategoriesList);
    getRelatedMovies(id);
}

/* Funcion para obtener peliculas relacionadas segun movie id */
async function getRelatedMovies(id) {
    const {data} = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovieContainer(relatedMovies, relatedMoviesContainer);
}

/* Función para obtener la información de localStorage y guardarla en la sección peliculas favoritas */
function getLikedMovies() {
    const likedMoviesObj = likedMoviesList();
    const likedMoviesArr = Object.values(likedMoviesObj);

    createMovieContainer(likedMoviesArr, favouriteMoviesList, { lazyLoad: true, clean: true });
}