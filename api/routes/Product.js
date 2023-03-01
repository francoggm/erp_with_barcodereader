const express = require("express");
const controller = require("../controllers/ProductController");
const router = express.Router();

router.route("/product")
    .get(controller.getAll)
    .post(controller.createProduct);

router.route("/product/:id")
    .get(controller.getProduct)
    .put(controller.updateProduct)
    .delete(controller.deleteProduct);

module.exports = router;
