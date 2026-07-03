
const API_KEY = "a759cbcc15279a6d2523743d74b1315d";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w342";
const LANGUAGE = "pt-BR";

const POPULAR_ENDPOINT = `${BASE_URL}/movie/popular`;
const SEARCH_ENDPOINT = `${BASE_URL}/search/movie`;

const movieListEl = document.getElementById("movie-list");
const messageEl = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const btnPopular = document.getElementById("btnPopular");

async function fetchMovies(query = "") {
  const url = query
    ? `${SEARCH_ENDPOINT}?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(query)}`
    : `${POPULAR_ENDPOINT}?api_key=${API_KEY}&language=${LANGUAGE}&page=1`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = movie.poster_path
    ? `${IMG_BASE_URL}${movie.poster_path}`
    : "https://placehold.co/342x513?text=Sem+poster";
  img.alt = `Poster de ${movie.title}`;
  card.appendChild(img);

  const info = document.createElement("div");
  info.classList.add("info");

  const title = document.createElement("h3");
  title.textContent = movie.title;
  info.appendChild(title);

  const year = document.createElement("span");
  year.classList.add("year");
  year.textContent = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "Ano desconhecido";
  info.appendChild(year);

  const rating = document.createElement("span");
  rating.classList.add("rating");
  rating.textContent = `⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}`;
  info.appendChild(rating);

  const overview = document.createElement("p");
  overview.classList.add("overview");
  overview.textContent = movie.overview
    ? movie.overview
    : "Sem sinopse disponível.";
  info.appendChild(overview);

  card.appendChild(info);
  return card;
}

function renderMovies(movies) {
  movieListEl.innerHTML = "";

  if (!movies || movies.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");
  const fragment = document.createDocumentFragment();
  movies.forEach((movie) => {
    fragment.appendChild(createMovieCard(movie));
  });
  movieListEl.appendChild(fragment);
}

function showMessage(text) {
  messageEl.textContent = text;
}

async function loadMovies(query = "") {
  showMessage("Carregando filmes...");
  movieListEl.innerHTML = "";

  try {
    const movies = await fetchMovies(query);
    renderMovies(movies);
  } catch (error) {
    console.error(error);
    showMessage("Ocorreu um erro ao buscar os filmes. Tente novamente.");
  }
}

btnSearch.addEventListener("click", () => {
  const query = searchInput.value.trim();
  loadMovies(query);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadMovies(searchInput.value.trim());
  }
});

btnPopular.addEventListener("click", () => {
  searchInput.value = "";
  loadMovies();
});

function init() {
  loadMovies();
}

init();
