const models = require("../database/models");
const productPostSchema = require("../schema/product/ProductPostSchema.json");
const productUpdateSchema = require("../schema/product/ProductUpdateSchema.json");
const utils = require("../utils");

const Ajv = require("ajv");
const ajv = new Ajv();
const productPostValidate = ajv.compile(productPostSchema);
const productUpdateValidate = ajv.compile(productUpdateSchema);

module.exports = {
    getProduct: async (req, res) => {
        const token = utils.getToken(req.headers);
        const tokenData = utils.getTokenData(token);

        if (tokenData) {
            const isUser = await utils.isUser(tokenData.userId)
            if(!isUser) return res.status(401).send({error: "Invalid token"}); 
        }
        else return res.status(401).send({error: "Invalid token"});
        
        const id = req.params.id;

        models.Product.findByPk(id)
            .then((product) => {
                if(product)
                    res.send(product)
                else
                    res.status(404).send({error: `ID ${id} not found`});
            })
            .catch(() => res.status(500).send({error: "Error getting product"}));
    },

    getAllProducts: async (req, res) => {
        const token = utils.getToken(req.headers);
        const tokenData = utils.getTokenData(token);

        if (tokenData) {
            const isUser = await utils.isUser(tokenData.userId)
            if(!isUser) return res.status(401).send({error: "Invalid token"}); 
        }
        else return res.status(401).send({error: "Invalid token"});

        models.Product.findAll()
            .then((products) => {
                res.send(products); 
            })
            .catch(() => res.status(500).send({error: "Error getting products"}));
    },

    createProduct: async (req, res) => {
        const token = utils.getToken(req.headers);
        const tokenData = utils.getTokenData(token);

        if (tokenData) {
            const isUser = await utils.isUser(tokenData.userId)
            if(!isUser) return res.status(401).send({error: "Invalid token"}); 

            const isAdmin = await utils.isAdmin(tokenData.userId);
            if (!isAdmin) return res.status(401).send({error: "Just admin"});
        }
        else return res.status(401).send({error: "Invalid token"});

        const body = req.body;

        if (productPostValidate(body)) {
            return models.Product.create(body)
                .then((product) => {
                    res.json(product);
                })
                .catch(() => res.status(500).send({error: "Error creating product"}));
        } 

        res.status(400).send({error: "Wrong informations in body, check fields"});
    },

    updateProduct: async (req, res) => {
        const token = utils.getToken(req.headers);
        const tokenData = utils.getTokenData(token);

        if (tokenData) {
            const isUser = await utils.isUser(tokenData.userId)
            if(!isUser) return res.status(401).send({error: "Invalid token"}); 

            const isAdmin = await utils.isAdmin(tokenData.userId);
            if (!isAdmin) return res.status(401).send({error: "Just admin"});
        }
        else return res.status(401).send({error: "Invalid token"});

        const newProduct = req.body;
        const id = req.params.id;

        if(productUpdateValidate(newProduct)){
            return models.Product
                .update(newProduct, {where: {id:id}})
                .then(async (product) => {
                    if(product[0])
                        res.send(await models.Product.findByPk(id));
                    else
                        res.status(404).send({error: `ID ${id} not found`});
                })
                .catch(() => res.status(500).send({error: "Error updating product"}));
        }

        res.status(400).send({error: "Wrong informations in body, check fields"});
    },

    deleteProduct: async (req, res) => {
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

        models.Product
            .destroy({where: {id}})
            .then((product) => {
                if(product)
                    res.send();
                else
                    res.status(404).send({error: `ID ${id} not found`});    
            })
            .catch(() => res.status(500).send({error: "Error deleting product"}));
    },
};