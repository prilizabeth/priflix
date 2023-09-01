searchBtn.addEventListener('click', () => {
    location.hash = '#search=';
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});
navbarLogo.addEventListener('click', homePage);

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    console.log({ location });

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
}

function homePage() {
    console.log('home');

    getTrendingMoviesPreview();
    getCategoriesPreview();
}

function trendsPage() {
    console.log('trends');
}

function searchPage() {
    console.log('search');
}

function movieDetailPage() {
    console.log('movie');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
}

function categoriesPage() {
    console.log('categories');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    genericSection.classList.remove('inactive');

    const [_, categoryData] = location.hash.split('='); // esto separa el query parameter en ['#category', 'id-name']
    const [categoryId, categoryName] = categoryData.split('-'); // esto separa el id y el name
    genreTitle.innerHTML = decodeURIComponent(categoryName); // con el decode hacemos que reconozca los caracteres especiales y tildes

    getMoviesByCategory(categoryId); // función que invoca peliculas según la categoria
}