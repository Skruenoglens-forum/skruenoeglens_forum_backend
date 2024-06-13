const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const storage = require("../utils/storageConfig");

const router = express.Router();

const upload = multer({ storage });

router.route("/")
    .get(userController.getAll)                                                         // GET all users
    .post(upload.single("file"), userController.create);                                // POST create new user

router.route("/:id")
    .get(userController.getById)                                                        // GET user by ID
    .put(authMiddleware.roleCheck(false), upload.single("file"), userController.update) // PUT update user by ID
    .delete(authMiddleware.roleCheck(false), userController.delete);                    // DELETE delete user by ID

router.get("/:id/image", userController.getImageById);                                  // GET profile image by ID

router.put("/:id/ban", authMiddleware.roleCheck(true), userController.ban);             // PUT ban user by ID

router.put("/:id/unban", authMiddleware.roleCheck(true), userController.unban);         // PUT unban user by ID

module.exports = router;
