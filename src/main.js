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

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');
        const movieContainer = document.createElement('div');
        const movieImg = document.createElement('img');

        movieContainer.className = 'col movie-container'
        movieImg.className = 'rounded movie-img';
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
}

/* Funcion para obtener lista de categorias */
async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    categories.forEach(category => {
        const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');
        const categoryContainer = document.createElement('div');
        const categoryTitle = document.createElement('h4');

        categoryContainer.className = 'col-2 category-container';
        categoryTitle.className = 'category-title';
        categoryTitle.setAttribute('id', 'id' + category.id);
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        previewCategoriesContainer.appendChild(categoryContainer);
    });
}