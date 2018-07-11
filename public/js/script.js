var allMovies = [];
var favouriteMovies = [];

function getMovies() {
	return fetch('http://localhost:3000/movies')
		.then(function (data) {
			return data.json();
		})
		.then(function (json) {

			let htmlText = '';
			json.forEach(movie => {
				htmlText = htmlText + 
					`<div class="col-sm-3">
		   			<img class="img-responsive" src="${movie.posterPath}" alt="" /><br>
					<b><p class="card-text">${movie.title} </p></b><br>
		   			<input type="submit" class="favbtn btn btn-info btn-secondary btn-sm" value="Add to favorites" onClick="addFavourite(${movie.id})"/>	
					</div>
					`;
			});

			let movieList = document.getElementById('moviesList');
			movieList.innerHTML = htmlText;
			allMovies = json;
			return json;
		})
		.catch(function (err) {
			return Promise.reject(error);
		});
}

function populateFavoriteMovieList() {
	let htmlText = '';
	favouriteMovies.forEach(movie => {
		htmlText = htmlText + 
			`<div class="col-sm-3">
			<img class="img-responsive" src="${movie.posterPath}" alt="" /><br> 
			<b><p class="card-text">${movie.title} </p></b>
			</div>
			`;
	});

	let favouriteMoviesList = document.getElementById('favouritesList');
	favouriteMoviesList.innerHTML = htmlText;
	return favouriteMovies;
}

function getFavourites() {
	return fetch('http://localhost:3000/favourites')
		.then(function (data) {
			return data.json();
		})
		.then(function (json) {

			favouriteMovies = json;
			return populateFavoriteMovieList();

		})
		.catch(function (err) {
			return Promise.reject(error);
		});
}

function addFavourite(movieId) {

	let isPresent = false;
	// checking if movie is present in favourite list
	favouriteMovies.forEach(movie => {
		if (movie.id === movieId) {
			isPresent = true;
		}
	})
	// if movie is not present in favourite list 
	if (!isPresent) {
		let movieToBeAdded;
		// finding movie by movieId from all movies list
		allMovies.forEach(movie => {
			if (movie.id === movieId) {
				movieToBeAdded = movie;
			}
		})
		// adding movie to favouriteMovies list	
		favouriteMovies.push(movieToBeAdded);

		// making post call to save favourite movie to db
		return fetch('http://localhost:3000/favourites', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(movieToBeAdded)
		})
			.then(function (res) {
				return populateFavoriteMovieList();
			}
			)
			.catch(function (error) {
				console.log('failed to add favourites ' + error)
				return Promise.reject(error);
			});
	} else {
		alert('Movie is already added to favourites');
		const error = new Error('Movie is already added to favourites');
		throw error;
	}

}

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


