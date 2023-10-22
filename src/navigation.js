let maxPage;
let page = 1;
let infiniteScroll;

searchBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchInput.value;
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});
navbarLogo.addEventListener('click', () => {
    location.hash = '#home';
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false); // para escuchar el evento de cambio de hash en la url
window.addEventListener('scroll', infiniteScroll);

function navigator() {
    console.log({ location });
    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();
    }

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}

function homePage() {
    console.log('home');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    heroSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    genericSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function trendsPage() {
    console.log('trends');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    heroSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    genreTitle.innerHTML = 'Tendencias';

    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies;
}

function searchPage() {
    console.log('search');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    heroSection.classList.add('inactive');
    genericSection.classList.remove('inactive');

    const [_, queryString] = location.hash.split('='); // esto separa el query parameter en ['#search', 'busqueda']
    const query = decodeURIComponent(queryString);
    genreTitle.innerHTML = `Resultados de ${query}`;
    getMoviesBySearch(query); // Funcion que invoca peliculas segun busqueda

    infiniteScroll = getPaginatedMoviesBySearch(query);
}

function movieDetailPage() {
    console.log('movie');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    heroSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function categoriesPage() {
    console.log('categories');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    heroSection.classList.add('inactive');
    genericSection.classList.remove('inactive');

    const [_, categoryData] = location.hash.split('='); // esto separa el query parameter en ['#category', 'id-name']
    const [categoryId, categoryName] = categoryData.split('-'); // esto separa el id y el name
    genreTitle.innerHTML = decodeURIComponent(categoryName); // con el decode hacemos que reconozca los caracteres especiales y tildes

    getMoviesByCategory(categoryId); // función que invoca peliculas según la categoria

    infiniteScroll = getPaginatedMoviesByCategory(categoryId);
}