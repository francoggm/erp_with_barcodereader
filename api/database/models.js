const sequelize = require('sequelize');
const conn = require('./database');

const User = conn.define('user', {
    name: {
        type: sequelize.STRING(30),
        allowNull: false
    },
    email: {
        type: sequelize.STRING(80),
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    admin: {
        type: sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
});

const Product = conn.define('product', {
    name: {
        type: sequelize.STRING(30),
        allowNull: false
    },
    brand: {
        type: sequelize.STRING(30),
    },
    price: {
        type: sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: sequelize.TEXT,
        allowNull: false
    },
    quantity: {
        type: sequelize.INTEGER,
        allowNull: false,
        defaultValue: '0'
    },
    category: {
        type: sequelize.STRING(30),
    },
});

User.sync({force: false}).then(() => {});
Product.sync({force: false}).then(() => {});

module.exports = {User, Product};