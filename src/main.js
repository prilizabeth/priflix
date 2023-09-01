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

/* Funcion para obtener peliculas en tendencia */
async function getTrendingMoviesPreview() {
    const {data} = await api('trending/movie/day'); // no necesitamos hacer json porque axios ya lo hace por defecto
    const movies = data.results;

    trendingMoviesPreviewList.innerHTML = "";

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        const movieImg = document.createElement('img');

        movieContainer.className = 'col movie-container'
        movieImg.className = 'rounded movie-img';
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingMoviesPreviewList.appendChild(movieContainer);
    });
}

/* Funcion para obtener lista de categorias */
async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    categoriesPreviewList.innerHTML = "";

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
        categoriesPreviewList.appendChild(categoryContainer);
    });
}

/* Funcion para obtener peliculas segun la categoria */
async function getMoviesByCategory(id) {
    const {data} = await api('discover/movie', {
        params: {
            with_genres: id,
        }
    });
    const movies = data.results;

    genreMoviesList.innerHTML = "";

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        const movieImg = document.createElement('img');

        movieContainer.className = 'col my-2 movie-container'
        movieImg.className = 'rounded movie-img';
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        genreMoviesList.appendChild(movieContainer);
    });
}