const express = require("express");
const app = express();
const models = require("./database/models");

app.listen(8080, () => console.log("Running"));