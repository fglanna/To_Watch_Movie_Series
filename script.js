const searchButton = document.getElementById("search-button");
const overlay = document.getElementById("modal-overlay");
const movieName = document.getElementById("movie-name");
const movieYear = document.getElementById("movie-year");
const movieListContainer = document.getElementById("movie-list");

let movieList = JSON.parse(localStorage.getItem("movieList")) ?? [];

searchButtonClickHandler = async () => {
  try {
    let url = `http://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`;
    console.log(movieName.value);
    const response = await fetch(url);
    const data = await response.json();
    console.log("data ", data);
    if (data.Error) {
      throw new Error("Filme não encontrado!");
    }
    createModal(data);
    overlay.classList.add("open");
  } catch (error) {
    notie.alert({ type: "error", text: error.message });
  }
};
movieNameParameterGenerator = () => {
  if (movieName.value === "") {
    throw new Error("O nome do filme deve ser informado");
  }
  return movieName.value.split(" ").join("+");
};

movieYearParameterGenerator = () => {
  if (movieYear.value === "") {
    return "";
  }
  if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
    throw new Error("Ano do filme inválido.");
  }
  return `&y=${movieYear.value}`;
};

function addToList(movieObject) {
  movieList.push(movieObject);
}

isMovieAlreadyOnList = (id) => {
  function doesThisIdBelongToThisMovie(movieObject) {
    return movieObject.imdbID === id;
  }
  return Boolean(movieList.find(doesThisIdBelongToThisMovie));
};

function updateUI(movieObject) {
  movieListContainer.innerHTML += `<article id="movie-card-${movieObject.imdbID}">
  <img 
    src="${movieObject.Poster}" alt="Poster de ${movieObject.Title}">
  <button class="remove-button" onclick="{removeFilmFromList('${movieObject.imdbID}')}"><i class="bi bi-trash"></i> Remover</button>
  </article>`;
}

function removeFilmFromList(id) {
  notie.confirm({
    text: "Seriously? Are you really going to remove the movie from the list?",
    SubmitText: "YES",
    cancelText: "No",
    position: "top",
    submitCallback: (removeMovie = () => {
      movieList = movieList.filter((movie) => movie.imdbID !== id);
      document.getElementById(`movie-card-${id}`).remove();
      updateLocalStorage();
    }),
  });
}

function updateLocalStorage() {
  localStorage.setItem("movieList", JSON.stringify(movieList));
}

for (const movieInfo of movieList) {
  updateUI(movieInfo);
}

searchButton.addEventListener("click", searchButtonClickHandler);
