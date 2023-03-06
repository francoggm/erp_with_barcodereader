const models = require("../database/models");
const productPostSchema = require("../schema/product/ProductPostSchema.json");
const productUpdateSchema = require("../schema/product/ProductUpdateSchema.json");

const Ajv = require("ajv");
const ajv = new Ajv();
const productPostValidate = ajv.compile(productPostSchema);
const productUpdateValidate = ajv.compile(productUpdateSchema);

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
            .catch(() => res.status(500).send({error: "Error getting product"}));
    },

    getAllProducts: (req, res) => {
        models.Product.findAll()
            .then((products) => {
                res.send(products); 
            })
            .catch(() => res.status(500).send({error: "Error getting products"}));
    },

    createProduct: (req, res) => {
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

    updateProduct: (req, res) => {
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
            .catch(() => res.status(500).send({error: "Error deleting product"}));
    },
};