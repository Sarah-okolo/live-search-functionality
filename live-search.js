const url = 'https://imdb-top-100-movies.p.rapidapi.com/';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b1e588b3cbmsh3fc752416246cd4p1f6184jsn6ab41aed29d5',
		'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
	}
};


const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results-container");
const movieUnavailableTxt = document.getElementById("movie-unavailable-txt");
let movieList;
let searchValue;
let searchedMovies;

// Function to fetch movies from the API
const fetchMovies = async () => {
  try {
    const response = await fetch(url, options);
    movieList = await response.json();

    // Step 1: Storing the Movie Data in browser storage
    localStorage.setItem("moviedata", JSON.stringify(movieList));
    localStorage.setItem("cacheTimestamp", Date.now()); // Update cache timestamp

    // Step 3: Render the movies on the page
    renderMovies(movieList);
  } catch (error) {
    movieUnavailableTxt.style.display = "block";
	console.error(error);
  }
};

// Function to render movies on the page
const renderMovies = (movies) => {
  resultsContainer.innerHTML = ""; // Clear the existing movies
  movieUnavailableTxt.style.display = "none"; // Hide the "No movies found" message
  searchedMovies = []; // Clear the searched movies array

  movies.forEach((movie) => {
    resultsContainer.innerHTML += `
      <div class="movie-cards">
        <img src="${movie.image}" alt="movie image" class="movie-image" />
        <h2 class="title">${movie.title}</h2>
        <p class="plot">${movie.description}</p>
        <p class="date">${movie.year}</p>
      </div>
    `;

    searchedMovies.push(movie); // Add the movie to the searched movies array
  });

 
};

// Step 2: Check if there is cached movie data and if it has expired
const cacheTimestamp = localStorage.getItem("cacheTimestamp");
const expirationDuration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

// Check if cache has expired or data is not available
if (
  !cacheTimestamp ||
  Date.now() - parseInt(cacheTimestamp) > expirationDuration
) {
  // Cache expired or data not available, fetch movies again
  fetchMovies();
} else {
  // Use cached movie data
  movieList = JSON.parse(localStorage.getItem("moviedata"));
  renderMovies(movieList);
}

// Debounce function to delay search functionality
const debounce = (func, delay) => {
	let timeoutId; // Variable to hold the timeout ID
  
	return function (...args) {
	  clearTimeout(timeoutId); // Clear any previous timeout
  
	  timeoutId = setTimeout(() => {
		func.apply(this, args); // Invoke the provided function after the specified delay
	  }, delay);
	};
  };
  

const searchBarFunc = (e) => {
	searchValue = e.target.value.trim().toLowerCase();

    // Filter movies based on search input
    const filteredMovies = movieList.filter((movie) =>
      movie.title.toLowerCase().includes(searchValue)
    );

    // Render the filtered movies on the page
    renderMovies(filteredMovies);

	if (searchedMovies.length <= 0) {
		movieUnavailableTxt.style.display = "block"; // Show the "No movies found" message if no movies match the search
	  }
}

// Event listener for search bar input, with debouncing, and delay of 300 milliseconds.
searchBar.addEventListener("input", debounce(searchBarFunc, 200) );
 