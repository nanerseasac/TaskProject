const btnSearch = document.getElementById("btn");
const inpKeyword = document.getElementById("inp");
const resultsDiv = document.getElementById("results");
const imagem = document.getElementById("imagemk");

btnSearch.addEventListener("click", () => {
	// get the keyword from the input field and trim any extra whitespace
	const keyword = inpKeyword.value.trim();
	// checking if its empty, if not, call the fetchData function with the keyword
	if (keyword !== "") {
		fetchData(keyword);
	} else {
		// if empty display the paragraph
		resultsDiv.innerHTML = "<p>Please enter a keyword.</p>";
	}
});

// function to fetchdata from the API using the provided keyword
const fetchData = (keyword) => {
	// url for the API Endpoint
	const url = `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(
		keyword
	)}`;

	const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object

	xhr.open("GET", url, true); // GET method and url to get the details from api

	xhr.onload = () => {
		if (xhr.status >= 200 && xhr.status < 300) {
			// check if the request is between >= 200 and < 300
			// if it is parse the response JSON data
			const data = JSON.parse(xhr.responseText); // call the displayResults function with the retrieved data
			resultsDiv.innerHTML = ""; // clear the results div to make a new request
			displayResults(data);
		} else {
			resultsDiv.innerHTML = `<p>Error: ${xhr.statusText}</p>`; // If request fails, display an error message with the status text
		}
	};

	xhr.onerror = () => {
		// if error during the request diplay this paragraph
		resultsDiv.innerHTML = "<p>Error: Connection failed</p>";
		if (xhr.status >= 200 && xhr.status < 300) {
			resultsDiv.innerHTML = "";
		}
	};

	xhr.send();
};

const displayResults = (datas) => {
	datas.forEach((data) => {
		// creating the HTML and getting the itens details from backend
		const divContainer = document.createElement("div");
		const ratingDiv = document.createElement("div");
		const itemDiv = document.createElement("div");
		const starDivOuter = document.createElement("div");
		const starDiv = document.createElement("div");
		const divImg = document.createElement("div");
		divContainer.classList.add("container");
		divImg.classList.add("imgg");
		itemDiv.classList.add("item");
		ratingDiv.classList.add("ratingStars");
		starDiv.classList.add("stars");
		starDivOuter.classList.add("starsOuter");

		const titleHeading = document.createElement("h2");
		titleHeading.textContent = data.title;

		const reviews = document.createElement("span");
		reviews.textContent = data.reviewCount;
		reviews.classList.add("rev");

		const prices = document.createElement("span");
		prices.textContent = `U$${data.price}`;

		const imageElement = document.createElement("img");
		imageElement.src = data.image;
		imageElement.alt = data.title;

		const numStr = data.rating.slice(0, 3); // Slicing the string and getting only the rating
		const rating = document.createElement("span");
		rating.textContent = numStr;

		// creating the structure
		itemDiv.appendChild(titleHeading);
		ratingDiv.appendChild(rating);
		starDivOuter.appendChild(starDiv);
		ratingDiv.appendChild(starDivOuter);
		ratingDiv.appendChild(reviews);
		ratingDiv.appendChild(prices);
		itemDiv.appendChild(ratingDiv);

		divImg.appendChild(imageElement);

		divContainer.appendChild(divImg);
		divContainer.appendChild(itemDiv);
		resultsDiv.appendChild(divContainer);

		const starsWidth = (numStr / 5) * 100 + "%"; // stars rating logic
		starDiv.style.width = starsWidth;
	});
};
