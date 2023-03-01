const models = require("../database/models");

module.exports = {
    getProduct: (req, res) => {
        const id = req.params.id;

        models.Product.findByPk(id)
            .then((product) => {
                if(product)
                    res.send(product)
                else
                    res.status(404).send({error: `ID ${id} not found`});
            })
            .catch(() => res.status(400).send({error: "Error getting product"}));
    },

    getAll: (req, res, next) => {
        models.Product.findAll()
            .then((products) => {
                res.json(products);
            })
            .catch(() => res.status(400).send({error: "Error getting products"}));
    },

    createProduct: (req, res, next) => {
        const body = req.body;

        if (['name', 'price', 'description', 'quantity'].every(key => Object.keys(body).includes(key))) {
            return models.Product.create(body)
                .then((product) => {
                    res.json(product);
                })
                .catch(() => res.status(400).send({error: "Error creating products"}));
        } 

        res.status(400).send({error: "Missing informations"});
    },

    updateProduct: (req, res) => {
        const newProduct = req.body;
        const id = req.params.id;

        models.Product
            .update(newProduct, {where: {id}})
            .then(async (product) => {
                if(product[0])
                    res.send(await models.Product.findByPk(id));
                else
                    res.status(404).send({error: `ID ${id} not found`});
            })
            .catch(() => res.status(400).send({error: "Error updating product"}));
    },

    deleteProduct: (req, res) => {
        const id = req.params.id;

        models.Product
            .destroy({where: {id}})
            .then((product) => {
                if(product)
                    res.send();
                else
                    res.status(404).send({error: `ID ${id} not found`});    
            })
            .catch(() => res.status(400).send({error: "Error deleting product"}));
    },
};