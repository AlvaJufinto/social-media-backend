const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controller/userController");
const multer = require("multer");
upload = multer();

router.get("/me", authMiddleware.authenticated, userController.me);
router.post("/addpost",authMiddleware.authenticated,upload.single("gambar") ,userController.addPost);
router.delete("/deletepost/:postId", authMiddleware.authenticated, authMiddleware.authorized, userController.deletepost);

module.exports = router;