const express = require("express");
const routes = require("./routes");// routes file
const cors = require('cors'); // cors to request, i had to download because i couldnt scrape amazon


const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(3000);