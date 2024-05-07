const axios = require("axios");
const { JSDOM } = require("jsdom");

//Function to get the data

const getData = async (req, res) => {
	const keyword = req.query.keyword; // Getting the keyword from the query parameters
	const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`; // Generating the URL for the Amazon search based on the keyword

	try {
		const response = await axios.get(url, {
			headers: {
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
				Host: "www.amazon.com",
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
			},
		});
		const dom = new JSDOM(response.data); // Parsing the html response using JSDOM
		const itens = dom.window.document.querySelectorAll("[data-index]");

		const products = Array.from(itens).map((item) => {
			const image = item.querySelector("img.s-image")?.src; // getting the image
			const priceWhole = item.querySelector("span.a-price-whole")?.textContent; // getting the Price
			const priceFraction = item.querySelector("span.a-price-fraction")?.textContent; // getting the PriceFraction
			const rating = item.querySelector("span.a-icon-alt")?.textContent; // getting the rate
			const reviewCount = item.querySelector(
				"span.a-size-base.s-underline-text"
			)?.textContent; // getting the review

			// I found 2 differents classes to get the titles so i had to use ||
			const titleElement =
				item.querySelector("span.a-size-medium.a-color-base.a-text-normal") ||
				item.querySelector("span.a-size-base-plus.a-color-base.a-text-normal");

			const title = titleElement?.textContent;
			return {
				image,
				price: `${priceWhole}${priceFraction ? priceFraction : ""}`,
				rating,
				reviewCount,
				title,
			}; // creating an Object to use in the front end
		});

		// filter in case an object doesn't have a price and returning the full object
		const productsWithPrice = products.filter(
			(product) => product.price !== "undefined"
		);

		return res.status(200).json(productsWithPrice); // Returning the Object
	} catch (error) {
		return res.status(500).json({ error: "Internal Error" });
	}
};

module.exports = { getData };
