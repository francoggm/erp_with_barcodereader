const sequelize = require("sequelize");
const conn = new sequelize('products', 'franco', '', {
    host: 'localhost',
    dialect: 'mysql'
});

conn
    .authenticate()
    .then(() => console.log("Connected"))
    .catch((err) => console.log("Error -> ", err));

module.exports = conn;