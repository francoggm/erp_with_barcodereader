const models = require("../database/models");
const userSchema = require("../schema/user/UserUpdateSchema.json");
const utils = require("../utils");

const Ajv = require("ajv");
const addFormats = require("ajv-formats")

const ajv = new Ajv();
addFormats(ajv);
const userValidate = ajv.compile(userSchema);

module.exports = {
    getUser: async (req, res) => {
        const token = utils.getToken(req.headers);
        const tokenData = utils.getTokenData(token);

        if (tokenData) {
            const isUser = await utils.isUser(tokenData.userId)
            if(!isUser) return res.status(401).send({error: "Invalid token"}); 

            const isAdmin = await utils.isAdmin(tokenData.userId);
            if (!isAdmin) return res.status(401).send({error: "Just admin"});
        }
        else return res.status(401).send({error: "Invalid token"});

        const id = req.params.id;
        
        return models.User.findByPk(id)
            .then((user) => {
                if(user)
                    res.send(user)
                else
                    res.status(404).send({error: `ID ${id} not found`});
            })
            .catch(() => res.status(500).send({error: "Error getting user"}));     
    },

    getAllUsers: async (req, res, next) => {
        const token = utils.getToken(req.headers);
        const tokenData = utils.getTokenData(token);

        if (tokenData) {
            const isUser = await utils.isUser(tokenData.userId)
            if(!isUser) return res.status(401).send({error: "Invalid token"}); 

            const isAdmin = await utils.isAdmin(tokenData.userId);
            if (!isAdmin) return res.status(401).send({error: "Just admin"});
        }
        else return res.status(401).send({error: "Invalid token"});

        models.User.findAll()
            .then((users) => {
                res.send(users); 
            })
            .catch(() => res.status(500).send({error: "Error getting users"}));    
    },

    updateUser: async (req, res) => {
        const token = utils.getToken(req.headers);
        const tokenData = utils.getTokenData(token);

        if (tokenData) {
            const isUser = await utils.isUser(tokenData.userId)
            if(!isUser) return res.status(401).send({error: "Invalid token"}); 

            const isAdmin = await utils.isAdmin(tokenData.userId, true);
            if (!isAdmin) return res.status(401).send({error: "Just admin"});
        }
        else return res.status(401).send({error: "Invalid token"});

        const id = req.params.id;
        const newUser = req.body;

        if (userValidate(newUser)) {
            return models.User
                .update(newUser, {where: {id}})
                .then(async (user) => {
                    if(user[0])
                        res.send(await models.User.findByPk(id));
                    else
                        res.status(404).send({error: `ID ${id} not found`});
            })
            .catch(() => res.status(500).send({error: "Error updating user"}));   
        }  
        
        res.status(400).send({error: "Wrong informations in body, check fields"});
    },

    deleteUser: async (req, res) => {
        const token = utils.getToken(req.headers);
        const tokenData = utils.getTokenData(token);

        if (tokenData) {
            const isUser = await utils.isUser(tokenData.userId)
            if(!isUser) return res.status(401).send({error: "Invalid token"}); 

            const isAdmin = await utils.isAdmin(tokenData.userId, true);
            if (!isAdmin) return res.status(401).send({error: "Just admin"});
        }
        else return res.status(401).send({error: "Invalid token"});
        
        const id = req.params.id;

        models.User
            .destroy({where: {id}})
            .then((user) => {
                if(user)
                    res.send();
                else
                    res.status(404).send({error: `ID ${id} not found`});    
            })
            .catch(() => res.status(500).send({error: "Error deleting user"}));    
    },
};