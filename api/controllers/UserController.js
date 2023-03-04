const models = require("../database/models");
const userSchema = require("../schema/user/UserUpdateSchema.json");

const Ajv = require("ajv");
const addFormats = require("ajv-formats")
const ajv = new Ajv();
addFormats(ajv);
const userValidate = ajv.compile(userSchema);

module.exports = {
    getUser: (req, res) => {
        const id = req.params.id;

        models.User.findByPk(id)
            .then((user) => {
                if(user)
                    res.send(user)
                else
                    res.status(404).send({error: `ID ${id} not found`});
            })
            .catch(() => res.status(400).send({error: "Error getting user"}));    
    },

    getAllUsers: (req, res, next) => {
        models.User.findAll()
            .then((users) => {
                res.send(users); 
            })
            .catch(() => res.status(400).send({error: "Error getting users"}));    
    },

    updateUser: (req, res) => {
        const id = req.params.id;
        const newUser = req.body;

        if (userValidate(newUser)) {
            models.User
                .update(newUser, {where: {id}})
                .then(async (user) => {
                    if(user[0])
                        res.send(await models.User.findByPk(id));
                    else
                        res.status(404).send({error: `ID ${id} not found`});
            })
            .catch(() => res.status(400).send({error: "Error updating user"}));   
        }   
    },

    deleteUser: (req, res) => {
        const id = req.params.id;

        models.User
            .destroy({where: {id}})
            .then((user) => {
                if(user)
                    res.send();
                else
                    res.status(404).send({error: `ID ${id} not found`});    
            })
            .catch(() => res.status(400).send({error: "Error deleting user"}));    
    },
};