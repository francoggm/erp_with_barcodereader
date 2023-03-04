const express = require("express");
const cors = require("cors");
const productRoute = require("./routes/Product");
const userRoute = require("./routes/User");
const authRoute = require("./routes/Auth");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});


app.use("/v1", productRoute);
app.use("/v1", userRoute);
app.use("/v1", authRoute);

app.listen(8080, "127.0.0.1", () => console.log("Running"));