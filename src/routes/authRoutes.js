const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", authController.login);                                                    // POST login

router.put("/new/password/:id", authMiddleware.roleCheck(false), authController.newPassword);   // PUT new password

module.exports = router;
