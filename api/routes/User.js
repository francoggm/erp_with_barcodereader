const express = require("express");
const controller = require("../controllers/UserController");
const router = express.Router();

router.route("/user")
    .get(controller.getAllUsers);

router.route("/user/:id")
    .get(controller.getUser)
    .put(controller.updateUser)
    .delete(controller.deleteUser);

module.exports = router;