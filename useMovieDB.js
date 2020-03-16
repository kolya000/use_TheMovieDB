"use strict";

const Movie = (function() {
  const APIKEY = "09d6176c8f7104122046f851de8395b7";
  let baseURL = "https://api.themoviedb.org/3/";

  let htmlBlock = document.getElementById("htmlBlock");

  let getTrending = function() {
    let trendingUrl = "".concat(baseURL, "trending/all/week?api_key=", APIKEY);
    fetch(trendingUrl).then(response => {
      if (response.ok) {
        return response
          .json()
          .then(trendingData => showMovies(trendingData.results));
      }

      return response.json().then(err => console.log(err));
    });
  }

  let showMovies = moviesData => {
    const CreateList = () => {
      const ul = document.createElement("ul");
      moviesData.forEach(item => {
        const li = document.createElement("li");
        const LiText = () => {
          if (item.title) {
            li.innerHTML = `<a href='/' id='${item.id}'>${item.title}</a>`;
          } else if (item.name) {
            li.innerHTML = `<a href='/' id='${item.id}'>${item.name}</a>`;
          }
        };
        LiText();
        ul.appendChild(li);
      });
      document.getElementById("htmlBlock").appendChild(ul);
    };
    CreateList();
    movieClick();
  }

  function movieClick() {
    let allMovie = document.querySelectorAll("a");

    allMovie.forEach(item => {
      item.addEventListener("click", event => {
        event.preventDefault();
        showMovie(item.id);
      });
    });
  }

  function showMovie(id) {
    htmlBlock.innerHTML = "";
    let movieUrl = "".concat(baseURL, `movie/${id}?api_key=`, APIKEY);

    fetch(movieUrl).then(response => {
      if (response.ok) {
        return response.json().then(movieData => showMovieData(movieData));
      }

      return response.json().then(err => console.log(err));
    });
  }

  function showMovieData(movieData) {
    let movieDataBlock = document.createElement("div");
    movieDataBlock.id = "movieDataBlock";
    document.getElementById("htmlBlock").appendChild(movieDataBlock);

    function showPoster() {
      let poster = document.createElement("img");
      let posterPath = movieData.poster_path;
      document.getElementById("movieDataBlock").appendChild(poster);

      let configurationUrl = "".concat(
        baseURL,
        "configuration?api_key=",
        APIKEY
      );
      fetch(configurationUrl).then(responce => {
        if (responce.ok) {
          return responce.json().then(data => {
            let baseImageUrl = data.images.secure_base_url;
            getImages(baseImageUrl);
          });
        }

        return responce.json().then(err => console.log(err));
      });

      function getImages(baseImageUrl) {
        let posterUrl = "".concat(baseImageUrl, "w300", posterPath);
        poster.src = posterUrl;
      }
    }

    function showTitle() {
      let title = document.createElement("h1");
      document.getElementById("movieDataBlock").appendChild(title);

      function getTitle() {
        if (movieData.title) {
          return movieData.title;
        } else if (movieData.name) {
          return movieData.name;
        }
      }

      title.innerHTML = getTitle();
    }

    function showDescription() {
      let aboutMovie = document.createElement("p");
      document.getElementById("movieDataBlock").appendChild(aboutMovie);

      aboutMovie.innerHTML = movieData.overview;
    }

    function showRecommendations() {
      htmlBlock.insertAdjacentHTML(
        "beforeend",
        `
                <div></div>
                <h2>Recomendations</h2>
            `
      );

      let urlRec = "".concat(
        baseURL,
        `movie/${movieData.id}/recommendations?api_key=`,
        APIKEY
      );
      fetch(urlRec).then(responce => {
        if (responce.ok) {
          return responce.json().then(recomendation => {
            moveRec(recomendation);
          });
        }

        return responce.json().then(err => {
          console.log(err);
        });
      });

      function moveRec(recomendation) {
        let recGetMas = recomendation.results;
        if (recGetMas.length === 0) {
          htmlBlock.insertAdjacentHTML(
            "beforeend",
            `
                        <p>This movie don't has recomendation</p>
                    `
          );
        } else {
          let recMas = [];
          for (let i = 0; i < recGetMas.length && i < 3; i++) {
            recMas.push(recGetMas[i]);
          }
          showMovies(recMas);
        }
      }
    }

    function startMovieData() {
      showPoster();
      showTitle();
      showDescription();
      showRecommendations();
    }

    startMovieData();
  }

  function search() {
    let button = document.getElementById("search");
    button.addEventListener("click", () => getMovies());

    function getMovies() {
      let input = document.getElementById("input").value;
      let urlSearc = "".concat(
        baseURL,
        "search/movie?api_key=",
        APIKEY,
        "&query=",
        input
      );

      if (input === "") {
        htmlBlock.innerHTML = "";

        getTrending();
      } else {
        htmlBlock.innerHTML = "";

        fetch(urlSearc).then(responce => {
          if (responce.ok) {
            return responce
              .json()
              .then(searchMas => showMovies(searchMas.results));
          }

          return responce.json().then(err => console.log(err));
        });
      }
    }
  }

  return {
    getTrending: getTrending,
    search: search
  }
})();

document.addEventListener("DOMContentLoaded", Movie.getTrending);
document.addEventListener("DOMContentLoaded", Movie.search);
