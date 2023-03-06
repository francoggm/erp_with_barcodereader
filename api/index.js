const express = require("express");
const cors = require("cors");

const utils = require("./utils");
const productRoute = require("./routes/Product");
const userRoute = require("./routes/User");
const authRoute = require("./routes/Auth");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.use("/v1", productRoute);
app.use("/v1", userRoute);
app.use("/v1", authRoute);

app.listen(8080, "127.0.0.1", () => console.log("Running"));