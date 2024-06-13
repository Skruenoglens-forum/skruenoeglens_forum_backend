const express = require("express");
const multer = require("multer");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const storage = require("../utils/storageConfig");

const router = express.Router();

const upload = multer({ storage });

router.route("/")
    .get(postController.getall)                                                                 // GET all posts
    .post(authMiddleware.roleCheck(false), upload.array("images", 4), postController.create);   // POST create new post

router.route("/:id")
    .get(postController.getById)                                                                // GET post by ID
    .put(authMiddleware.roleCheck(false), upload.array("images", 4), postController.update)     // PUT update post by ID
    .delete(authMiddleware.roleCheck(false), postController.delete);                            // DELETE delete post by ID

router.get("/users/:id", postController.getAllByUserId);                                        // GET all posts by UserId

router.get("/:id/images", postController.getAllImagesById);                                     // GET all post image ids by postId

router.get("/image/:id", postController.getImageByImageId);                                     // GET image by postImageId

module.exports = router;
