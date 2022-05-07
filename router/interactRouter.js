const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const interactController = require("../controller/interactController")

router.put("/like/:postId", authMiddleware.authenticated,interactController.likePost);
router.put("/unlike/:postId", authMiddleware.authenticated,interactController.unlikePost)


module.exports = router;