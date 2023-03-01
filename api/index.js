const express = require("express");
const app = express();
const productRoute = require("./routes/Product");

app.use(express.json());

app.use("/v1", productRoute);

app.listen(8080, () => console.log("Running"));