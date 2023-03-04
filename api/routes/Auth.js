const express = require("express");
const controller = require("../controllers/AuthController");
const router = express.Router();

router.post("/auth/login", controller.login)
router.post("/auth/register", controller.register);
router.post("/auth/me", controller.me);

module.exports = router;