const express = require("express");
const router = express.Router();
const publicController = require("../controller/publicController");

router.get("/post/:postId", publicController.getPost);
router.get("/user/:username",publicController.getUser);

module.exports = router;