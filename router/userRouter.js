const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controller/userController");
const multerMidlldeware = require("../middleware/multerMiddleware");

// user related
router.get("/me", authMiddleware.authenticated, userController.me);
router.put("/editDetail", authMiddleware.authenticated, userController.editDetail);

// post related
router.post("/addpost",authMiddleware.authenticated,multerMidlldeware.uploadHandler ,userController.addPost);
router.delete("/deletepost/:postId", authMiddleware.authenticated, authMiddleware.authorized, multerMidlldeware.deleteHandler, userController.deletepost);

module.exports = router;