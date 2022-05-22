const express = require("express");
const router = express.Router();
const publicController = require("../controller/publicController");

router.get("/post/:postId", publicController.getPost);
router.get("/post/likes/:postId", publicController.getPostLikes);
router.get("/user/:username",publicController.getUser);
router.get("/perks/:rPerks/:username",publicController.perks);

module.exports = router;