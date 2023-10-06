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
function createMovieContainer(movies, container, lazyLoad = false) {
    container.innerHTML = "";

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        const movieImg = document.createElement('img');

        movieContainer.className = 'col my-2 movie-container';
        movieImg.className = 'rounded movie-img';
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute( lazyLoad ? 'data-img' : 'src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://i.postimg.cc/t44G8Mmf/No-Image.png');
        });
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
        

        if(lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategoryContainer(categories, container) {
    container.innerHTML = "";

    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        const categoryTitle = document.createElement('h4');

        categoryContainer.className = 'col-2 category-container';
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

/* Funcion para obtener peliculas en tendencia */
async function getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day'); // no necesitamos hacer json porque axios ya lo hace por defecto
    const movies = data.results;

    createMovieContainer(movies, trendingMoviesPreviewList);
}

/* Funcion para obtener lista de categorias */
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

    createMovieContainer(movies, genreMoviesList);
}

/* Funcion para obtener peliculas segun la busqueda */
async function getMoviesBySearch(query) {
    const {data} = await api('search/movie', {
        params: {
            query,
        }
    });
    const movies = data.results;

    createMovieContainer(movies, genreMoviesList);
}

/* Funcion para obtener la lista completa de las peliculas en tendencia */
async function getTrendingMovies() {
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    createMovieContainer(movies, genreMoviesList, true);
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

    createMovieContainer(relatedMovies, relatedMoviesContainer, true);
}