const express = require("express");
const { getData } = require("./controllers/recurse");// API function file import

const routes = express();
routes.get("/api/scrape", getData) // endpoint and API function


module.exports = routes;