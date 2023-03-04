const models = require("../database/models");
const registerSchema = require("../schema/auth/RegisterSchema.json");
const loginSchema = require("../schema/auth/LoginSchema.json");
const addFormats = require("ajv-formats");
const bcrypt = require("bcrypt");

const Ajv = require("ajv");
const ajv = new Ajv();
addFormats(ajv);
const registerValidate = ajv.compile(registerSchema);
const loginValidate = ajv.compile(loginSchema);

module.exports = {
    register: (req, res) => {
        const user = req.body;

        if (registerValidate(user)) {
            user.password = bcrypt.hashSync(user.password, 10);
            return models.User.create(user)
                .then(() => {
                    res.send();
                })
                .catch(() => res.status(400).send({error: "Error creating user, user already exists"}));
        }

        res.status(400).send({error: "Wrong informations in body, check fields"});
    },

    login: (req, res) => {
        const loginUser = req.body;

        if (loginValidate(loginUser)){
            return models.User.findOne({where: {username: loginUser.username}})
                .then((user) => {
                    if (user){
                        if (bcrypt.compareSync(loginUser.password, user.password))
                            return res.send();
                    }

                    res.status(404).send({error: "Wrong informations, check username or password"});
                })
                .catch(() => res.status(400).send({error: "Error finding user"}));
        }

        res.status(400).send({error: "Wrong informations in body, check fields"});
    },

    me: (req, res) => {
        res.send();   
    }
}