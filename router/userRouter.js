const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controller/userController");

router.get("/me", authMiddleware.authenticated, userController.me);

module.exports = router;