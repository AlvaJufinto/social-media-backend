const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", authController.authSignup);
router.post("/login", authController.authLogin);
router.put("/edit/userauth", authMiddleware.authenticated, authController.editAuth);

module.exports = router