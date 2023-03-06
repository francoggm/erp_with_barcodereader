const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const models = require("./database/models");

dotenv.config();

module.exports = {
    generateAcessToken: (userId) => {
        return jwt.sign({userId}, process.env.TOKEN_SECRET, {expiresIn: '1800s'});
    },

    getTokenData: (token) => {
        return jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => data);
    },

    getToken: (header) => {
        var token = header.authorization;
        return token && token.split(' ')[1];
    },

    isAdmin: async (userId, superAdmin = false) => {
        const user = await models.User.findByPk(userId);
        return superAdmin ? user.admin && userId == 1 : user.admin;
    }
}