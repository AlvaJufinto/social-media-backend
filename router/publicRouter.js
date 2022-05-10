const express = require("express");
const router = express.Router();
const publicController = require("../controller/publicController");

router.get("/post/:postId", publicController.getPost);

module.exports = router;