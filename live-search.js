const url = 'https://imdb-top-100-movies1.p.rapidapi.com/';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b1e588b3cbmsh3fc752416246cd4p1f6184jsn6ab41aed29d5',
		'X-RapidAPI-Host': 'imdb-top-100-movies1.p.rapidapi.com'
	}
};


const searchBar = document.getElementById("search-bar");
const title= document.querySelector(".title");
const movieImage= document.querySelector("movie-image");
const moviePlot= document.querySelector(".plot");
const movieDate= document.querySelector(".date");
const resultsContainer = document.getElementById("results-container");
const txt = document.getElementById("txt");
let movieList;
let searchValue;
let arr;

const fetchMovies = async()=>{
	try {
		const response = await fetch(url, options);
		const data = await response.json(); 
		movieList = data;
		console.log(movieList)

		for (let i = 0; i < movieList.length; i++){
			resultsContainer.innerHTML+= ` <div class="movie-cards"> <img src="${movieList[i].image[0][1]}" alt="movie image" class="movie-image" />  <h2 class="title"> ${movieList[i].title}  </h2> <p class="plot"> ${movieList[i].description} </p> <p class="date"> ${movieList[i].year} </p> </div>`
		}
	} catch (error) {
		console.error(error);
		}
}
//fetchMovies()


searchBar.addEventListener('input', function(e){	
	resultsContainer.innerHTML = "";
	txt.style.display="none";
	searchValue = e.target.value.trim().toLowerCase();
	arr = [];

	movieList
		.filter((item) => {
		return(item.title.toLowerCase().includes(searchValue));		
		})
		.forEach(element => {
				resultsContainer.innerHTML += ` <div class="movie-cards"> <img src="${element.image[0][1]}" alt="movie image" class="movie-image" />  <h2 class="title"> ${element.title}  </h2> <p class="plot"> ${element.description} </p> <p class="date"> ${element.year} </p> </div>`				
				arr.push(element);			
		});

	if(arr.length <= 0)
	 	txt.style.display="block";

})